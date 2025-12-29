import { atom, useAtom, useAtomValue } from "jotai";
import { PDFDocument, rgb } from "pdf-lib";
import { readFile, writeFile } from "@tauri-apps/plugin-fs";
import { highlightColorAtom, pdfUrlAtom } from "@/lib/atoms";
import { type Highlight } from "@/lib/types";

// Store highlights in memory
export const highlightsAtom = atom<Highlight[]>([]);

export function usePdfHighlights() {
  const [highlights, setHighlights] = useAtom(highlightsAtom);
  const currentColor = useAtomValue(highlightColorAtom);
  const [, setPdfUrl] = useAtom(pdfUrlAtom);

  // 1. Function to add a highlight from text selection
  const addHighlight = (
    selection: Selection,
    pageNumber: number,
    originalWidth: number, // The real width of the PDF page (points)
    originalHeight: number // The real height of the PDF page (points)
  ) => {
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const rects = range.getClientRects();

    // Get the page element's position to calculate relative coordinates
    const pageElement =
      selection.anchorNode?.parentElement?.closest(".react-pdf__Page");
    if (!pageElement) return;
    const pageRect = pageElement.getBoundingClientRect();

    // Calculate scale factor based on current DOM state
    const scaleX = pageRect.width / originalWidth;
    const scaleY = pageRect.height / originalHeight;

    const rawRects = Array.from(rects).map((rect) => {
      return {
        // Convert screen pixels to PDF coordinates
        x: (rect.left - pageRect.left) / scaleX,
        // PDF Y-axis starts from bottom, so we flip it
        y: originalHeight - (rect.top - pageRect.top + rect.height) / scaleY,
        w: rect.width / scaleX,
        h: rect.height / scaleY,
      };
    });

    // Merge overlapping rects on the same line
    const mergedRects: typeof rawRects = [];
    if (rawRects.length > 0) {
      // Sort by Y (descending) then X (ascending)
      rawRects.sort((a, b) => {
        if (Math.abs(a.y - b.y) > 2) return b.y - a.y;
        return a.x - b.x;
      });

      let current = rawRects[0];
      for (let i = 1; i < rawRects.length; i++) {
        const next = rawRects[i];

        // Check if on same line (vertical alignment)
        const isSameLine =
          Math.abs(current.y - next.y) < 3 && Math.abs(current.h - next.h) < 3;

        // Check horizontal overlap
        const isHorizontalOverlap = next.x <= current.x + current.w + 1;

        if (isSameLine && isHorizontalOverlap) {
          // Merge
          const newW =
            Math.max(current.x + current.w, next.x + next.w) - current.x;
          const newH = Math.max(current.h, next.h);
          current = { ...current, w: newW, h: newH };
        } else {
          mergedRects.push(current);
          current = next;
        }
      }
      mergedRects.push(current);
    }

    setHighlights((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        page: pageNumber,
        rects: mergedRects,
        highlightColor: currentColor,
      },
    ]);
    selection.removeAllRanges();
  };

  const removeHighlight = (id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  };

  // 2. Function to save the PDF
  const savePdf = async (pdfPath: string) => {
    if (!pdfPath || highlights.length === 0) return;
    try {
      const pdfBytes = await readFile(pdfPath);
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();

      highlights.forEach((h) => {
        const page = pages[h.page - 1]; // PDF pages are 0-indexed
        if (!page) return;

        h.rects.forEach((rect) => {
          const color = h.highlightColor || { r: 0, g: 1, b: 0 };
          page.drawRectangle({
            x: rect.x,
            y: rect.y,
            width: rect.w,
            height: rect.h,
            color: rgb(color.r, color.g, color.b),
            opacity: 0.4,
          });
        });
      });

      const modifiedPdfBytes = await pdfDoc.save();
      await writeFile(pdfPath, modifiedPdfBytes);

      // Reload the PDF to show changes
      const blob = new Blob([modifiedPdfBytes as BlobPart], {
        type: "application/pdf",
      });
      const newUrl = URL.createObjectURL(blob);
      setPdfUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return newUrl;
      });

      alert("PDF Saved Successfully!");
      setHighlights([]); // Clear unsaved highlights
    } catch (err) {
      console.error(err);
      alert(
        `Failed to save PDF: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  };

  return { highlights, setHighlights, addHighlight, removeHighlight, savePdf };
}
