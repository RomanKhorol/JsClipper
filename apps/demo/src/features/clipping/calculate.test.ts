import { describe, expect, it } from "vitest";
import { calculateClipping, parsePolygonJson } from "./calculate";
import type { ClipperEngine, ClipperPolygons, ClippingOptions } from "./types";

const subject = [[{ X: 0, Y: 0 }, { X: 10, Y: 0 }, { X: 0, Y: 10 }]];
const clip = [[{ X: 2, Y: 2 }, { X: 8, Y: 2 }, { X: 2, Y: 8 }]];
const calls: string[] = [];

const engine: ClipperEngine = {
  PolyType: { ptSubject: 0, ptClip: 1 },
  ClipType: { intersect: 0, union: 1, difference: 2, xor: 3 },
  PolyFillType: { evenOdd: 0, nonZero: 1 },
  JoinType: { square: 0, round: 1, miter: 2 },
  Clone: (polygons) => polygons.map((polygon) => [...polygon]),
  Clean: (polygons) => { calls.push("clean"); return polygons; },
  Lighten: (polygons) => { calls.push("lighten"); return polygons; },
  Clipper: class {
    AddPolygons(polygons: ClipperPolygons, type: number) { calls.push(`add:${type}:${polygons.length}`); }
    Execute() { calls.push("execute"); return true; }
    SimplifyPolygons(polygons: ClipperPolygons) { calls.push("simplify"); return polygons; }
    OffsetPolygons(polygons: ClipperPolygons, delta: number) { calls.push(`offset:${delta}`); return polygons; }
  },
};

const options: ClippingOptions = {
  subjectFillType: "evenOdd", clipFillType: "nonZero", operation: "xor", offsetTarget: "solution",
  joinType: "square", cleanDistance: 0.1, simplify: true, lightenDistance: 0.2,
  autoFix: true, delta: -1, miterLimit: 2, scale: 100,
};

describe("calculateClipping", () => {
  it("preserves the legacy geometry operation order", () => {
    calculateClipping(engine, { subject, clip }, options);
    expect(calls).toEqual(["add:0:1", "add:1:1", "execute", "clean", "simplify", "offset:-100", "lighten", "simplify"]);
  });

  it("selects original subject polygons without executing a boolean operation", () => {
    calls.length = 0;
    const result = calculateClipping(engine, { subject, clip }, { ...options, offsetTarget: "subject", cleanDistance: null, simplify: false, lightenDistance: null, delta: 0 });
    expect(result.solution).toEqual(subject);
    expect(calls).toEqual([]);
  });
});

describe("parsePolygonJson", () => {
  it("accepts numeric Clipper polygon JSON and rejects untrusted values", () => {
    expect(parsePolygonJson(JSON.stringify(subject))).toEqual(subject);
    expect(parsePolygonJson('[[{"X":"1","Y":2}]]')).toBeNull();
    expect(parsePolygonJson("invalid")).toBeNull();
  });
});
