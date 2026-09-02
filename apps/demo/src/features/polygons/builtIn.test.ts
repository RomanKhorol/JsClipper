import { describe, expect, it } from "vitest";
import {
  builtInPolygonSourceIds,
  getBuiltInPolygonSet,
  getBuiltInPolygonSourceId,
  isBuiltInPolygonSource,
} from "./builtIn";

describe("built-in polygon sources", () => {
  it("uses the legacy IDs for every built-in source", () => {
    expect(getBuiltInPolygonSourceId("arrows")).toBe(0);
    expect(getBuiltInPolygonSourceId("texts")).toBe(1);
    expect(getBuiltInPolygonSourceId("rects")).toBe(2);
    expect(getBuiltInPolygonSourceId("same")).toBe(3);
    expect(getBuiltInPolygonSourceId("starAndRect")).toBe(6);
    expect(getBuiltInPolygonSourceId("spiral")).toBe(7);
    expect(getBuiltInPolygonSourceId("gridAndStar")).toBe(8);
    expect(getBuiltInPolygonSourceId("glyph")).toBe(9);
  });

  it("leaves random and custom sources for later migration steps", () => {
    expect(isBuiltInPolygonSource("randomRectangles")).toBe(false);
    expect(isBuiltInPolygonSource("random")).toBe(false);
    expect(isBuiltInPolygonSource("custom")).toBe(false);
  });

  it("provides the original subject and clip data for every built-in source", () => {
    Object.keys(builtInPolygonSourceIds).forEach((source) => {
      const polygonSet = getBuiltInPolygonSet(source as keyof typeof builtInPolygonSourceIds);
      expect(polygonSet.subj).toMatch(/^\[\[/);
      expect(polygonSet.clip).toMatch(/^\[\[/);
    });
  });
});
