import { describe, expect, it } from "vitest";
import {
  addCustomPolygonSet,
  customPolygonStorageKey,
  deleteCustomPolygonSet,
  getCustomPolygonSet,
  loadCustomPolygonSets,
  restoreDefaultCustomPolygonSet,
  saveCustomPolygonSets,
  updateCustomPolygonSet,
  type PolygonStorage,
} from "./customPolygons";

const defaultPolygonSet = { subj: "default-subject", clip: "default-clip" };
const savedPolygonSet = { subj: "saved-subject", clip: "saved-clip" };

const createStorage = (): PolygonStorage => {
  const values = new Map<string, string>();

  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
};

describe("custom polygon storage", () => {
  it("falls back safely when stored data is malformed", () => {
    const storage = createStorage();
    storage.setItem(customPolygonStorageKey, "not-json");

    expect(loadCustomPolygonSets(storage)).toEqual([]);
    expect(getCustomPolygonSet([], null, defaultPolygonSet)).toEqual(defaultPolygonSet);
  });

  it("preserves the default slot while saved sets are added, updated, and deleted", () => {
    const storage = createStorage();
    const restoredSets = restoreDefaultCustomPolygonSet([], defaultPolygonSet);
    const addedSets = addCustomPolygonSet(restoredSets, savedPolygonSet);
    const updatedSets = updateCustomPolygonSet(addedSets, 1, {
      subj: "updated-subject",
      clip: "updated-clip",
    });
    const deletedSets = deleteCustomPolygonSet(updatedSets, 1);

    expect(saveCustomPolygonSets(storage, addedSets)).toBe(true);
    expect(loadCustomPolygonSets(storage)).toEqual(addedSets);
    expect(updatedSets).toEqual([defaultPolygonSet, { subj: "updated-subject", clip: "updated-clip" }]);
    expect(deletedSets).toEqual([defaultPolygonSet, null]);
    expect(getCustomPolygonSet(deletedSets, 1, defaultPolygonSet)).toEqual(defaultPolygonSet);
  });
});
