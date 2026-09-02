import type { ExplorerRow, OutputFormat } from "../../BottomMenu";
import type { LeftMenuInputValues } from "../../LeftMenu";
import {
  isCustomPolygonSet,
  isCustomPolygonSets,
  type CustomPolygonSet,
} from "../polygons/customPolygons";
import { defaultRandomPolygonCounts, isRandomPolygonCounts } from "../polygons/randomPolygons";
import { DemoActionType, type DemoAction, type DemoState } from "./types";
import { parsePolygons, type ClippingInput, type ClippingResult } from "../clipping";
import type { PolygonSelection } from "../../types";

export const outputFormats: OutputFormat[] = ["Clipper", "Plain", "SVG"].map(
  (value) => ({
    value,
    label: value,
  }),
);

const initialInputValues: LeftMenuInputValues = {
  polygons: "arrows",
  subjectFillType: "evenOdd",
  clipFillType: "evenOdd",
  clipTypeOperation: "xor",
  polygon: "solution",
  joinType: "square",
  clean: null,
  simplify: false,
  lighten: null,
  autoFix: false,
  delta: -1,
  miterLimit: 2,
  scale: 100,
  showSvgSource: false,
  showEnlargedSvg: false,
  bevel: false,
};

const emptyCustomPolygonSet: CustomPolygonSet = { subj: "", clip: "" };

export const createInitialDemoState = (
  explorerRows: ExplorerRow[],
): DemoState => ({
  inputValues: initialInputValues,
  benchmarkRuns: [],
  explorerEnabled: true,
  outputFormat: outputFormats[0],
  explorerRows,
  customPolygonSets: [],
  selectedCustomPolygonIndex: null,
  customPolygonDraft: emptyCustomPolygonSet,
  customPolygonError: null,
  randomPolygonCounts: defaultRandomPolygonCounts,
  randomPolygonInput: null,
  calculationResult: null,
  selectedPolygon: null,
  hoveredPolygon: null,
});

const isInputValueKey = (id: string): id is keyof LeftMenuInputValues =>
  id in initialInputValues;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isInputValueChange = (
  payload: unknown,
): payload is { id: string; value: string | number | boolean | null } =>
  isRecord(payload) &&
  typeof payload.id === "string" &&
  (typeof payload.value === "string" ||
    typeof payload.value === "number" ||
    typeof payload.value === "boolean" ||
    payload.value === null);

const isBenchmarkRun = (
  payload: unknown,
): payload is DemoState["benchmarkRuns"][number] =>
  isRecord(payload) &&
  typeof payload.mode === "string" &&
  typeof payload.runs === "string" &&
  (payload.status === "Running" || payload.status === "Completed" || payload.status === "Cancelled" || payload.status === "Failed") &&
  typeof payload.completed === "number" && typeof payload.total === "number";

const isOutputFormat = (payload: unknown): payload is OutputFormat =>
  isRecord(payload) &&
  typeof payload.value === "string" &&
  typeof payload.label === "string";

const isExplorerRows = (payload: unknown): payload is ExplorerRow[] =>
  Array.isArray(payload) &&
  payload.every(
    (row) =>
      isRecord(row) &&
      typeof row.type === "string" &&
      (row.id === "subject" || row.id === "clip" || row.id === "solution" || row.id === "total") &&
      typeof row.polygons === "string" &&
      typeof row.points === "string" &&
      typeof row.pointsInPolygons === "string",
  );

const isCustomPolygonData = (
  payload: unknown,
): payload is { polygonSets: DemoState["customPolygonSets"] } =>
  isRecord(payload) && "polygonSets" in payload && isCustomPolygonSets(payload.polygonSets);

const isCustomPolygonDraftChange = (
  payload: unknown,
): payload is { field: keyof CustomPolygonSet; value: string } =>
  isRecord(payload) &&
  (payload.field === "subj" || payload.field === "clip") &&
  typeof payload.value === "string";

const isCustomPolygonSelection = (
  payload: unknown,
): payload is { index: number | null; polygonSet: CustomPolygonSet } =>
  isRecord(payload) &&
  (payload.index === null || (typeof payload.index === "number" && payload.index >= 0)) &&
  "polygonSet" in payload &&
    isCustomPolygonSet(payload.polygonSet);

const isClippingResult = (payload: unknown): payload is ClippingResult =>
  isRecord(payload) &&
  "subject" in payload && "clip" in payload && "solution" in payload &&
  parsePolygons(payload.subject) !== null &&
  parsePolygons(payload.clip) !== null &&
  parsePolygons(payload.solution) !== null;

const isPolygonSelection = (payload: unknown): payload is PolygonSelection =>
  isRecord(payload) &&
  (payload.polygonId === "subject" ||
    payload.polygonId === "clip" ||
    payload.polygonId === "solution" ||
    payload.polygonId === "total") &&
  (payload.polygonIndex === null ||
    (typeof payload.polygonIndex === "number" &&
      Number.isInteger(payload.polygonIndex) &&
      payload.polygonIndex >= 0));

type ActionHandler = (prevState: DemoState, payload?: unknown) => DemoState;

const actionHandlers = new Map<DemoActionType, ActionHandler>([
  [
    DemoActionType.InputValueChanged,
    (prevState, payload) => {
      if (!isInputValueChange(payload) || !isInputValueKey(payload.id))
        return prevState;

      return {
        ...prevState,
        inputValues: {
          ...prevState.inputValues,
          [payload.id]: payload.value,
        } as LeftMenuInputValues,
      };
    },
  ],
  [
    DemoActionType.BenchmarkRunChanged,
    (prevState, payload) =>
      isBenchmarkRun(payload)
        ? { ...prevState, benchmarkRuns: [payload] }
        : prevState,
  ],
  [
    DemoActionType.ExplorerEnabledChanged,
    (prevState, payload) =>
      typeof payload === "boolean"
        ? { ...prevState, explorerEnabled: payload }
        : prevState,
  ],
  [
    DemoActionType.OutputFormatChanged,
    (prevState, payload) =>
      isOutputFormat(payload)
        ? { ...prevState, outputFormat: payload }
        : prevState,
  ],
  [
    DemoActionType.ExplorerRowsChanged,
    (prevState, payload) =>
      isExplorerRows(payload)
        ? { ...prevState, explorerRows: payload }
        : prevState,
  ],
  [
    DemoActionType.CustomPolygonDataLoaded,
    (prevState, payload) =>
      isCustomPolygonData(payload)
        ? {
            ...prevState,
            customPolygonSets: payload.polygonSets,
            selectedCustomPolygonIndex: null,
            customPolygonDraft: payload.polygonSets[0] ?? emptyCustomPolygonSet,
            customPolygonError: null,
          }
        : prevState,
  ],
  [
    DemoActionType.CustomPolygonDraftChanged,
    (prevState, payload) =>
      isCustomPolygonDraftChange(payload)
        ? {
            ...prevState,
            customPolygonDraft: {
              ...prevState.customPolygonDraft,
              [payload.field]: payload.value,
            },
            customPolygonError: null,
          }
        : prevState,
  ],
  [
    DemoActionType.CustomPolygonSelected,
    (prevState, payload) =>
      isCustomPolygonSelection(payload)
        ? {
            ...prevState,
            selectedCustomPolygonIndex: payload.index,
            customPolygonDraft: payload.polygonSet,
            customPolygonError: null,
          }
        : prevState,
  ],
  [
    DemoActionType.CustomPolygonSetsChanged,
    (prevState, payload) =>
      isCustomPolygonSelection(payload) &&
      isRecord(payload) &&
      "polygonSets" in payload &&
      isCustomPolygonSets(payload.polygonSets)
        ? {
            ...prevState,
            customPolygonSets: payload.polygonSets,
            selectedCustomPolygonIndex: payload.index,
            customPolygonDraft: payload.polygonSet,
            customPolygonError: null,
          }
        : prevState,
  ],
  [
    DemoActionType.CustomPolygonErrorChanged,
    (prevState, payload) =>
      typeof payload === "string" || payload === null
        ? { ...prevState, customPolygonError: payload }
        : prevState,
  ],
  [
    DemoActionType.RandomPolygonCountsChanged,
    (prevState, payload) => isRandomPolygonCounts(payload)
      ? { ...prevState, randomPolygonCounts: payload }
      : prevState,
  ],
  [
    DemoActionType.CalculationResultChanged,
    (prevState, payload) => isClippingResult(payload)
      ? {
          ...prevState,
          calculationResult: payload,
          selectedPolygon: null,
          hoveredPolygon: null,
        }
      : prevState,
  ],
  [
    DemoActionType.RandomPolygonInputChanged,
    (prevState, payload) =>
      isRecord(payload) && "subject" in payload && "clip" in payload &&
      parsePolygons(payload.subject) !== null && parsePolygons(payload.clip) !== null
        ? { ...prevState, randomPolygonInput: payload as ClippingInput }
        : prevState,
  ],
  [
    DemoActionType.SelectedPolygonChanged,
    (prevState, payload) =>
      isPolygonSelection(payload) || payload === null
        ? { ...prevState, selectedPolygon: payload }
        : prevState,
  ],
  [
    DemoActionType.HoveredPolygonChanged,
    (prevState, payload) =>
      isPolygonSelection(payload) || payload === null
        ? { ...prevState, hoveredPolygon: payload }
        : prevState,
  ],
]);

export const demoReducer = (
  state: DemoState,
  { type, payload }: DemoAction,
): DemoState => actionHandlers.get(type)?.(state, payload) ?? state;
