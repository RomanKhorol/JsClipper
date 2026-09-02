import { FC, useContext } from "react";
import styles from "./PiontsCell.module.scss";
import { TableContext } from "../constants";

const PiontsCell: FC<{ cellData: string; rowIndex: number }> = ({
  cellData,
  rowIndex,
}) => {
  const { onSelection } = useContext(TableContext);
  const onAction = (action: "out" | "hover" | "click") =>
    onSelection({
      id: "points",
      type: action,
      rowIndex,
      value: cellData,
      itemIndex: 0,
    });
  const onClick = () => onAction("click");
  const onMouseEnter = () => onAction("hover");
  const onMouseLeave = () => onAction("out");
  return (
    <button
      className={styles.root}
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {cellData}
    </button>
  );
};
export default PiontsCell;
