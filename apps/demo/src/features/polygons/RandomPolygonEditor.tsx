import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Button, Container, NumberInput } from "../../components";
import type { RandomPolygonCounts } from "./randomPolygons";
import styles from "./CustomPolygonEditor.module.scss";

type Props = {
  counts: RandomPolygonCounts;
  onCountChange: (key: keyof RandomPolygonCounts, value: number) => void;
  onGenerate: () => void;
};

const RandomPolygonEditor: FC<Props> = ({ counts, onCountChange, onGenerate }) => {
  const { t } = useTranslation();

  return <Container className={styles.root}>
    <h3 className={styles.title}>{t("leftMenu.randomEditor.title")}</h3>
    {(["subjPolygonCount", "subjPointCount", "clipPolygonCount", "clipPointCount"] as const).map((key) => (
      <label className={styles.field} key={key}>
        <span>{t(`leftMenu.randomEditor.${key}`)}</span>
        <NumberInput value={counts[key]} min={1} max={100} onChange={(value) => onCountChange(key, value)} />
      </label>
    ))}
    <div className={styles.actions}><Button label={t("leftMenu.randomEditor.generate")} onClick={onGenerate} /></div>
  </Container>;
};

export default RandomPolygonEditor;
