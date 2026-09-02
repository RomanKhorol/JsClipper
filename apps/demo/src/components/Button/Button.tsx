import { FC } from "react";
import styles from "./Button.module.scss";
import classNames from "classnames";

type ButtonProps = {
  label: string;
    variant?: "primary" | "secondary";
    onClick(): void;
    disabled?: boolean;
};

const Button: FC<ButtonProps> = ({ label, variant = "primary", onClick, disabled = false }) => {
    return (
        <button className={classNames(styles.button, styles[variant])} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

export default Button;
