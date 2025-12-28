import { useState, useCallback, useEffect, useRef } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { readFile } from "@tauri-apps/plugin-fs";
import { listen } from "@tauri-apps/api/event";
import { useAtom } from "jotai";
import {
  pdfUrlAtom,
  pdfPathAtom,
  numPagesAtom,
  pageNumberAtom,
  scaleAtom,
} from "../lib/atoms";

const SCALE_STEP = 0.1;
const MIN_SCALE = 0.5;
const MAX_SCALE = 3.0;
const RESIZE_DEBOUNCE_MS = 300;
const ASPECT_RATIO = 0.707; // A4 aspect ratio

export function usePdfViewer() {
  const [pdfUrl, setPdfUrl] = useAtom(pdfUrlAtom);
  const [pdfPath, setPdfPath] = useAtom(pdfPathAtom);
  const [numPages, setNumPages] = useAtom(numPagesAtom);
  const [pageNumber, setPageNumber] = useAtom(pageNumberAtom);
  const [scale, setScale] = useAtom(scaleAtom);

  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [renderedDimensions, setRenderedDimensions] = useState({
    width: 0,
    height: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const resizeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadFile = useCallback(
    async (filePath: string) => {
      try {
        const contents = await readFile(filePath);
        const blob = new Blob([contents], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        setPdfUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
        setPdfPath(filePath);
        setPageNumber(1);
      } catch (error) {
        console.error("Failed to read file:", error);
      }
    },
    [setPdfUrl, setPageNumber]
  );

  const selectPdf = useCallback(async () => {
    const selected = await open({
      multiple: false,
      filters: [{ name: "PDF", extensions: ["pdf"] }],
    });
    if (typeof selected === "string") {
      await loadFile(selected);
    }
  }, [loadFile]);

  const changePage = useCallback(
    (offset: number) => {
      setPageNumber((prev) => Math.max(1, Math.min(numPages, prev + offset)));
    },
    [numPages, setPageNumber]
  );

  const zoomIn = useCallback(() => {
    setScale((s) => Math.min(MAX_SCALE, s + SCALE_STEP));
  }, [setScale]);

  const zoomOut = useCallback(() => {
    setScale((s) => Math.max(MIN_SCALE, s - SCALE_STEP));
  }, [setScale]);

  const resetZoom = useCallback(() => {
    setScale(1.0);
  }, [setScale]);

  // Listen for external file open events
  useEffect(() => {
    const unlistenPromise = listen<string>("open-file", (event) => {
      loadFile(event.payload);
    });

    return () => {
      unlistenPromise.then((unlisten) => unlisten());
    };
  }, [loadFile]);

  // Handle Window Resizing
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width - 32;
      const h = entry.contentRect.height - 48;

      setRenderedDimensions((prev) =>
        prev.width === 0 ? { width: w, height: h } : prev
      );
      setIsResizing(true);

      if (resizeTimeout.current) clearTimeout(resizeTimeout.current);
      resizeTimeout.current = setTimeout(() => {
        setRenderedDimensions({ width: w, height: h });
        setIsResizing(false);
      }, RESIZE_DEBOUNCE_MS);
    });

    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
      if (resizeTimeout.current) clearTimeout(resizeTimeout.current);
    };
  }, []);

  // Keyboard Navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") changePage(1);
      if (e.key === "ArrowLeft") changePage(-1);
      if (e.ctrlKey && (e.key === "+" || e.key === "=")) {
        e.preventDefault();
        zoomIn();
      }
      if (e.ctrlKey && (e.key === "-" || e.key === "_")) {
        e.preventDefault();
        zoomOut();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [changePage, zoomIn, zoomOut]);

  const pageWidth =
    Math.min(
      renderedDimensions.width,
      renderedDimensions.height * ASPECT_RATIO
    ) * scale;

  return {
    pdfUrl,
    numPages,
    pageNumber,
    scale,
    isPageLoading,
    isResizing,
    containerRef,
    pageWidth,
    setNumPages,
    setPageNumber,
    setScale,
    setIsPageLoading,
    selectPdf,
    changePage,
    zoomIn,
    zoomOut,
    resetZoom,
  };
}
