import { describe, expect, it } from "vitest";
import { normalizePolygonInput, parseCustomPolygonInput } from "./polygonInput";

describe("parseCustomPolygonInput", () => {
  it("validates and scales the React-owned custom polygon text", () => {
    const polygonSet = {
      subj: '[[{"X":1.2,"Y":-1.2}]]',
      clip: '[[{"X":2.9,"Y":3.1}]]',
    };

    expect(parseCustomPolygonInput(polygonSet, 100)).toEqual({
      subject: [[{ X: 120, Y: -120 }]],
      clip: [[{ X: 290, Y: 310 }]],
    });
  });

  it("normalizes coordinate lists, lowercase points, and SVG paths", () => {
    expect(normalizePolygonInput("1 2, 3 4")).toBe('[[{"X":1,"Y":2},{"X":3,"Y":4}]]');
    expect(normalizePolygonInput('[{"x":1,"y":2}]')).toBe('[[{"X":1,"Y":2}]]');
    expect(normalizePolygonInput("M1,2 L3,4Z")).toBe('[[{"X":1,"Y":2},{"X":3,"Y":4}]]');
  });

  it("rejects malformed polygon text and invalid scales", () => {
    expect(parseCustomPolygonInput({ subj: "[]", clip: "invalid" }, 100)).toBeNull();
    expect(parseCustomPolygonInput({ subj: "[]", clip: "[]" }, 0)).toBeNull();
  });
});
