import { FC, MouseEventHandler } from "react";
import styles from "./IconButton.module.scss";
import classNames from "classnames";

type IconButtonProps = {
  label: string;
  variant?: "primary" | "secondary";
  onClick: MouseEventHandler<HTMLButtonElement>;
  id: string;
  disabled?: boolean;
};

const IconButton: FC<IconButtonProps> = ({
  label,
  variant = "primary",
  onClick,
  id,
  disabled,
}) => {
  return (
    <button
      className={classNames(styles.button, styles[variant])}
      onClick={onClick}
      id={id}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default IconButton;
