import { describe, expect, it } from "vitest";
import { generateRandomPolygonInput } from "./randomPolygons";

const counts = { subjPolygonCount: 1, subjPointCount: 4, clipPolygonCount: 1, clipPointCount: 3 };

describe("generateRandomPolygonInput", () => {
  it("uses the legacy canvas bounds after scaling", () => {
    const input = generateRandomPolygonInput("random", counts, 100, () => 0);
    expect(input.subject[0][0]).toEqual({ X: 1000, Y: 1000 });
    expect(input.clip[0][0]).toEqual({ X: 1000, Y: 1000 });
  });

  it("closes random rectangles on their final axis", () => {
    const values = [0.9, 0.1, 0.2, 0.8, 0.3, 0.7, 0.4, 0.6, 0.5, 0.5, 0.5, 0.5];
    let index = 0;
    const input = generateRandomPolygonInput("randomRectangles", counts, 1, () => values[index++] ?? 0.5);
    expect(input.subject[0][3].X === input.subject[0][0].X || input.subject[0][3].Y === input.subject[0][0].Y).toBe(true);
  });
});
