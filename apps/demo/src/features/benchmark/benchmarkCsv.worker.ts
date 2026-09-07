import { benchmarkRunsToCsv } from "./csv";
import type { BenchmarkRun } from "./benchmark";

type CsvWorkerRequest = {
  runs: BenchmarkRun[];
};

self.onmessage = ({ data }: MessageEvent<CsvWorkerRequest>) => {
  self.postMessage(benchmarkRunsToCsv(data.runs));
};
