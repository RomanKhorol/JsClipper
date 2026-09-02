import type { ExplorerRow, OutputFormat } from "../../BottomMenu";
import type { LeftMenuInputValues } from "../../LeftMenu";
import type { BenchmarkRun } from "../benchmark";
import type { CustomPolygonSet, CustomPolygonSets } from "../polygons/customPolygons";
import type { RandomPolygonCounts } from "../polygons/randomPolygons";
import type { ClippingInput, ClippingResult } from "../clipping";
import type { PolygonSelection } from "../../types";

export type DemoState = {
  inputValues: LeftMenuInputValues;
  benchmarkRuns: BenchmarkRun[];
  explorerEnabled: boolean;
  outputFormat: OutputFormat;
  explorerRows: ExplorerRow[];
  customPolygonSets: CustomPolygonSets;
  selectedCustomPolygonIndex: number | null;
  customPolygonDraft: CustomPolygonSet;
  customPolygonError: string | null;
  randomPolygonCounts: RandomPolygonCounts;
  randomPolygonInput: ClippingInput | null;
  calculationResult: ClippingResult | null;
  selectedPolygon: PolygonSelection | null;
  hoveredPolygon: PolygonSelection | null;
};

export enum DemoActionType {
  InputValueChanged = "inputValueChanged",
  BenchmarkRunChanged = "benchmarkRunChanged",
  ExplorerEnabledChanged = "explorerEnabledChanged",
  OutputFormatChanged = "outputFormatChanged",
  ExplorerRowsChanged = "explorerRowsChanged",
  CustomPolygonDataLoaded = "customPolygonDataLoaded",
  CustomPolygonDraftChanged = "customPolygonDraftChanged",
  CustomPolygonSelected = "customPolygonSelected",
  CustomPolygonSetsChanged = "customPolygonSetsChanged",
  CustomPolygonErrorChanged = "customPolygonErrorChanged",
  RandomPolygonCountsChanged = "randomPolygonCountsChanged",
  CalculationResultChanged = "calculationResultChanged",
  RandomPolygonInputChanged = "randomPolygonInputChanged",
  SelectedPolygonChanged = "selectedPolygonChanged",
  HoveredPolygonChanged = "hoveredPolygonChanged",
}

export type DemoAction = {
  type: DemoActionType;
  payload?: unknown;
};
