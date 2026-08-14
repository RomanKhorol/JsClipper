import type { FC } from "react";
import classNames from "classnames";
import { Container } from "../components";
import styles from "./Canvas.module.scss";

type CanvasProps = {
  className?: string;
};

const Canvas: FC<CanvasProps> = ({ className }) => (
  <Container className={classNames(styles.root, className)}>
    Canvas
  </Container>
);

export default Canvas;
