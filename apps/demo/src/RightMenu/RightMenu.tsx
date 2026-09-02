import { type FC } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import {
  Button,
  Container,
  DataTable,
  Section,
  type DataTableColumnConfig,
} from "../components";
import {
  benchmarkDefinitions,
  downloadBenchmarkRuns,
  type BenchmarkRun,
} from "../features/benchmark";
import styles from "./RightMenu.module.scss";

type RightMenuProps = {
  className?: string;
  runs: BenchmarkRun[];
  onRunBenchmark: (buttonId: BenchmarkRun["id"]) => void;
  onCancelBenchmark: () => void;
};

const benchmarkColumns = (
  t: (key: string) => string,
): DataTableColumnConfig<BenchmarkRun>[] => [
  {
    dataKey: "mode",
    width: 120,
    flexGrow: 1.5,
    labelLocaleKey: "rightMenu.table.mode",
    formatCell: (value) => t(`rightMenu.mode.${value}`),
  },
  {
    dataKey: "runs",
    width: 64,
    flexGrow: 1,
    labelLocaleKey: "rightMenu.table.runs",
  },
  {
    dataKey: "status",
    width: 136,
    flexGrow: 1.5,
    labelLocaleKey: "rightMenu.table.status",
    formatCell: (value) => t(`rightMenu.status.${value}`),
  },
  {
    dataKey: "completed",
    width: 96,
    flexGrow: 1,
    labelLocaleKey: "rightMenu.table.progress",
  },
  {
    dataKey: "durationMs",
    width: 64,
    flexGrow: 1,
    labelLocaleKey: "rightMenu.table.duration",
  },
];

const RightMenu: FC<RightMenuProps> = ({
  className,
  runs,
  onRunBenchmark,
  onCancelBenchmark,
}) => {
  const { t } = useTranslation();
  const activeRun = runs.find(({ status }) => status === "Running");
  return (
    <Container className={classNames(styles.root, className)}>
      <Section
        sectionId="benchmark"
        localePrefix="rightMenu"
        className={styles.section}
      >
        <div className={styles.actions}>
          {benchmarkDefinitions.map((button) => (
            <Button
              key={button.id}
              label={
                activeRun?.id === button.id
                  ? t("rightMenu.actions.stop")
                  : t(`rightMenu.actions.${button.id}`)
              }
              onClick={() =>
                activeRun?.id === button.id
                  ? onCancelBenchmark()
                  : onRunBenchmark(button.id)
              }
              disabled={Boolean(activeRun && activeRun.id !== button.id)}
            />
          ))}
        </div>
      </Section>
      <Section
        sectionId="benchmarkResults"
        localePrefix="rightMenu"
        className={styles.section}
      >
        {runs.length ? (
          <>
            <DataTable
              columnConfig={benchmarkColumns(t)}
              rows={runs}
              onRowClick={() => undefined}
              className={styles.tableContainer}
            />
            <Button
              label={t("rightMenu.actions.exportCsv")}
              variant="secondary"
              onClick={() => downloadBenchmarkRuns(runs)}
            />
          </>
        ) : (
          <div className={styles.empty}>{t("rightMenu.empty")}</div>
        )}
        {/* {runs.length > 0 && (
          <Button
            label={t("rightMenu.actions.exportCsv")}
            variant="secondary"
            onClick={() => downloadBenchmarkRuns(runs)}
          />
        )} */}
      </Section>
    </Container>
  );
};

export default RightMenu;
