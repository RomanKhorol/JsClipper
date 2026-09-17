import type { FC, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Modal.module.scss";
import { IconButton } from "../IconButton";
import { Container } from "../Container";
type ModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

const Modal: FC<ModalProps> = ({ title, onClose, children }) => {
  const { t } = useTranslation();

  return (
  <div className={styles.overlay} role="presentation">
    <Container className={styles.root}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <IconButton onClick={onClose} label="×" ariaLabel={t("modals.close")} id="close" />
      </header>
      <div className={styles.content}>{children}</div>
    </Container>
  </div>
  );
};

export default Modal;
