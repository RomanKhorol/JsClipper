import { describe, expect, it } from "vitest";
import { benchmarkRunsToCsv } from "./export";

describe("benchmark CSV export", () => {
  it("includes the typed benchmark result fields", () => {
    expect(benchmarkRunsToCsv([{ id: "benchmark1", mode: "Normal", runs: "1", status: "Completed", completed: 540, total: 540, durationMs: 12 }]))
      .toContain('"Normal","1","Completed","540","540","12",""');
  });
});
