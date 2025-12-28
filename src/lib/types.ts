export interface Highlight {
  page: number;
  rects: { x: number; y: number; w: number; h: number }[];
  highlightColor: { r: number; g: number; b: number };
}
