import { createElement, type FC, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { AutoSizer, Column, Table } from "react-virtualized";
import "react-virtualized/styles.css";
import styles from "./DataTable.module.scss";
import classNames from "classnames";

export type DataTableColumnConfig<TRow extends object> = {
  dataKey: Extract<keyof TRow, string>;
  width: number;
  flexGrow: number;
  labelLocaleKey: string;
  formatCell?: (value: unknown) => ReactNode;
  cellRenderer?: FC<{ cellData: string; rowIndex: number }>;
};

type DataTableProps<TRow extends object> = {
  columnConfig: DataTableColumnConfig<TRow>[];
  rows: TRow[];
  onRowClick: (row: TRow) => void;
  className?: string;
};

export const DataTable = <TRow extends object>({
  columnConfig,
  rows,
  onRowClick,
  className,
}: DataTableProps<TRow>) => {
  const { t } = useTranslation();
  const contentHeight = (rows.length + 1) * 32;
  return (
    <div
      className={classNames(styles.container, className)}
      style={{ height: contentHeight }}
    >
      <AutoSizer>
        {({ width, height }) => (
          <Table
            className={styles.table}
            width={width - 3}
            height={height}
            headerHeight={32}
            rowHeight={32}
            rowCount={rows.length}
            rowGetter={({ index }) => rows[index]}
            onRowClick={({ rowData }) => onRowClick(rowData as TRow)}
          >
            {columnConfig.map(
              ({
                dataKey,
                width: columnWidth,
                flexGrow,
                labelLocaleKey,
                formatCell,
                cellRenderer,
              }) => (
                <Column
                  headerClassName={styles.header}
                  key={dataKey}
                  label={t(labelLocaleKey)}
                  dataKey={dataKey}
                  width={columnWidth}
                  flexGrow={flexGrow}
                  flexShrink={1}
                  cellRenderer={
                    formatCell
                      ? ({ cellData }) => formatCell(cellData)
                      : cellRenderer
                        ? ({ cellData, rowIndex }) =>
                            createElement(cellRenderer, {
                              cellData: String(cellData ?? ""),
                              rowIndex,
                            })
                        : undefined
                  }
                />
              ),
            )}
          </Table>
        )}
      </AutoSizer>
    </div>
  );
};
