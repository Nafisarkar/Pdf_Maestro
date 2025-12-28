import { type Highlight } from "@/lib/types";

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

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {pageHighlights.map((h, i) =>
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
              key={`${i}-${j}`}
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
              }}
            />
          );
        })
      )}
    </div>
  );
}
