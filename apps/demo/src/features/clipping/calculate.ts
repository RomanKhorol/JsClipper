import type {
  ClipperEngine,
  ClipperPolygons,
  ClippingInput,
  ClippingOptions,
  ClippingResult,
} from "./types";

const isPoint = (value: unknown): value is { X: number; Y: number } =>
  typeof value === "object" && value !== null &&
  "X" in value && "Y" in value &&
  typeof value.X === "number" && Number.isFinite(value.X) &&
  typeof value.Y === "number" && Number.isFinite(value.Y);

export const parsePolygons = (value: unknown): ClipperPolygons | null =>
  Array.isArray(value) && value.every((polygon) => Array.isArray(polygon) && polygon.every(isPoint))
    ? value.map((polygon) => polygon.map(({ X, Y }) => ({ X, Y })))
    : null;

export const parsePolygonJson = (value: string): ClipperPolygons | null => {
  try {
    return parsePolygons(JSON.parse(value) as unknown);
  } catch {
    return null;
  }
};

const selectedPolygons = (
  engine: ClipperEngine,
  input: ClippingInput,
  solution: ClipperPolygons,
  target: ClippingOptions["offsetTarget"],
): ClipperPolygons => {
  if (target === "subject") return engine.Clone(input.subject);
  if (target === "clip") return engine.Clone(input.clip);
  return solution;
};

export const calculateClipping = (
  engine: ClipperEngine,
  input: ClippingInput,
  options: ClippingOptions,
): ClippingResult => {
  const clipper = new engine.Clipper();
  const solution: ClipperPolygons = [];

  if (options.operation !== "none" && options.offsetTarget === "solution") {
    clipper.AddPolygons(input.subject, engine.PolyType.ptSubject);
    clipper.AddPolygons(input.clip, engine.PolyType.ptClip);
    clipper.Execute(
      engine.ClipType[options.operation],
      solution,
      engine.PolyFillType[options.subjectFillType],
      engine.PolyFillType[options.clipFillType],
    );
  }

  let result = selectedPolygons(engine, input, solution, options.offsetTarget);
  if (options.cleanDistance !== null) result = engine.Clean(result, options.cleanDistance * options.scale);

  if (options.simplify) {
    const fillType = options.offsetTarget === "subject"
      ? options.subjectFillType
      : options.clipFillType;
    result = clipper.SimplifyPolygons(result, engine.PolyFillType[fillType]);
  }

  if (options.delta !== 0) {
    result = clipper.OffsetPolygons(
      result,
      Math.round(options.delta * options.scale * 1000) / 1000,
      engine.JoinType[options.joinType],
      Math.round(options.miterLimit * 1000) / 1000,
      options.autoFix,
    );
  }

  if (options.lightenDistance !== null) {
    result = engine.Lighten(result, options.lightenDistance * options.scale);
    if (options.simplify) result = clipper.SimplifyPolygons(result, engine.PolyFillType[options.subjectFillType]);
  }

  return { ...input, solution: result };
};
