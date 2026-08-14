import type { FC, ReactNode } from "react";
import styles from "./Modal.module.scss";

type ModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

const Modal: FC<ModalProps> = ({ title, onClose, children }) => (
  <div className={styles.overlay} role="presentation" onMouseDown={onClose}>
    <section
      className={styles.root}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <button className={styles.close} type="button" onClick={onClose} aria-label="Close">
          ×
        </button>
      </header>
      <div className={styles.content}>{children}</div>
    </section>
  </div>
);

export default Modal;
