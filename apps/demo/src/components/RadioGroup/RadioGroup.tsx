import { FC, useCallback, MouseEventHandler } from "react";
import classNames from "classnames";
import styles from "./RadioGroup.module.scss";
import RadioItem from "./RadioItem/RadioItem";
import { useTranslation } from "react-i18next";

type RadioGroupProps = {
  values: readonly string[];
  value: string;
  onChange(value: string, id: string): void;
  id: string;
  localePrefix: string;
  title?: boolean;
  className?: string;
};

const RadioGroup: FC<RadioGroupProps> = ({
  values,
  value,
  onChange,
  id,
  localePrefix,
  title = false,
  className,
}) => {
  const { t } = useTranslation();
  const handleChange: MouseEventHandler<HTMLInputElement> = useCallback(
    (e) => onChange(e.currentTarget.id as string, id),
    [id, onChange],
  );
  return (
    <div className={classNames(styles.root, className)}>
      {title && <div>{t(`${localePrefix}.${id}.title`)}</div>}
      <div className={styles.items}>
        {values.map((currentValue) => (
          <RadioItem
            onClick={handleChange}
            id={currentValue}
            selected={currentValue === value}
            key={currentValue}
            label={t(`${localePrefix}.${id}.${currentValue}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
