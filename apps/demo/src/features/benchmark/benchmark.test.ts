import { describe, expect, it } from "vitest";
import { createBenchmarkOptions } from "./benchmark";

describe("benchmark configuration", () => {
  it("retains the legacy operation matrix", () => {
    const options = createBenchmarkOptions(100);
    expect(options).toHaveLength(108);
    expect(options.filter(({ operation }) => operation === "none")).toHaveLength(36);
    expect(options.filter(({ operation }) => operation === "xor")).toHaveLength(18);
  });
});
