import type { ChangeEvent, FC } from "react";
import { useTranslation } from "react-i18next";
import { Button, Container } from "../../components";
import type { CustomPolygonSet, CustomPolygonSets } from "./customPolygons";
import styles from "./CustomPolygonEditor.module.scss";

type CustomPolygonEditorProps = {
  value: CustomPolygonSet;
  polygonSets: CustomPolygonSets;
  selectedIndex: number | null;
  error: string | null;
  onValueChange: (field: keyof CustomPolygonSet, value: string) => void;
  onSelect: (index: number | null) => void;
  onSave: () => void;
  onDelete: () => void;
  onReset: () => void;
};

const CustomPolygonEditor: FC<CustomPolygonEditorProps> = ({
  value,
  polygonSets,
  selectedIndex,
  error,
  onValueChange,
  onSelect,
  onSave,
  onDelete,
  onReset,
}) => {
  const { t } = useTranslation();
  const handleSelectionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onSelect(event.currentTarget.value ? Number(event.currentTarget.value) : null);
  };

  return (
    <Container className={styles.root}>
      <h3 className={styles.title}>{t("leftMenu.customEditor.title")}</h3>
      <label className={styles.field}>
        <span>{t("leftMenu.customEditor.savedSet")}</span>
        <select value={selectedIndex ?? ""} onChange={handleSelectionChange}>
          <option value="">{t("leftMenu.customEditor.defaultSet")}</option>
          {polygonSets.map(
            (polygonSet, index) => index > 0 && polygonSet && (
              <option key={index} value={index}>
                {t("leftMenu.customEditor.set", { index })}
              </option>
            ),
          )}
        </select>
      </label>
      <label className={styles.field}>
        <span>{t("leftMenu.customEditor.subject")}</span>
        <textarea
          value={value.subj}
          onChange={(event) => onValueChange("subj", event.currentTarget.value)}
        />
      </label>
      <label className={styles.field}>
        <span>{t("leftMenu.customEditor.clip")}</span>
        <textarea
          value={value.clip}
          onChange={(event) => onValueChange("clip", event.currentTarget.value)}
        />
      </label>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.actions}>
        <Button label={t(selectedIndex === null ? "leftMenu.customEditor.save" : "leftMenu.customEditor.update")} onClick={onSave} />
        {selectedIndex !== null && <Button label={t("leftMenu.customEditor.delete")} variant="secondary" onClick={onDelete} />}
        <Button label={t("leftMenu.customEditor.reset")} variant="secondary" onClick={onReset} />
      </div>
    </Container>
  );
};

export default CustomPolygonEditor;
