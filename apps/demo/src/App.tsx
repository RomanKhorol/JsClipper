/**
 * Reserved React mount point. The legacy demo renders before this root so new
 * React features can be introduced beside it without replacing legacy DOM.
 */
import { useEffect, useReducer } from "react";
import { useTranslation } from "react-i18next";
import { Container } from "./components";
import { Canvas } from "./Canvas";
import styles from "./App.module.scss";
import { Header } from "./Header";
import "./i18n";
import { LeftMenu, type LeftMenuInputValue } from "./LeftMenu";
import { BottomMenu, type ExplorerRow } from "./BottomMenu";
import { EnlargedSvgModal } from "./EnlargedSvgModal";
import { SvgSourceModal } from "./SvgSourceModal";
import { benchmarkButtons, RightMenu } from "./RightMenu";
import { createInitialDemoState, demoReducer, outputFormats } from "./features/demo/reducer";
import { DemoActionType } from "./features/demo/types";

const languages = ["en", "uk", "de", "pl"] as const;

const readExplorerRows = (): ExplorerRow[] => {
  const value = (id: string) => document.getElementById(id)?.textContent?.trim() || "—";

  return [
    { type: "Subject", polygons: value("subj_subpolygons"), points: value("subj_points_total"), pointsInPolygons: value("subj_points_in_subpolygons") },
    { type: "Clip", polygons: value("clip_subpolygons"), points: value("clip_points_total"), pointsInPolygons: value("clip_points_in_subpolygons") },
    { type: "Solution", polygons: value("solution_subpolygons"), points: value("solution_points_total"), pointsInPolygons: value("solution_points_in_subpolygons") },
    { type: "Total", polygons: value("all_subpolygons"), points: value("points_total"), pointsInPolygons: "—" },
  ];
};

export const App = () => {
  const { i18n } = useTranslation();
  const [state, dispatch] = useReducer(
    demoReducer,
    undefined,
    () => createInitialDemoState(readExplorerRows()),
  );

  useEffect(() => {
    const explorer = document.getElementById("polygon_explorer_div");
    if (!explorer) return;

    const observer = new MutationObserver(() => {
      dispatch({ type: DemoActionType.ExplorerRowsChanged, payload: readExplorerRows() });
    });
    observer.observe(explorer, { childList: true, characterData: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  const handleChange = (value: LeftMenuInputValue, id: string) => {
    dispatch({ type: DemoActionType.InputValueChanged, payload: { id, value } });
  };

  const handleRunBenchmark = (buttonId: string) => {
    const benchmark = benchmarkButtons.find(({ id }) => id === buttonId);
    if (!benchmark) return;

    dispatch({
      type: DemoActionType.BenchmarkStarted,
      payload: { mode: benchmark.mode, runs: benchmark.runs, status: "Running" },
    });
    document.getElementById(buttonId)?.click();
  };

  const handleExplorerEnabledChange = (value: boolean) => {
    dispatch({ type: DemoActionType.ExplorerEnabledChanged, payload: value });
    const legacyControl = document.getElementById("explorer_enabled") as HTMLInputElement | null;
    if (!legacyControl) return;

    legacyControl.checked = value;
    legacyControl.dispatchEvent(new Event("change", { bubbles: true }));
  };

  const handleOutputFormatChange = (option: unknown) => {
    if (!option || typeof option !== "object" || !("value" in option)) return;

    const selectedFormat = outputFormats.find(({ value }) => value === option.value);
    if (!selectedFormat) return;

    dispatch({ type: DemoActionType.OutputFormatChanged, payload: selectedFormat });
    const legacyControl = document.getElementById("output_format") as HTMLSelectElement | null;
    if (!legacyControl) return;

    legacyControl.value = selectedFormat.value;
    legacyControl.dispatchEvent(new Event("change", { bubbles: true }));
  };

  const onToogleLanguege = () => {
    const languageIndex = languages.indexOf(i18n.language as (typeof languages)[number]);
    const nextLanguage = languages[(languageIndex + 1) % languages.length];
    void i18n.changeLanguage(nextLanguage);
  };

  return (
    <div className={styles.root}>
      <Header
        className={styles.header}
        currentLanguage={i18n.language}
        onToogleLanguage={onToogleLanguege}
      />
      <LeftMenu
        className={styles.leftMenu}
        inputValues={state.inputValues}
        onChange={handleChange}
      />
      <Canvas className={styles.canvas} />
      <RightMenu
        className={styles.rightMenu}
        runs={state.benchmarkRuns}
        onRunBenchmark={handleRunBenchmark}
      />
      <BottomMenu
        className={styles.bottomMenu}
        enabled={state.explorerEnabled}
        outputFormat={state.outputFormat}
        outputFormats={outputFormats}
        rows={state.explorerRows}
        onEnabledChange={handleExplorerEnabledChange}
        onOutputFormatChange={handleOutputFormatChange}
      />
      <Container className={styles.footer}>Footer</Container>
      {state.inputValues.showSvgSource && (
        <SvgSourceModal onClose={() => handleChange(false, "showSvgSource")} />
      )}
      {state.inputValues.showEnlargedSvg && (
        <EnlargedSvgModal onClose={() => handleChange(false, "showEnlargedSvg")} />
      )}
    </div>
  );
};
