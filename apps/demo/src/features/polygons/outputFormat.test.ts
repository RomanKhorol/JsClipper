import { describe, expect, it } from "vitest";
import { formatPolygonOutput, polygonsArea } from "./outputFormat";

const polygons = [[{ X: 1, Y: 2 }, { X: 3, Y: 4 }, { X: 5, Y: 6 }]];

describe("polygon explorer output", () => {
  it("formats typed polygons in every supported output format", () => {
    expect(formatPolygonOutput(polygons, "Clipper")).toBe('[[{"X":1,"Y":2},{"X":3,"Y":4},{"X":5,"Y":6}]]');
    expect(formatPolygonOutput(polygons, "Plain")).toBe("[[1,2, 3,4, 5,6]]");
    expect(formatPolygonOutput(polygons, "SVG")).toBe("M1,2 L3,4 L5,6Z");
  });

  it("sums signed areas for all selected polygons", () => {
    expect(polygonsArea([[{ X: 0, Y: 0 }, { X: 4, Y: 0 }, { X: 0, Y: 3 }]])).toBe(6);
  });
});
