import type { BenchmarkRun } from "./benchmark";
export { benchmarkRunsToCsv } from "./csv";

const serializeBenchmarkRuns = (runs: BenchmarkRun[]): Promise<string> =>
  new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL("./benchmarkCsv.worker.ts", import.meta.url),
      { type: "module" },
    );

    worker.onmessage = ({ data }: MessageEvent<string>) => {
      worker.terminate();
      resolve(data);
    };
    worker.onerror = (event) => {
      worker.terminate();
      reject(new Error(event.message || "Unable to create benchmark CSV."));
    };
    worker.postMessage({ runs });
  });

export const downloadBenchmarkRuns = async (
  runs: BenchmarkRun[],
): Promise<void> => {
  const csv = await serializeBenchmarkRuns(runs);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "js-clipper-benchmark.csv";
  link.click();
  URL.revokeObjectURL(url);
};
