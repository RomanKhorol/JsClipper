import { FC } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Checkbox.module.scss";
import classNames from "classnames";

type CheckboxProps = {
  id: string;
  localePrefix: string;
  value: boolean;
  onChange: (value: boolean, id: string) => void;
};

const Checkbox: FC<CheckboxProps> = ({ id, localePrefix, value, onChange }) => {
  const { t } = useTranslation();

  return (
    <div
      className={classNames(styles.root, {
        [styles.selected]: value,
      })}
      onClick={() => onChange(!value, id)}
    >
      <div className={styles.checkbox}>{value ? "✔" : ""}</div>
      <div className={styles.label}>{t(`${localePrefix}.${id}`)}</div>
    </div>
  );
};

export default Checkbox;
