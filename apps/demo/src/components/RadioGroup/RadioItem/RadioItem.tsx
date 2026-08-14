import type { FC, MouseEventHandler } from "react";
import styles from "./RadioItem.module.scss";
import classNames from "classnames";

type RadioItemType = {
  id: string;
  label: string;
  onClick: MouseEventHandler;
  selected: boolean;
};

const RadioItem: FC<RadioItemType> = ({ id, label, onClick, selected }) => (
  <div
    title={label}
    onClick={onClick}
    id={id}
    className={classNames(styles.root, {
      [styles.selected]: selected,
    })}
  >
    <div className={styles.radio} />
    <div className={styles.label}>{label}</div>
  </div>
);

export default RadioItem;
