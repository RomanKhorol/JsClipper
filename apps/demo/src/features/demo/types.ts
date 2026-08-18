import type { ExplorerRow, OutputFormat } from "../../BottomMenu";
import type { LeftMenuInputValues } from "../../LeftMenu";
import type { BenchmarkRun } from "../../RightMenu";

export type DemoState = {
  inputValues: LeftMenuInputValues;
  benchmarkRuns: BenchmarkRun[];
  explorerEnabled: boolean;
  outputFormat: OutputFormat;
  explorerRows: ExplorerRow[];
};

export enum DemoActionType {
  InputValueChanged = "inputValueChanged",
  BenchmarkStarted = "benchmarkStarted",
  ExplorerEnabledChanged = "explorerEnabledChanged",
  OutputFormatChanged = "outputFormatChanged",
  ExplorerRowsChanged = "explorerRowsChanged",
}

export type DemoAction = {
  type: DemoActionType;
  payload?: unknown;
};
