import { describe, expect, it } from "vitest";
import { defaultCustomPolygonSet } from "./defaultCustomPolygons";
import { parseCustomPolygonInput } from "./polygonInput";

describe("default custom polygon set", () => {
  it("is available without the legacy runtime", () => {
    expect(parseCustomPolygonInput(defaultCustomPolygonSet, 1)).not.toBeNull();
  });
});
