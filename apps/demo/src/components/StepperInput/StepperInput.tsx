import { type FC, type MouseEvent, useId } from "react";
import { useTranslation } from "react-i18next";
import styles from "./StepperInput.module.scss";
import { IconButton } from "../IconButton";
import { NumberInput } from "../NumberInput";

type StepperInputProps = {
  id: string;
  localePrefix: string;
  value: number;
  onChange: (value: number, id: string) => void;
  step?: number;
  min?: number;
  max?: number;
};

const StepperInput: FC<StepperInputProps> = ({
  id,
  localePrefix,
  value,
  onChange,
  step = 1,
  min,
  max,
}) => {
  const { t } = useTranslation();
  const inputId = useId();

  const setValue = (nextValue: number) => {
    const normalizedValue = Math.min(
      max ?? nextValue,
      Math.max(min ?? nextValue, nextValue),
    );

    onChange(normalizedValue, id);
  };

  const handleUpdate = (event: MouseEvent<HTMLButtonElement>) => {
    setValue(value + step * (event.currentTarget.id === "decrease" ? -1 : 1));
  };

  return (
    <div className={styles.root}>
      <label className={styles.label} htmlFor={inputId}>
        {t(`${localePrefix}.${id}`)}
      </label>
      <div className={styles.content}>
        <NumberInput
          id={inputId}
          value={value}
          onChange={setValue}
          step={step}
          min={min}
          max={max}
        />
        <div className={styles.buttonContainer}>
          <IconButton
            label="-"
            id="decrease"
            onClick={handleUpdate}
            disabled={min !== undefined && value <= min}
          />
          <IconButton
            label="+"
            id="increase"
            onClick={handleUpdate}
            disabled={max !== undefined && value >= max}
          />
        </div>
      </div>
    </div>
  );
};

export default StepperInput;
