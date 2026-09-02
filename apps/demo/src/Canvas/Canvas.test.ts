import { describe, expect, it } from "vitest";
import { createSvgMarkup, polygonsToSvgPath } from "./Canvas";

describe("polygonsToSvgPath", () => {
  it("converts scaled Clipper polygons into SVG path data", () => {
    expect(polygonsToSvgPath([[{ X: 100, Y: 200 }, { X: 300, Y: 400 }]], 100))
      .toBe("M1,2L3,4Z");
  });

  it("ignores empty polygons", () => {
    expect(polygonsToSvgPath([[]], 100)).toBe("");
  });

  it("creates source markup from the typed calculation result", () => {
    expect(createSvgMarkup(
      { subject: [[{ X: 100, Y: 100 }]], clip: [], solution: [] },
      100,
      "evenOdd",
      "nonZero",
    )).toContain('id="p1" d="M1,1Z" fill-rule="evenodd"');
  });

  it("adds the bevel filter only when it is enabled", () => {
    const result = { subject: [], clip: [], solution: [[{ X: 100, Y: 100 }]] };
    expect(createSvgMarkup(result, 100, "evenOdd", "evenOdd", true)).toContain('filter="url(#innerbevel)"');
    expect(createSvgMarkup(result, 100, "evenOdd", "evenOdd")).not.toContain("innerbevel");
  });

  it("adds an overlay for the selected polygon only", () => {
    const result = {
      subject: [[{ X: 100, Y: 100 }], [{ X: 200, Y: 200 }]],
      clip: [],
      solution: [],
    };

    expect(createSvgMarkup(result, 100, "evenOdd", "evenOdd", false, {
      polygonId: "subject",
      polygonIndex: 1,
    })).toContain('class="highlightedPath" d="M2,2Z" fill="#000"');
  });
});
