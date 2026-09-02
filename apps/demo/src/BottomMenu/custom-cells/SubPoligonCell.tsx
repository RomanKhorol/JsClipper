import { FC, useContext } from "react";
import styles from "./SubPoligonCell.module.scss";
import { TableContext } from "../constants";

const SubPoligonCell: FC<{ cellData: string; rowIndex: number }> = ({
  cellData,
  rowIndex,
}) => {
  const { onSelection } = useContext(TableContext);
  const onAction = (
    action: "out" | "hover" | "click",
    value: string,
    itemIndex: number,
  ) =>
    onSelection({
      id: "polygon",
      type: action,
      rowIndex,
      value,
      itemIndex,
    });
  return (
    <div className={styles.root}>
      {cellData.split(",").map((item, index) => (
        <button
          className={styles.item}
          type="button"
          key={`${index}_${item}`}
          onClick={() => onAction("click", item, index)}
          onMouseEnter={() => onAction("hover", item, index)}
          onMouseLeave={() => onAction("out", item, index)}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default SubPoligonCell;
