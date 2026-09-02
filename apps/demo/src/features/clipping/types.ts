export type ClipperPoint = {
  X: number;
  Y: number;
};

export type ClipperPolygons = ClipperPoint[][];

export type FillType = "evenOdd" | "nonZero";
export type ClipOperation = "none" | "intersect" | "union" | "difference" | "xor";
export type OffsetTarget = "subject" | "clip" | "solution";
export type JoinType = "square" | "round" | "miter";

export type ClippingOptions = {
  subjectFillType: FillType;
  clipFillType: FillType;
  operation: ClipOperation;
  offsetTarget: OffsetTarget;
  joinType: JoinType;
  cleanDistance: number | null;
  simplify: boolean;
  lightenDistance: number | null;
  autoFix: boolean;
  delta: number;
  miterLimit: number;
  scale: number;
};

export type ClippingInput = {
  subject: ClipperPolygons;
  clip: ClipperPolygons;
};

export type ClippingResult = ClippingInput & {
  solution: ClipperPolygons;
};

export type ClipperEngine = {
  PolyType: { ptSubject: number; ptClip: number };
  ClipType: Record<Exclude<ClipOperation, "none">, number>;
  PolyFillType: Record<FillType, number>;
  JoinType: Record<JoinType, number>;
  Clipper: new () => {
    AddPolygons: (polygons: ClipperPolygons, type: number) => void;
    Execute: (operation: number, result: ClipperPolygons, subjectFill: number, clipFill: number) => boolean;
    SimplifyPolygons: (polygons: ClipperPolygons, fillType: number) => ClipperPolygons;
    OffsetPolygons: (polygons: ClipperPolygons, delta: number, joinType: number, miterLimit: number, autoFix: boolean) => ClipperPolygons;
  };
  Clone: (polygons: ClipperPolygons) => ClipperPolygons;
  Clean: (polygons: ClipperPolygons, distance: number) => ClipperPolygons;
  Lighten: (polygons: ClipperPolygons, distance: number) => ClipperPolygons;
};
