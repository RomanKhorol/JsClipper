import type { PolygonSource } from "./types";
import builtInPolygonData from "./builtInPolygons.json";

export const builtInPolygonSourceIds = {
  arrows: 0,
  texts: 1,
  rects: 2,
  same: 3,
  starAndRect: 6,
  spiral: 7,
  gridAndStar: 8,
  glyph: 9,
} as const satisfies Partial<Record<PolygonSource, number>>;

export type BuiltInPolygonSource = keyof typeof builtInPolygonSourceIds;

export type BuiltInPolygonSet = {
  subj: string;
  clip: string;
};

const polygonSets = builtInPolygonData as unknown as ReadonlyArray<BuiltInPolygonSet | null>;

export const isBuiltInPolygonSource = (value: string): value is BuiltInPolygonSource =>
  value in builtInPolygonSourceIds;

export const getBuiltInPolygonSourceId = (source: BuiltInPolygonSource): number =>
  builtInPolygonSourceIds[source];

export const getBuiltInPolygonSet = (source: BuiltInPolygonSource): BuiltInPolygonSet => {
  const polygonSet = polygonSets[getBuiltInPolygonSourceId(source)];
  if (!polygonSet) throw new Error(`Built-in polygon source is missing: ${source}`);
  return polygonSet;
};
