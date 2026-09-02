/**
 * Reserved React mount point. The legacy demo renders before this root so new
 * React features can be introduced beside it without replacing legacy DOM.
 */
import { useTranslation } from "react-i18next";
import { BottomMenu } from "./BottomMenu";
import { Canvas, createSvgMarkup } from "./Canvas";
import { Container } from "./components";
import { EnlargedSvgModal } from "./EnlargedSvgModal";
import { useDemoController } from "./features/demo/useDemoController";
import { Header } from "./Header";
import "./i18n";
import { LeftMenu } from "./LeftMenu";
import styles from "./App.module.scss";
import { RightMenu } from "./RightMenu";
import { SvgSourceModal } from "./SvgSourceModal";

const languages = ["en", "uk", "de", "pl"] as const;

export const App = () => {
  const { i18n } = useTranslation();
  const {
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
  } = useDemoController();

  const onToogleLanguege = () => {
    const languageIndex = languages.indexOf(
      i18n.language as (typeof languages)[number],
    );
    const nextLanguage = languages[(languageIndex + 1) % languages.length];
    void i18n.changeLanguage(nextLanguage);
  };

  const svgSource = state.calculationResult
    ? createSvgMarkup(
        state.calculationResult,
        state.inputValues.scale,
        state.inputValues.subjectFillType === "nonZero" ? "nonZero" : "evenOdd",
        state.inputValues.clipFillType === "nonZero" ? "nonZero" : "evenOdd",
      )
    : "";

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
        onChange={handleInputValueChange}
        customPolygonSets={state.customPolygonSets}
        selectedCustomPolygonIndex={state.selectedCustomPolygonIndex}
        customPolygonDraft={state.customPolygonDraft}
        customPolygonError={state.customPolygonError}
        onCustomPolygonDraftChange={handleCustomPolygonDraftChange}
        onCustomPolygonSelect={handleCustomPolygonSelect}
        onCustomPolygonSave={handleCustomPolygonSave}
        onCustomPolygonDelete={handleCustomPolygonDelete}
        onCustomPolygonReset={handleCustomPolygonReset}
        randomPolygonCounts={state.randomPolygonCounts}
        onRandomPolygonCountChange={handleRandomPolygonCountChange}
        onGenerateRandomPolygons={handleGenerateRandomPolygons}
      />
      <Canvas
        className={styles.canvas}
        result={state.calculationResult}
        scale={state.inputValues.scale}
        subjectFillType={
          state.inputValues.subjectFillType === "nonZero"
            ? "nonZero"
            : "evenOdd"
        }
        clipFillType={
          state.inputValues.clipFillType === "nonZero" ? "nonZero" : "evenOdd"
        }
        bevel={state.inputValues.bevel}
        selection={state.hoveredPolygon ?? state.selectedPolygon}
      />
      <RightMenu
        className={styles.rightMenu}
        runs={state.benchmarkRuns}
        onRunBenchmark={handleRunBenchmark}
        onCancelBenchmark={handleCancelBenchmark}
      />
      <BottomMenu
        className={styles.bottomMenu}
        enabled={state.explorerEnabled}
        outputFormat={state.outputFormat}
        outputFormats={outputFormats}
        rows={state.explorerRows}
        result={state.calculationResult}
        onEnabledChange={handleExplorerEnabledChange}
        onOutputFormatChange={handleOutputFormatChange}
        onSelection={handleSelection}
      />
      <Container className={styles.footer}>Footer</Container>
      {state.inputValues.showSvgSource && (
        <SvgSourceModal
          source={svgSource}
          onClose={() => handleInputValueChange(false, "showSvgSource")}
        />
      )}
      {state.inputValues.showEnlargedSvg && (
        <EnlargedSvgModal
          source={svgSource}
          onClose={() => handleInputValueChange(false, "showEnlargedSvg")}
        />
      )}
    </div>
  );
};
