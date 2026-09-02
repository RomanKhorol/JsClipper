import { parsePolygonJson, type ClipperPoint, type ClippingInput, type ClipperPolygons } from "../clipping";
import type { CustomPolygonSet } from "./customPolygons";

const scalePolygons = (polygons: ClipperPolygons, scale: number): ClipperPolygons =>
  polygons.map((polygon) => polygon.map(({ X, Y }) => ({
    X: Math.floor(X * scale),
    Y: Math.floor(Y * scale),
  })));

export const parseCustomPolygonInput = (
  polygonSet: CustomPolygonSet,
  scale: number,
): ClippingInput | null => {
  if (!Number.isFinite(scale) || scale <= 0) return null;
  const subject = parsePolygonJson(polygonSet.subj);
  const clip = parsePolygonJson(polygonSet.clip);
  return subject && clip
    ? { subject: scalePolygons(subject, scale), clip: scalePolygons(clip, scale) }
    : null;
};

const isPointValue = (value: unknown): value is { X?: unknown; Y?: unknown; x?: unknown; y?: unknown } =>
  typeof value === "object" && value !== null;

const toPoint = (value: unknown): ClipperPoint | null => {
  if (!isPointValue(value)) return null;
  const X = "X" in value ? Number(value.X) : Number(value.x);
  const Y = "Y" in value ? Number(value.Y) : Number(value.y);
  return Number.isFinite(X) && Number.isFinite(Y) ? { X, Y } : null;
};

const parseSvgPath = (value: string): ClipperPolygons | null => {
  const tokens = value.match(/[MmLlHhVvZz]|[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g);
  if (!tokens?.length) return null;
  const polygons: ClipperPolygons = [];
  let polygon: ClipperPoint[] | null = null;
  let command = "";
  let index = 0;
  let current = { X: 0, Y: 0 };
  const number = () => {
    const next = Number(tokens[index]);
    if (!Number.isFinite(next)) return null;
    index += 1;
    return next;
  };
  while (index < tokens.length) {
    if (/^[MmLlHhVvZz]$/.test(tokens[index])) command = tokens[index++];
    if (!command) return null;
    if (command.toUpperCase() === "Z") { polygon = null; command = ""; continue; }
    const x = number();
    const y = command.toUpperCase() === "H" ? null : command.toUpperCase() === "V" ? x : number();
    if (x === null || y === null) return null;
    const point = command.toUpperCase() === "H" ? { X: x, Y: current.Y } : command.toUpperCase() === "V" ? { X: current.X, Y: x } : { X: x, Y: y };
    if (command === command.toLowerCase()) { point.X += current.X; point.Y += current.Y; }
    if (command.toUpperCase() === "M") { polygon = []; polygons.push(polygon); command = command === "m" ? "l" : "L"; }
    if (!polygon) return null;
    polygon.push(point); current = point;
  }
  return polygons.length ? polygons : null;
};

export const normalizePolygonInput = (value: string): string | null => {
  const source = value.trim();
  if (!source) return null;
  if (/^[Mm]/.test(source)) {
    const polygons = parseSvgPath(source);
    return polygons ? JSON.stringify(polygons) : null;
  }
  const normalized = source.replace(/[\s,]+/g, ",");
  const wrapped = `${normalized.startsWith("[") ? normalized : `[${normalized}`}${normalized.endsWith("]") ? "" : "]"}`;
  try {
    const parsed: unknown = JSON.parse(wrapped);
    const rawPolygons = Array.isArray(parsed) && typeof parsed[0] === "number"
      ? [parsed] : Array.isArray(parsed) && Array.isArray(parsed[0]) ? parsed : [parsed];
    const polygons = rawPolygons.map((rawPolygon) => {
      if (!Array.isArray(rawPolygon)) return null;
      if (typeof rawPolygon[0] === "number") {
        if (rawPolygon.length % 2) return null;
        const points: ClipperPoint[] = [];
        for (let index = 0; index < rawPolygon.length; index += 2) {
          const X = rawPolygon[index]; const Y = rawPolygon[index + 1];
          if (typeof X !== "number" || typeof Y !== "number") return null;
          points.push({ X, Y });
        }
        return points;
      }
      const points = rawPolygon.map(toPoint);
      return points.every((point): point is ClipperPoint => point !== null) ? points : null;
    });
    return polygons.every((polygon): polygon is ClipperPoint[] => polygon !== null) ? JSON.stringify(polygons) : null;
  } catch { return null; }
};
