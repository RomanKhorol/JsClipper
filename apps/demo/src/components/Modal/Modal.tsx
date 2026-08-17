import type { FC, ReactNode } from "react";
import styles from "./Modal.module.scss";
import { IconButton } from "../IconButton";
import { Container } from "../Container";
type ModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

const Modal: FC<ModalProps> = ({ title, onClose, children }) => (
  <div className={styles.overlay} role="presentation">
    <Container className={styles.root}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <IconButton onClick={onClose} label="×" id="close" />
      </header>
      <div className={styles.content}>{children}</div>
    </Container>
  </div>
);

export default Modal;
