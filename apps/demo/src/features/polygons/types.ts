export const polygonSources = [
  "arrows",
  "texts",
  "rects",
  "same",
  "randomRectangles",
  "random",
  "starAndRect",
  "spiral",
  "gridAndStar",
  "glyph",
  "custom",
] as const;

export type PolygonSource = (typeof polygonSources)[number];

export { normalizePolygonInput, parseCustomPolygonInput } from "./polygonInput";
