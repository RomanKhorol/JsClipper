import { FC } from "react";
import styles from "./Button.module.scss";
import classNames from "classnames";

type ButtonProps = {
  label: string;
    variant?: "primary" | "secondary";
    onClick(): void;
};

const Button: FC<ButtonProps> = ({ label, variant = "primary", onClick }) => {
    return (
        <button className={classNames(styles.button, styles[variant])} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
