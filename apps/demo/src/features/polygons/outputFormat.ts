import type { ClipperPoint, ClipperPolygons } from "../clipping";

export type PolygonOutputFormat = "Clipper" | "Plain" | "SVG";

const pointToCoordinates = ({ X, Y }: ClipperPoint): string => `${X},${Y}`;

export const formatPolygonOutput = (
  polygons: ClipperPolygons,
  format: PolygonOutputFormat,
): string => {
  if (format === "Clipper") return JSON.stringify(polygons);

  if (format === "Plain") {
    return `[${polygons.map((polygon) => `[${polygon.map(pointToCoordinates).join(", ")}]`).join(",")}]`;
  }

  return polygons.map((polygon) => `M${polygon.map(pointToCoordinates).join(" L")}Z`).join(" ");
};

const polygonArea = (polygon: ClipperPoint[]): number => polygon.reduce(
  (area, point, index) => {
    const next = polygon[(index + 1) % polygon.length];
    return area + point.X * next.Y - next.X * point.Y;
  },
  0,
) / 2;

export const polygonsArea = (polygons: ClipperPolygons): number =>
  polygons.reduce((area, polygon) => area + polygonArea(polygon), 0);
