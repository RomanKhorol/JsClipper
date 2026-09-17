import { memo, type FC } from "react";
import WindowedSelect from "react-windowed-select/dist/main.js";
import type { OutputFormat } from "./BottomMenu";
import styles from "./BottomMenu.module.scss";

type OutputControlsProps = {
  enabled: boolean;
  source: string;
  disabledMessage: string;
  outputFormat: OutputFormat;
  outputFormats: OutputFormat[];
  onOutputFormatChange: (option: unknown) => void;
};

const OutputControls: FC<OutputControlsProps> = ({
  enabled,
  source,
  disabledMessage,
  outputFormat,
  outputFormats,
  onOutputFormatChange,
}) => (
  <div className={styles.outputControls}>
    <textarea
      className={styles.source}
      readOnly
      value={enabled ? source : disabledMessage}
    />
    <WindowedSelect
      className={styles.select}
      classNamePrefix="virtualized-dropdown"
      value={outputFormat}
      options={outputFormats}
      onChange={onOutputFormatChange}
      isSearchable={false}
      windowThreshold={100}
    />
  </div>
);

export default memo(OutputControls);
