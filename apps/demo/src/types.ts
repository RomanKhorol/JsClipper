export type PolygonCellData = {
  id: "points" | "polygon";
  type: "out" | "hover" | "click";
  rowIndex: number;
  value: string;
  itemIndex: number;
};

export type PolygonSelection = {
  polygonId: "subject" | "clip" | "solution" | "total";
  polygonIndex: number | null;
};
