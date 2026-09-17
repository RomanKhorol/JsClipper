import { type FC, memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import {
  Checkbox,
  Container,
  DataTable,
  Section,
  type DataTableColumnConfig,
} from "../components";
import type { ClipperPolygons, ClippingResult } from "../features/clipping";
import {
  formatPolygonOutput,
  polygonsArea,
  type PolygonOutputFormat,
} from "../features/polygons/outputFormat";
import styles from "./BottomMenu.module.scss";
import { PointsCell, SubPoligonsCell } from "./custom-cells";
import { TableContext } from "./constants";
import { PolygonCellData } from "../types";
import OutputControls from "./OutputControls";

export type ExplorerRow = {
  id: ExplorerPolygonId | "total";
  type: string;
  polygons: string;
  points: string;
  pointsInPolygons: string;
};

export type ExplorerPolygonId = "subject" | "clip" | "solution";

export type OutputFormat = { value: string; label: string };

const explorerColumns: DataTableColumnConfig<ExplorerRow>[] = [
  {
    dataKey: "type",
    width: 50,
    flexGrow: 1.5,
    labelLocaleKey: "bottomMenu.table.type",
  },
  {
    dataKey: "polygons",
    width: 50,
    flexGrow: 1,
    labelLocaleKey: "bottomMenu.table.polygons",
  },
  {
    dataKey: "points",
    width: 60,
    flexGrow: 1,
    labelLocaleKey: "bottomMenu.table.points",
    cellRenderer: PointsCell,
  },
  {
    dataKey: "pointsInPolygons",
    width: 120,
    flexGrow: 6,
    labelLocaleKey: "bottomMenu.table.pointsInPolygons",
    cellRenderer: SubPoligonsCell,
  },
];

type BottomMenuProps = {
  className?: string;
  enabled: boolean;
  outputFormat: OutputFormat;
  outputFormats: OutputFormat[];
  rows: ExplorerRow[];
  result: ClippingResult | null;
  onEnabledChange: (value: boolean) => void;
  onOutputFormatChange: (option: unknown) => void;
  onSelection: (data: PolygonCellData) => void;
};

const isPolygonOutputFormat = (value: string): value is PolygonOutputFormat =>
  value === "Clipper" || value === "Plain" || value === "SVG";

const selectedPolygons = (
  result: ClippingResult,
  id: ExplorerPolygonId | "total",
): ClipperPolygons =>
  id === "total"
    ? [...result.subject, ...result.clip, ...result.solution]
    : result[id];

const BottomMenu: FC<BottomMenuProps> = ({
  className,
  enabled,
  outputFormat,
  outputFormats,
  rows,
  result,
  onEnabledChange,
  onOutputFormatChange,
  onSelection,
}) => {
  const { t } = useTranslation();
  const [selectedRow, setSelectedRow] = useState<
    ExplorerPolygonId | "total" | null
  >(null);

  useEffect(() => setSelectedRow(null), [result]);

  const polygons =
    result && selectedRow ? selectedPolygons(result, selectedRow) : null;
  const source =
    polygons && isPolygonOutputFormat(outputFormat.value)
      ? formatPolygonOutput(polygons, outputFormat.value)
      : t("bottomMenu.output.selectPolygon");
  const area = polygons ? t("bottomMenu.output.area", { area: polygonsArea(polygons) }) : "";
  const rowsToShow = enabled ? rows : [];

  return (
    <Container className={classNames(styles.root, className)}>
      <Section
        sectionId="polygonExplorer"
        localePrefix="bottomMenu"
        rootClassName={styles.sectionRoot}
        className={styles.section}
      >
        <Checkbox
          id="enabled"
          localePrefix="bottomMenu.polygonExplorer"
          value={enabled}
          onChange={onEnabledChange}
        />
        <OutputControls
          enabled={enabled}
          source={source}
          disabledMessage={t("bottomMenu.output.disabled")}
          outputFormat={outputFormat}
          outputFormats={outputFormats}
          onOutputFormatChange={onOutputFormatChange}
        />
        <TableContext.Provider value={{ onSelection }}>
          <DataTable
            columnConfig={explorerColumns}
            rows={rowsToShow}
            onRowClick={(row) => setSelectedRow(row.id)}
          />
        </TableContext.Provider>
        {enabled && area && <p className={styles.area}>{area}</p>}
      </Section>
    </Container>
  );
};

export default memo(BottomMenu);
