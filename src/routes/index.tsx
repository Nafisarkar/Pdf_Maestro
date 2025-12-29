import Footer from "@/components/Footer";
import WelcomeScreen from "@/components/Welcomescreen";
import { createFileRoute } from "@tanstack/react-router";
import { usePdfViewer } from "@/hooks/usePdfViewer";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import Toptoolbar from "@/components/Toptoolbar";
import { usePdfHighlights } from "@/hooks/usePdfHighlights";
import { HighlightOverlay } from "@/components/HighlightOverlay";
import { useAtomValue } from "jotai";
import { toolAtom, userSettingsAtom } from "@/lib/atoms";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    pdfUrl,
    numPages,
    pageNumber,
    scale,
    isPageLoading,
    isResizing,
    containerRef,
    pageWidth,
    setNumPages,
    setIsPageLoading,
    selectPdf,
    changePage,
    zoomIn,
    zoomOut,
    resetZoom,
  } = usePdfViewer();

  const { highlights, addHighlight, setHighlights } = usePdfHighlights();
  const activeTool = useAtomValue(toolAtom);
  const userSavedSettings = useAtomValue(userSettingsAtom);
  const [pageDims, setPageDims] = useState<{ w: number; h: number } | null>(
    null
  );

  // Reset state when pdfUrl changes
  const [currentPdfUrl, setCurrentPdfUrl] = useState(pdfUrl);
  if (pdfUrl !== currentPdfUrl) {
    setCurrentPdfUrl(pdfUrl);
    setPageDims(null);
    setHighlights([]);
  }

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

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (
      activeTool === "highlighter" &&
      selection &&
      !selection.isCollapsed &&
      pageDims
    ) {
      addHighlight(selection, pageNumber, pageDims.w, pageDims.h);
    }
  };

  return (
    <>
      <main
        ref={containerRef}
        className="flex-1 overflow-auto relative flex flex-col items-center "
      >
        {!pdfUrl ? (
          <WelcomeScreen onSelect={selectPdf} />
        ) : (
          <div className="flex-1 w-full flex flex-col">
            {!userSavedSettings.hidetoptoolbar && <Toptoolbar />}
            <div
              className={`flex-1 w-full flex flex-col items-center justify-center ${!userSavedSettings.hidetoptoolbar ? "mt-9" : ""}`}
            >
              <div
                className={`bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-2xl border border-border/60 rounded-sm overflow-hidden transition-all duration-500 ${
                  isResizing ? "opacity-40  blur-[2px]" : "opacity-100  blur-0"
                }`}
              >
                <Document
                  key={pdfUrl}
                  file={pdfUrl}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  loading={null}
                >
                  <div onMouseUp={handleMouseUp} className="relative">
                    <Page
                      pageNumber={pageNumber}
                      width={pageWidth || 400}
                      loading={null}
                      devicePixelRatio={Math.min(2, window.devicePixelRatio)}
                      onRenderSuccess={() => setIsPageLoading(false)}
                      onLoadStart={() => setIsPageLoading(true)}
                      onLoadSuccess={(page) =>
                        setPageDims({
                          w: page.originalWidth,
                          h: page.originalHeight,
                        })
                      }
                      className={`transition-opacity duration-300 border-border/30 ${
                        isPageLoading ? "opacity-0" : "opacity-100"
                      }`}
                    >
                      {pageDims && (
                        <HighlightOverlay
                          highlights={highlights}
                          pageNumber={pageNumber}
                          originalWidth={pageDims.w}
                          originalHeight={pageDims.h}
                        />
                      )}
                    </Page>
                  </div>
                </Document>
              </div>
            </div>
          </div>
        )}
      </main>

      {pdfUrl && (
        <Footer
          currentpage={pageNumber}
          totalpage={numPages}
          scale={scale}
          onPageChange={changePage}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onResetZoom={resetZoom}
        />
      )}
    </>
  );
}
