import { type FC } from "react";
import classNames from "classnames";
import WindowedSelect from "react-windowed-select/dist/main.js";
import { Column, Table } from "react-virtualized";
import { Checkbox, Container } from "../components";
import styles from "./BottomMenu.module.scss";

export type ExplorerRow = {
  type: string;
  polygons: string;
  points: string;
  pointsInPolygons: string;
};

export type OutputFormat = { value: string; label: string };

type BottomMenuProps = {
  className?: string;
  enabled: boolean;
  outputFormat: OutputFormat;
  outputFormats: OutputFormat[];
  rows: ExplorerRow[];
  onEnabledChange: (value: boolean) => void;
  onOutputFormatChange: (option: unknown) => void;
};

const BottomMenu: FC<BottomMenuProps> = ({
  className,
  enabled,
  outputFormat,
  outputFormats,
  rows,
  onEnabledChange,
  onOutputFormatChange,
}) => (
  <Container className={classNames(styles.root, className)}>
    <section className={styles.section}>
      <h2 className={styles.title}>Polygon explorer</h2>
      <Checkbox
        id="enabled"
        localePrefix="bottomMenu.polygonExplorer"
        value={enabled}
        onChange={onEnabledChange}
      />
      <div className={styles.outputControls}>
        <textarea
          className={styles.source}
          readOnly
          value="Click polygon counts to view coordinates."
        />
        <WindowedSelect
          className={styles.select}
          value={outputFormat}
          options={outputFormats}
          onChange={onOutputFormatChange}
          isSearchable={false}
          windowThreshold={100}
        />
      </div>
      <Table
        className={styles.table}
        width={560}
        height={192}
        headerHeight={32}
        rowHeight={32}
        rowCount={rows.length}
        rowGetter={({ index }) => rows[index]}
      >
        <Column label="Type" dataKey="type" width={100} />
        <Column label="Polys" dataKey="polygons" width={100} />
        <Column label="Points" dataKey="points" width={120} />
        <Column label="Points in subpolygons" dataKey="pointsInPolygons" width={240} />
      </Table>
    </section>
  </Container>
);

export default BottomMenu;
