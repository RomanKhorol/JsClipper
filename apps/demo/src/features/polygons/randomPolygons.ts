import type { ClippingInput, ClipperPoint, ClipperPolygons } from "../clipping";

export type RandomPolygonCounts = {
  clipPointCount: number;
  clipPolygonCount: number;
  subjPointCount: number;
  subjPolygonCount: number;
};

export type RandomPolygonKind = "randomRectangles" | "random";

const canvas = { width: 500, height: 350, margin: 10 };

const randomInteger = (minimum: number, maximum: number, random: () => number): number =>
  Math.floor(random() * (maximum - minimum + 1)) + minimum;

const createRandomPolygons = (
  polygonCount: number,
  pointCount: number,
  kind: RandomPolygonKind,
  scale: number,
  random: () => number,
): ClipperPolygons => {
  const minX = canvas.margin * scale;
  const maxX = (canvas.width - canvas.margin) * scale;
  const minY = canvas.margin * scale;
  const maxY = (canvas.height - canvas.margin) * scale;

  return Array.from({ length: polygonCount }, () => {
    let previousX: number | null = null;
    let previousY: number | null = null;
    let previousVertical: boolean | null = null;
    const polygon: ClipperPoint[] = [];

    for (let index = 0; index < pointCount; index += 1) {
      let vertical = false;
      if (kind === "randomRectangles") {
        vertical = randomInteger(0, 1, random) === 1;
        if (previousVertical === vertical) vertical = !vertical;
      }

      const point: ClipperPoint = kind === "randomRectangles"
        ? vertical
          ? { X: previousX ?? randomInteger(minX, maxX, random), Y: randomInteger(minY, maxY, random) }
          : { X: randomInteger(minX, maxX, random), Y: previousY ?? randomInteger(minY, maxY, random) }
        : { X: randomInteger(minX, maxX, random), Y: randomInteger(minY, maxY, random) };

      if (kind === "randomRectangles" && index === pointCount - 1 && pointCount !== 1 && polygon[0]) {
        if (vertical) point.Y = polygon[0].Y;
        else point.X = polygon[0].X;
      }
      polygon.push(point);
      previousX = point.X;
      previousY = point.Y;
      previousVertical = vertical;
    }
    return polygon;
  });
};

export const generateRandomPolygonInput = (
  kind: RandomPolygonKind,
  counts: RandomPolygonCounts,
  scale: number,
  random: () => number = Math.random,
): ClippingInput => ({
  subject: createRandomPolygons(counts.subjPolygonCount, counts.subjPointCount, kind, scale, random),
  clip: createRandomPolygons(counts.clipPolygonCount, counts.clipPointCount, kind, scale, random),
});

export const defaultRandomPolygonCounts: RandomPolygonCounts = {
  clipPointCount: 3,
  clipPolygonCount: 1,
  subjPointCount: 8,
  subjPolygonCount: 2,
};

export const isRandomPolygonCounts = (value: unknown): value is RandomPolygonCounts =>
  typeof value === "object" && value !== null &&
  ["clipPointCount", "clipPolygonCount", "subjPointCount", "subjPolygonCount"].every(
    (key) => key in value && typeof value[key as keyof typeof value] === "number",
  );
