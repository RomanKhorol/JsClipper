import type { ClippingOptions } from "../clipping";

export type BenchmarkMode = "Normal" | "Big Integer";
export type BenchmarkDefinition = { id: "benchmark1" | "benchmark1b" | "benchmark2" | "benchmark2b"; label: string; mode: BenchmarkMode; repetitions: number; scale: number };
export type BenchmarkRun = { id: BenchmarkDefinition["id"]; mode: BenchmarkMode; runs: string; status: "Running" | "Completed" | "Cancelled" | "Failed"; completed: number; total: number; durationMs?: number; error?: string };

export const benchmarkDefinitions: readonly BenchmarkDefinition[] = [
  { id: "benchmark1", label: "Run NB", mode: "Normal", repetitions: 1, scale: 100 },
  { id: "benchmark1b", label: "Run NB 5x", mode: "Normal", repetitions: 5, scale: 100 },
  { id: "benchmark2", label: "Run BIB", mode: "Big Integer", repetitions: 1, scale: 100000000 },
  { id: "benchmark2b", label: "Run BIB 5x", mode: "Big Integer", repetitions: 5, scale: 100000000 },
];

const sources = ["arrows", "texts", "spiral", "gridAndStar", "glyph"] as const;
const operations = ["none", "intersect", "union", "difference", "xor"] as const;
const joinTypes = ["square", "round", "miter"] as const;
const deltas = [-5, 0, 10, 30];

export const createBenchmarkOptions = (scale: number): ClippingOptions[] => {
  const options: ClippingOptions[] = [];
  for (const operation of operations) {
    const targets = operation === "none" ? ["subject", "clip"] as const : ["solution"] as const;
    for (const offsetTarget of targets) for (const joinType of joinTypes) for (const delta of deltas) {
      const miterLimits = joinType === "miter" && delta !== 0 ? [1, 3, 5] : [1];
      for (const miterLimit of miterLimits) options.push({ subjectFillType: "nonZero", clipFillType: "nonZero", operation, offsetTarget, joinType, cleanDistance: null, simplify: false, lightenDistance: null, autoFix: true, delta, miterLimit, scale });
    }
  }
  return options;
};

const waitForBrowser = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

export const runBenchmark = async (definition: BenchmarkDefinition, signal: AbortSignal, onProgress: (completed: number, total: number) => void): Promise<BenchmarkRun> => {
  const [{ clipperEngine }, { calculateClipping }, { getBuiltInPolygonSet }, { parseCustomPolygonInput }] = await Promise.all([
    import("../../adapters/clipperEngine"), import("../clipping"), import("../polygons/builtIn"), import("../polygons/types"),
  ]);
  const options = createBenchmarkOptions(definition.scale);
  const inputs = sources.map((source) => parseCustomPolygonInput(getBuiltInPolygonSet(source), definition.scale));
  if (inputs.some((input) => input === null)) throw new Error("A benchmark polygon set could not be parsed.");
  const total = inputs.length * options.length * definition.repetitions;
  const start = performance.now();
  let completed = 0;
  for (let repeat = 0; repeat < definition.repetitions; repeat += 1) for (const input of inputs) for (const option of options) {
    if (signal.aborted) return { id: definition.id, mode: definition.mode, runs: String(definition.repetitions), status: "Cancelled", completed, total };
    calculateClipping(clipperEngine, input!, option);
    completed += 1;
    if (completed % 25 === 0 || completed === total) { onProgress(completed, total); await waitForBrowser(); }
  }
  return { id: definition.id, mode: definition.mode, runs: String(definition.repetitions), status: "Completed", completed, total, durationMs: Math.round(performance.now() - start) };
};
