import { FC, MouseEventHandler } from "react";
import styles from "./IconButton.module.scss";
import classNames from "classnames";

type IconButtonProps = {
  label: string;
  variant?: "primary" | "secondary";
  onClick: MouseEventHandler<HTMLButtonElement>;
  id: string;
  disabled?: boolean;
  ariaLabel?: string;
};

const IconButton: FC<IconButtonProps> = ({
  label,
  variant = "primary",
  onClick,
  id,
  disabled,
  ariaLabel,
}) => {
  return (
    <button
      className={classNames(styles.button, styles[variant])}
      onClick={onClick}
      id={id}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {label}
    </button>
  );
};

export default IconButton;
