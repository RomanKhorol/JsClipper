import type { BenchmarkRun } from "./benchmark";

const csvCell = (value: string | number | undefined): string =>
  `"${String(value ?? "").replaceAll('"', '""')}"`;

export const benchmarkRunsToCsv = (runs: BenchmarkRun[]): string => [
  ["Mode", "Runs", "Status", "Completed", "Total", "Duration (ms)", "Error"].map(csvCell).join(","),
  ...runs.map((run) => [run.mode, run.runs, run.status, run.completed, run.total, run.durationMs, run.error].map(csvCell).join(",")),
].join("\n");

export const downloadBenchmarkRuns = (runs: BenchmarkRun[]): void => {
  const blob = new Blob([benchmarkRunsToCsv(runs)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "js-clipper-benchmark.csv";
  link.click();
  URL.revokeObjectURL(url);
};
