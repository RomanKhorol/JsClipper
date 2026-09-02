import { useCallback, useEffect, useReducer, useRef } from "react";
import type { ExplorerRow } from "../../BottomMenu";
import type { LeftMenuInputValue } from "../../LeftMenu";
import {
  benchmarkDefinitions,
  runBenchmark,
  type BenchmarkRun,
} from "../benchmark";
import { clipperEngine } from "../../adapters/clipperEngine";
import {
  getBuiltInPolygonSet,
  isBuiltInPolygonSource,
} from "../polygons/builtIn";
import { defaultCustomPolygonSet } from "../polygons/defaultCustomPolygons";
import {
  addCustomPolygonSet,
  deleteCustomPolygonSet,
  getCustomPolygonSet,
  loadCustomPolygonSets,
  restoreDefaultCustomPolygonSet,
  saveCustomPolygonSets,
  updateCustomPolygonSet,
  type CustomPolygonSet,
} from "../polygons/customPolygons";
import {
  generateRandomPolygonInput,
  type RandomPolygonCounts,
  type RandomPolygonKind,
} from "../polygons/randomPolygons";
import {
  calculateClipping,
  type ClipperPolygons,
  type ClippingOptions,
} from "../clipping";
import {
  normalizePolygonInput,
  parseCustomPolygonInput,
} from "../polygons/types";
import { createInitialDemoState, demoReducer, outputFormats } from "./reducer";
import { DemoActionType } from "./types";
import type { PolygonCellData, PolygonSelection } from "../../types";

/* Legacy DOM reader removed in migration step 5; retained temporarily as a reference.
const readExplorerRows = (): ExplorerRow[] => {
  const value = (id: string) => document.getElementById(id)?.textContent?.trim() || "—";

  return [
    { type: "Subject", polygons: value("subj_subpolygons"), points: value("subj_points_total"), pointsInPolygons: value("subj_points_in_subpolygons") },
    { type: "Clip", polygons: value("clip_subpolygons"), points: value("clip_points_total"), pointsInPolygons: value("clip_points_in_subpolygons") },
    { type: "Solution", polygons: value("solution_subpolygons"), points: value("solution_points_total"), pointsInPolygons: value("solution_points_in_subpolygons") },
    { type: "Total", polygons: value("all_subpolygons"), points: value("points_total"), pointsInPolygons: "—" },
  ];
};

*/
const polygonRow = (
  id: "subject" | "clip" | "solution",
  type: string,
  polygons: ClipperPolygons,
): ExplorerRow => ({
  id,
  type,
  polygons: String(polygons.length),
  points: String(
    polygons.reduce((total, polygon) => total + polygon.length, 0),
  ),
  pointsInPolygons: polygons.map((polygon) => polygon.length).join(", "),
});

const getReactExplorerRows = (
  subject: ClipperPolygons,
  clip: ClipperPolygons,
  solution: ClipperPolygons,
): ExplorerRow[] => {
  const rows = [
    polygonRow("subject", "Subject", subject),
    polygonRow("clip", "Clip", clip),
    polygonRow("solution", "Solution", solution),
  ];
  return [
    ...rows,
    {
      id: "total",
      type: "Total",
      polygons: String(
        rows.reduce((total, row) => total + Number(row.polygons), 0),
      ),
      points: String(
        rows.reduce((total, row) => total + Number(row.points), 0),
      ),
      pointsInPolygons: "—",
    },
  ];
};

const clippingOptionsFromInputValues = (
  inputValues: import("../../LeftMenu").LeftMenuInputValues,
): ClippingOptions => ({
  subjectFillType:
    inputValues.subjectFillType === "nonZero" ? "nonZero" : "evenOdd",
  clipFillType: inputValues.clipFillType === "nonZero" ? "nonZero" : "evenOdd",
  operation: ["none", "intersect", "union", "difference", "xor"].includes(
    inputValues.clipTypeOperation,
  )
    ? (inputValues.clipTypeOperation as ClippingOptions["operation"])
    : "none",
  offsetTarget: ["subject", "clip", "solution"].includes(inputValues.polygon)
    ? (inputValues.polygon as ClippingOptions["offsetTarget"])
    : "solution",
  joinType: ["square", "round", "miter"].includes(inputValues.joinType)
    ? (inputValues.joinType as ClippingOptions["joinType"])
    : "square",
  cleanDistance: inputValues.clean,
  simplify: inputValues.simplify,
  lightenDistance: inputValues.lighten,
  autoFix: inputValues.autoFix,
  delta: inputValues.delta,
  miterLimit: inputValues.miterLimit,
  scale: inputValues.scale,
});

const isRandomPolygonKind = (value: string): value is RandomPolygonKind =>
  value === "randomRectangles" || value === "random";

export const useDemoController = () => {
  const benchmarkAbortController = useRef<AbortController | null>(null);
  const [state, dispatch] = useReducer(demoReducer, undefined, () =>
    createInitialDemoState([]),
  );
  const handleSelection = useCallback((cellData: PolygonCellData) => {
    const row = state.explorerRows[cellData.rowIndex];
    if (!row || (row.id === "total" && cellData.id === "polygon")) return;

    const selection: PolygonSelection = {
      polygonId: row.id,
      polygonIndex: cellData.id === "polygon" ? cellData.itemIndex : null,
    };

    if (cellData.type === "click") {
      dispatch({
        type: DemoActionType.SelectedPolygonChanged,
        payload: selection,
      });
      return;
    }

    dispatch({
      type: DemoActionType.HoveredPolygonChanged,
      payload: cellData.type === "hover" ? selection : null,
    });
  }, [state.explorerRows]);
  useEffect(() => () => benchmarkAbortController.current?.abort(), []);

  useEffect(() => {
    const input =
      state.inputValues.polygons === "custom"
        ? parseCustomPolygonInput(
            state.customPolygonDraft,
            state.inputValues.scale,
          )
        : isBuiltInPolygonSource(state.inputValues.polygons)
          ? parseCustomPolygonInput(
              getBuiltInPolygonSet(state.inputValues.polygons),
              state.inputValues.scale,
            )
          : isRandomPolygonKind(state.inputValues.polygons)
            ? (state.randomPolygonInput ??
              generateRandomPolygonInput(
                state.inputValues.polygons,
                state.randomPolygonCounts,
                state.inputValues.scale,
              ))
            : null;
    if (!input) return;

    const result = calculateClipping(
      clipperEngine,
      input,
      clippingOptionsFromInputValues(state.inputValues),
    );
    dispatch({
      type: DemoActionType.CalculationResultChanged,
      payload: result,
    });
    dispatch({
      type: DemoActionType.ExplorerRowsChanged,
      payload: getReactExplorerRows(
        result.subject,
        result.clip,
        result.solution,
      ),
    });
  }, [
    state.inputValues,
    state.randomPolygonCounts,
    state.randomPolygonInput,
    state.selectedCustomPolygonIndex,
    state.customPolygonDraft,
  ]);

  useEffect(() => {
    const loadCustomPolygonData = () => {
      const polygonSets = restoreDefaultCustomPolygonSet(
        loadCustomPolygonSets(window.localStorage),
        defaultCustomPolygonSet,
      );
      if (!saveCustomPolygonSets(window.localStorage, polygonSets)) {
        dispatch({
          type: DemoActionType.CustomPolygonErrorChanged,
          payload: "Unable to save custom polygons in local storage.",
        });
      }
      dispatch({
        type: DemoActionType.CustomPolygonDataLoaded,
        payload: { polygonSets },
      });
    };

    loadCustomPolygonData();
  }, []);

  const handleInputValueChange = (value: LeftMenuInputValue, id: string) => {
    dispatch({
      type: DemoActionType.InputValueChanged,
      payload: { id, value },
    });

    if (
      id === "polygons" &&
      typeof value === "string" &&
      isRandomPolygonKind(value)
    ) {
      dispatch({
        type: DemoActionType.RandomPolygonInputChanged,
        payload: generateRandomPolygonInput(
          value,
          state.randomPolygonCounts,
          state.inputValues.scale,
        ),
      });
    }

    if (id === "polygons" && value === "custom") {
      const defaultPolygonSet = state.customPolygonSets[0];
      if (!defaultPolygonSet) return;
    }

    if (
      id === "scale" &&
      typeof value === "number" &&
      isRandomPolygonKind(state.inputValues.polygons)
    ) {
      dispatch({
        type: DemoActionType.RandomPolygonInputChanged,
        payload: generateRandomPolygonInput(
          state.inputValues.polygons,
          state.randomPolygonCounts,
          value,
        ),
      });
    }
  };

  const handleCustomPolygonDraftChange = (
    field: keyof CustomPolygonSet,
    value: string,
  ) => {
    dispatch({
      type: DemoActionType.CustomPolygonDraftChanged,
      payload: { field, value },
    });
  };

  const handleCustomPolygonSelect = (index: number | null) => {
    const defaultPolygonSet = state.customPolygonSets[0];
    if (!defaultPolygonSet) return;

    const polygonSet = getCustomPolygonSet(
      state.customPolygonSets,
      index,
      defaultPolygonSet,
    );
    dispatch({
      type: DemoActionType.CustomPolygonSelected,
      payload: { index, polygonSet },
    });
  };

  const handleCustomPolygonSave = () => {
    const subj = normalizePolygonInput(state.customPolygonDraft.subj);
    const clip = normalizePolygonInput(state.customPolygonDraft.clip);
    if (!subj || !clip) {
      dispatch({
        type: DemoActionType.CustomPolygonErrorChanged,
        payload: "Subject and clip must contain valid polygons.",
      });
      return;
    }

    const polygonSet = { subj, clip };
    const selectedIndex = state.selectedCustomPolygonIndex;
    const polygonSets =
      selectedIndex === null
        ? addCustomPolygonSet(state.customPolygonSets, polygonSet)
        : updateCustomPolygonSet(
            state.customPolygonSets,
            selectedIndex,
            polygonSet,
          );
    const index = selectedIndex ?? polygonSets.length - 1;

    if (!saveCustomPolygonSets(window.localStorage, polygonSets)) {
      dispatch({
        type: DemoActionType.CustomPolygonErrorChanged,
        payload: "Unable to save custom polygons in local storage.",
      });
      return;
    }

    dispatch({
      type: DemoActionType.CustomPolygonSetsChanged,
      payload: { polygonSets, index, polygonSet },
    });
  };

  const handleCustomPolygonDelete = () => {
    const defaultPolygonSet = state.customPolygonSets[0];
    const selectedIndex = state.selectedCustomPolygonIndex;
    if (!defaultPolygonSet || selectedIndex === null) return;

    const polygonSets = deleteCustomPolygonSet(
      state.customPolygonSets,
      selectedIndex,
    );
    if (!saveCustomPolygonSets(window.localStorage, polygonSets)) {
      dispatch({
        type: DemoActionType.CustomPolygonErrorChanged,
        payload: "Unable to save custom polygons in local storage.",
      });
      return;
    }

    dispatch({
      type: DemoActionType.CustomPolygonSetsChanged,
      payload: { polygonSets, index: null, polygonSet: defaultPolygonSet },
    });
  };

  const handleCustomPolygonReset = () => {
    const polygonSets = restoreDefaultCustomPolygonSet(
      [],
      defaultCustomPolygonSet,
    );
    if (!saveCustomPolygonSets(window.localStorage, polygonSets)) {
      dispatch({
        type: DemoActionType.CustomPolygonErrorChanged,
        payload: "Unable to save custom polygons in local storage.",
      });
      return;
    }

    dispatch({
      type: DemoActionType.CustomPolygonSetsChanged,
      payload: {
        polygonSets,
        index: null,
        polygonSet: defaultCustomPolygonSet,
      },
    });
  };

  const handleRandomPolygonCountChange = (
    key: keyof RandomPolygonCounts,
    value: number,
  ) => {
    if (!Number.isFinite(value) || value < 1) return;
    const counts = { ...state.randomPolygonCounts, [key]: Math.floor(value) };
    dispatch({
      type: DemoActionType.RandomPolygonCountsChanged,
      payload: counts,
    });
    if (isRandomPolygonKind(state.inputValues.polygons)) {
      dispatch({
        type: DemoActionType.RandomPolygonInputChanged,
        payload: generateRandomPolygonInput(
          state.inputValues.polygons,
          counts,
          state.inputValues.scale,
        ),
      });
    }
  };

  const handleGenerateRandomPolygons = () => {
    if (isRandomPolygonKind(state.inputValues.polygons)) {
      dispatch({
        type: DemoActionType.RandomPolygonInputChanged,
        payload: generateRandomPolygonInput(
          state.inputValues.polygons,
          state.randomPolygonCounts,
          state.inputValues.scale,
        ),
      });
    }
  };

  const handleRunBenchmark = (buttonId: BenchmarkRun["id"]) => {
    const benchmark = benchmarkDefinitions.find(({ id }) => id === buttonId);
    if (!benchmark) return;
    benchmarkAbortController.current?.abort();
    const controller = new AbortController();
    benchmarkAbortController.current = controller;
    const total = 5 * 108 * benchmark.repetitions;
    dispatch({
      type: DemoActionType.BenchmarkRunChanged,
      payload: {
        id: benchmark.id,
        mode: benchmark.mode,
        runs: String(benchmark.repetitions),
        status: "Running",
        completed: 0,
        total,
      },
    });
    void runBenchmark(
      benchmark,
      controller.signal,
      (completed, progressTotal) => {
        dispatch({
          type: DemoActionType.BenchmarkRunChanged,
          payload: {
            id: benchmark.id,
            mode: benchmark.mode,
            runs: String(benchmark.repetitions),
            status: "Running",
            completed,
            total: progressTotal,
          },
        });
      },
    )
      .then((result) => {
        if (benchmarkAbortController.current === controller)
          benchmarkAbortController.current = null;
        dispatch({ type: DemoActionType.BenchmarkRunChanged, payload: result });
      })
      .catch((error: unknown) => {
        if (benchmarkAbortController.current === controller)
          benchmarkAbortController.current = null;
        dispatch({
          type: DemoActionType.BenchmarkRunChanged,
          payload: {
            id: benchmark.id,
            mode: benchmark.mode,
            runs: String(benchmark.repetitions),
            status: "Failed",
            completed: 0,
            total,
            error:
              error instanceof Error
                ? error.message
                : "Unknown benchmark error",
          },
        });
      });
  };

  const handleCancelBenchmark = () => benchmarkAbortController.current?.abort();

  const handleExplorerEnabledChange = (value: boolean) => {
    dispatch({ type: DemoActionType.ExplorerEnabledChanged, payload: value });
  };

  const handleOutputFormatChange = (option: unknown) => {
    if (!option || typeof option !== "object" || !("value" in option)) return;

    const selectedFormat = outputFormats.find(
      ({ value }) => value === option.value,
    );
    if (!selectedFormat) return;

    dispatch({
      type: DemoActionType.OutputFormatChanged,
      payload: selectedFormat,
    });
  };

  return {
    state,
    outputFormats,
    handleInputValueChange,
    handleRunBenchmark,
    handleCancelBenchmark,
    handleExplorerEnabledChange,
    handleOutputFormatChange,
    handleCustomPolygonDraftChange,
    handleCustomPolygonSelect,
    handleCustomPolygonSave,
    handleCustomPolygonDelete,
    handleCustomPolygonReset,
    handleRandomPolygonCountChange,
    handleGenerateRandomPolygons,
    handleSelection,
  };
};
