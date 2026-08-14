import { FC } from "react";
import Checkbox from "../Checkbox/Checkbox";
import { NumberInput } from "../NumberInput";
import styles from "./CheckboxWithInput.module.scss";

type CheckboxWithInputProps = {
  id: string;
  localePrefix: string;
  value: number | null;
  onChange: (value: number | null, id: string) => void;
  defaultValue?: number;
};

const CheckboxWithInput: FC<CheckboxWithInputProps> = ({
  id,
  localePrefix,
  value,
  onChange,
  defaultValue = 0,
}) => {
  const checked = value !== null;

  const handleCheckedChange = (nextChecked: boolean) => {
    onChange(nextChecked ? defaultValue : null, id);
  };

  return (
    <div className={styles.root}>
      <Checkbox
        id={id}
        localePrefix={localePrefix}
        value={checked}
        onChange={handleCheckedChange}
      />

      <NumberInput
        value={value ?? defaultValue}
        onChange={(nextValue) => onChange(nextValue, id)}
        disabled={!checked}
        step={0.1}
      />
    </div>
  );
};

export default CheckboxWithInput;
