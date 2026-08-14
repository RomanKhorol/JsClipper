import { type FC } from "react";
import { Column, Table } from "react-virtualized";
import classNames from "classnames";
import { Button, Container } from "../components";
import styles from "./RightMenu.module.scss";

export type BenchmarkRun = {
  mode: string;
  runs: string;
  status: string;
};

export const benchmarkButtons = [
  { id: "benchmark1", label: "Run NB", mode: "Normal", runs: "1" },
  { id: "benchmark1b", label: "Run NB 5x", mode: "Normal", runs: "5" },
  { id: "benchmark2", label: "Run BIB", mode: "Big Integer", runs: "1" },
  { id: "benchmark2b", label: "Run BIB 5x", mode: "Big Integer", runs: "5" },
];

type RightMenuProps = {
  className?: string;
  runs: BenchmarkRun[];
  onRunBenchmark: (buttonId: string) => void;
};

const RightMenu: FC<RightMenuProps> = ({ className, runs, onRunBenchmark }) => (
  <Container className={classNames(styles.root, className)}>
    <section className={styles.section}>
      <h2 className={styles.title}>Benchmark</h2>
      <div className={styles.actions}>
        {benchmarkButtons.map((button) => (
          <Button
            key={button.id}
            label={button.label}
            onClick={() => onRunBenchmark(button.id)}
          />
        ))}
      </div>
    </section>
    <section className={styles.section}>
      <h2 className={styles.title}>Benchmark results</h2>
      {runs.length ? (
        <Table
          className={styles.table}
          width={320}
          height={96}
          headerHeight={32}
          rowHeight={32}
          rowCount={runs.length}
          rowGetter={({ index }) => runs[index]}
        >
          <Column label="Mode" dataKey="mode" width={120} />
          <Column label="Runs" dataKey="runs" width={64} />
          <Column label="Status" dataKey="status" width={136} />
        </Table>
      ) : (
        <div className={styles.empty}>No benchmark results yet.</div>
      )}
    </section>
  </Container>
);

export default RightMenu;
