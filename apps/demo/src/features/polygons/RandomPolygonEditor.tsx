import type { FC } from "react";
import { Button, Container, NumberInput } from "../../components";
import type { RandomPolygonCounts } from "./randomPolygons";
import styles from "./CustomPolygonEditor.module.scss";

type Props = {
  counts: RandomPolygonCounts;
  onCountChange: (key: keyof RandomPolygonCounts, value: number) => void;
  onGenerate: () => void;
};

const RandomPolygonEditor: FC<Props> = ({ counts, onCountChange, onGenerate }) => (
  <Container className={styles.root}>
    <h3 className={styles.title}>Random polygons</h3>
    {(["subjPolygonCount", "subjPointCount", "clipPolygonCount", "clipPointCount"] as const).map((key) => (
      <label className={styles.field} key={key}>
        <span>{key.replace(/([A-Z])/g, " $1")}</span>
        <NumberInput value={counts[key]} min={1} max={100} onChange={(value) => onCountChange(key, value)} />
      </label>
    ))}
    <div className={styles.actions}><Button label="Generate" onClick={onGenerate} /></div>
  </Container>
);

export default RandomPolygonEditor;
