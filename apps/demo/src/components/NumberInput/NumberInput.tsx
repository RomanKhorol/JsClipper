import { type ChangeEvent, type FC, useId } from "react";
import styles from "./NumberInput.module.scss";

type NumberInputProps = {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  id?: string;
};

const NumberInput: FC<NumberInputProps> = ({
  value,
  onChange,
  step = 1,
  min,
  max,
  disabled = false,
  id,
}) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.currentTarget.valueAsNumber;

    if (Number.isNaN(nextValue)) return;

    onChange(Math.min(max ?? nextValue, Math.max(min ?? nextValue, nextValue)));
  };

  return (
    <input
      className={styles.root}
      id={inputId}
      type="number"
      value={value}
      onChange={handleChange}
      step={step}
      min={min}
      max={max}
      disabled={disabled}
    />
  );
};

export default NumberInput;
