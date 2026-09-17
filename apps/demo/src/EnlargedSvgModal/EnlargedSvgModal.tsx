import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "../components";
import styles from "./EnlargedSvgModal.module.scss";

type EnlargedSvgModalProps = {
  onClose: () => void;
  source: string;
};

const EnlargedSvgModal: FC<EnlargedSvgModalProps> = ({ onClose, source }) => {
  const { t } = useTranslation();

  return (
    <Modal title={t("modals.enlargedSvg.title")} onClose={onClose}>
      <div className={styles.preview} dangerouslySetInnerHTML={{ __html: source }} />
    </Modal>
  );
};

export default EnlargedSvgModal;
