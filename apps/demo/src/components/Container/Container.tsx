import type { FC, ReactNode } from "react";
import classNames from "classnames";
import styles from "./Container.module.scss";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

const Container: FC<ContainerProps> = ({ children, className }) => (
  <div className={classNames(styles.root, className)}>{children}</div>
);

export default Container;
