import { createContext } from "react";
import { PolygonCellData } from "../types";

type TableContextValue = {
  onSelection: (data: PolygonCellData) => void;
};

export const TableContext = createContext<TableContextValue>({
  onSelection: () => {},
});
