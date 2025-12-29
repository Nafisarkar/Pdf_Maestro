import { type Highlight } from "@/lib/types";
import { useAtomValue } from "jotai";
import { toolAtom } from "@/lib/atoms";
import { usePdfHighlights } from "@/hooks/usePdfHighlights";

export function HighlightOverlay({
  highlights,
  pageNumber,
  originalWidth,
  originalHeight,
}: {
  highlights: Highlight[];
  pageNumber: number;
  originalWidth: number;
  originalHeight: number;
}) {
  const pageHighlights = highlights.filter((h) => h.page === pageNumber);
  const activeTool = useAtomValue(toolAtom);
  const { removeHighlight } = usePdfHighlights();

  return (
    <div
      className={`absolute inset-0 z-10 ${
        activeTool === "eraser" ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {pageHighlights.map((h) =>
        h.rects.map((rect, j) => {
          // Calculate percentages
          const left = (rect.x / originalWidth) * 100;
          const width = (rect.w / originalWidth) * 100;
          const height = (rect.h / originalHeight) * 100;
          const top =
            ((originalHeight - rect.y - rect.h) / originalHeight) * 100;

          const color = h.highlightColor || { r: 0, g: 1, b: 0 };
          return (
            <div
              key={`${h.id}-${j}`}
              onClick={() => {
                if (activeTool === "eraser") {
                  removeHighlight(h.id);
                }
              }}
              className={activeTool === "eraser" ? "cursor-crosshair" : ""}
              style={{
                position: "absolute",
                backgroundColor: `rgba(${color.r * 255}, ${color.g * 255}, ${
                  color.b * 255
                }, 0.3)`,
                mixBlendMode: "multiply",
                left: `${left}%`,
                top: `${top}%`,
                width: `${width}%`,
                height: `${height}%`,
                pointerEvents: activeTool === "eraser" ? "auto" : "none",
              }}
            />
          );
        })
      )}
    </div>
  );
}
