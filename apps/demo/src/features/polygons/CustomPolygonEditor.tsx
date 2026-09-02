import type { ChangeEvent, FC } from "react";
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
  const handleSelectionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onSelect(event.currentTarget.value ? Number(event.currentTarget.value) : null);
  };

  return (
    <Container className={styles.root}>
      <h3 className={styles.title}>Custom polygons</h3>
      <label className={styles.field}>
        <span>Saved set</span>
        <select value={selectedIndex ?? ""} onChange={handleSelectionChange}>
          <option value="">Default</option>
          {polygonSets.map(
            (polygonSet, index) =>
              index > 0 && polygonSet && <option key={index} value={index}>Set {index}</option>,
          )}
        </select>
      </label>
      <label className={styles.field}>
        <span>Subject</span>
        <textarea
          value={value.subj}
          onChange={(event) => onValueChange("subj", event.currentTarget.value)}
        />
      </label>
      <label className={styles.field}>
        <span>Clip</span>
        <textarea
          value={value.clip}
          onChange={(event) => onValueChange("clip", event.currentTarget.value)}
        />
      </label>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.actions}>
        <Button label={selectedIndex === null ? "Save" : "Update"} onClick={onSave} />
        {selectedIndex !== null && <Button label="Delete" variant="secondary" onClick={onDelete} />}
        <Button label="Reset" variant="secondary" onClick={onReset} />
      </div>
    </Container>
  );
};

export default CustomPolygonEditor;
