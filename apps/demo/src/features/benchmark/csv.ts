import type { BenchmarkRun } from "./benchmark";

const csvCell = (value: string | number | undefined): string =>
  `"${String(value ?? "").replaceAll('"', '""')}"`;

export const benchmarkRunsToCsv = (runs: BenchmarkRun[]): string => [
  ["Mode", "Runs", "Status", "Completed", "Total", "Duration (ms)", "Error"]
    .map(csvCell)
    .join(","),
  ...runs.map((run) =>
    [
      run.mode,
      run.runs,
      run.status,
      run.completed,
      run.total,
      run.durationMs,
      run.error,
    ]
      .map(csvCell)
      .join(","),
  ),
].join("\n");
