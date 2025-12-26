import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Button } from "./components/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { readFile } from "@tauri-apps/plugin-fs";
import { Document, Page, pdfjs } from "react-pdf";
import { FileUp } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function App() {
  // --- State ---
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);

  // Dimensions for responsive scaling
  const [renderedDimensions, setRenderedDimensions] = useState({
    width: 0,
    height: 0,
  });

  // UI States
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const resizeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- Effects ---

  // Handle Window Resizing (Debounced)
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width - 32;
      const h = entry.contentRect.height - 48;

      // Immediate update for first load
      setRenderedDimensions((prev) =>
        prev.width === 0 ? { width: w, height: h } : prev
      );
      setIsResizing(true);

      if (resizeTimeout.current) clearTimeout(resizeTimeout.current);
      resizeTimeout.current = setTimeout(() => {
        setRenderedDimensions({ width: w, height: h });
        setIsResizing(false);
      }, 300);
    });

    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
      if (resizeTimeout.current) clearTimeout(resizeTimeout.current);
    };
  }, []);

  // Keyboard Navigation
  const changePage = useCallback(
    (offset: number) =>
      setPageNumber((prev) => Math.max(1, Math.min(numPages, prev + offset))),
    [numPages]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") changePage(1);
      if (e.key === "ArrowLeft") changePage(-1);
      if (e.ctrlKey && (e.key === "+" || e.key === "=")) {
        setScale((s) => s + 0.1);
      }
      if (e.ctrlKey && (e.key === "-" || e.key === "_")) {
        setScale((s) => Math.max(0.5, s - 0.1));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [changePage]);

  // --- Actions ---
  const selectPdf = async () => {
    const selected = await open({
      multiple: false,
      filters: [{ name: "PDF", extensions: ["pdf"] }],
    });
    if (typeof selected === "string") {
      const contents = await readFile(selected);
      setPdfUrl(
        URL.createObjectURL(new Blob([contents], { type: "application/pdf" }))
      );
    }
  };

  // --- Calculations ---
  const pageWidth =
    Math.min(renderedDimensions.width, renderedDimensions.height * 0.707) *
    scale;

  return (
    <div className="w-full h-screen flex flex-col bg-muted/30 overflow-hidden font-sans antialiased min-w-100">
      <Navbar onOpen={selectPdf} />

      <main
        ref={containerRef}
        className="flex-1 overflow-auto relative flex flex-col items-center p-4"
      >
        {!pdfUrl ? (
          <WelcomeScreen onSelect={selectPdf} />
        ) : (
          <div className="flex-1 w-full flex flex-col items-center justify-center">
            <div
              className={`bg-white shadow-2xl border border-border/40 rounded-sm overflow-hidden transition-all duration-500 ${
                isResizing
                  ? "opacity-40 scale-[0.99] blur-[2px]"
                  : "opacity-100 scale-100 blur-0"
              }`}
            >
              <Document
                file={pdfUrl}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                loading={null}
              >
                <Page
                  pageNumber={pageNumber}
                  width={pageWidth || 400}
                  loading={null}
                  devicePixelRatio={Math.min(2, window.devicePixelRatio)}
                  onRenderSuccess={() => setIsPageLoading(false)}
                  onLoadStart={() => setIsPageLoading(true)}
                  className={`transition-opacity duration-300 ${
                    isPageLoading ? "opacity-0" : "opacity-100"
                  }`}
                />
              </Document>
            </div>
          </div>
        )}
      </main>

      <Footer
        currentpage={pageNumber}
        totalpage={numPages}
        scale={scale}
        onPageChange={changePage}
        onScaleChange={setScale}
      />
    </div>
  );
}

function WelcomeScreen({ onSelect }: { onSelect: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto text-center select-none">
      <div
        className="group cursor-pointer flex flex-col items-center"
        onClick={onSelect}
      >
        <FileUp className="size-10 text-muted-foreground/40 group-hover:text-primary transition-colors duration-300" />

        <div className="mt-6 space-y-1">
          <h1 className="text-sm font-bold tracking-[0.4em] uppercase text-foreground/80">
            Pdf Maestro
          </h1>
          <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60">
            Minimal Document Viewer
          </p>
        </div>
      </div>

      <div className="mt-12">
        <Button
          onClick={onSelect}
          variant="ghost"
          className="h-8 px-8 text-[9px] uppercase tracking-[0.3em] font-bold rounded-none border border-transparent hover:border-border/50 transition-all duration-300"
        >
          Open File
        </Button>
      </div>
    </div>
  );
}

export default App;
