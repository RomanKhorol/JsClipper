export type CustomPolygonSet = {
  subj: string;
  clip: string;
};

export type CustomPolygonSets = Array<CustomPolygonSet | null>;

export type PolygonStorage = Pick<Storage, "getItem" | "setItem">;

export const customPolygonStorageKey = "custom_polygons";

export const isCustomPolygonSet = (value: unknown): value is CustomPolygonSet =>
  typeof value === "object" &&
  value !== null &&
  "subj" in value &&
  "clip" in value &&
  typeof value.subj === "string" &&
  typeof value.clip === "string";

export const isCustomPolygonSets = (value: unknown): value is CustomPolygonSets =>
  Array.isArray(value) && value.every((polygonSet) => polygonSet === null || isCustomPolygonSet(polygonSet));

export const loadCustomPolygonSets = (storage: PolygonStorage): CustomPolygonSets => {
  try {
    const storedValue = storage.getItem(customPolygonStorageKey);
    if (!storedValue) return [];

    const parsedValue: unknown = JSON.parse(storedValue);
    return isCustomPolygonSets(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
};

export const saveCustomPolygonSets = (storage: PolygonStorage, polygonSets: CustomPolygonSets): boolean => {
  try {
    storage.setItem(customPolygonStorageKey, JSON.stringify(polygonSets));
    return true;
  } catch {
    return false;
  }
};

export const restoreDefaultCustomPolygonSet = (
  polygonSets: CustomPolygonSets,
  defaultPolygonSet: CustomPolygonSet,
): CustomPolygonSets => [defaultPolygonSet, ...polygonSets.slice(1)];

export const getCustomPolygonSet = (
  polygonSets: CustomPolygonSets,
  selectedIndex: number | null,
  defaultPolygonSet: CustomPolygonSet,
): CustomPolygonSet =>
  selectedIndex !== null && selectedIndex > 0 && polygonSets[selectedIndex]
    ? polygonSets[selectedIndex]
    : defaultPolygonSet;

export const addCustomPolygonSet = (
  polygonSets: CustomPolygonSets,
  polygonSet: CustomPolygonSet,
): CustomPolygonSets => [...polygonSets, polygonSet];

export const updateCustomPolygonSet = (
  polygonSets: CustomPolygonSets,
  index: number,
  polygonSet: CustomPolygonSet,
): CustomPolygonSets => {
  if (index <= 0 || index >= polygonSets.length) return polygonSets;

  return polygonSets.map((currentPolygonSet, currentIndex) =>
    currentIndex === index ? polygonSet : currentPolygonSet,
  );
};

export const deleteCustomPolygonSet = (
  polygonSets: CustomPolygonSets,
  index: number,
): CustomPolygonSets => {
  if (index <= 0 || index >= polygonSets.length) return polygonSets;

  return polygonSets.map((polygonSet, currentIndex) =>
    currentIndex === index ? null : polygonSet,
  );
};
