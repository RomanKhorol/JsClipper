import type { ExplorerRow, OutputFormat } from "../../BottomMenu";
import type { LeftMenuInputValues } from "../../LeftMenu";
import { DemoActionType, type DemoAction, type DemoState } from "./types";

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

export const createInitialDemoState = (
  explorerRows: ExplorerRow[],
): DemoState => ({
  inputValues: initialInputValues,
  benchmarkRuns: [],
  explorerEnabled: true,
  outputFormat: outputFormats[0],
  explorerRows,
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
  typeof payload.status === "string";

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
      typeof row.polygons === "string" &&
      typeof row.points === "string" &&
      typeof row.pointsInPolygons === "string",
  );

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
    DemoActionType.BenchmarkStarted,
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
]);

export const demoReducer = (
  state: DemoState,
  { type, payload }: DemoAction,
): DemoState => actionHandlers.get(type)?.(state, payload) ?? state;
