import Footer from "@/components/Footer";
import WelcomeScreen from "@/components/Welcomescreen";
import { createFileRoute } from "@tanstack/react-router";
import { usePdfViewer } from "@/hooks/usePdfViewer";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import Toptoolbar from "@/components/Toptoolbar";


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

  return (
    <>
      <main
        ref={containerRef}
        className="flex-1 overflow-auto relative flex flex-col items-center p-2"
      >
        {!pdfUrl ? (
          <WelcomeScreen onSelect={selectPdf} />
        ) : (
          <div className="flex-1 w-full flex flex-col items-center justify-center">
            <Toptoolbar />
            <div
              className={`bg-white shadow-2xl border border-border/40 rounded-sm overflow-hidden transition-all duration-500 max-w-300 ${
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
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetZoom={resetZoom}
      />
    </>
  );
}
