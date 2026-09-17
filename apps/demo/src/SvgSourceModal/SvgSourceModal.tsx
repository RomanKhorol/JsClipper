import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "../components";
import styles from "./SvgSourceModal.module.scss";

type SvgSourceModalProps = {
  onClose: () => void;
  source: string;
};

const SvgSourceModal: FC<SvgSourceModalProps> = ({ onClose, source }) => {
  const { t } = useTranslation();

  return (
    <Modal title={t("modals.svgSource.title")} onClose={onClose}>
      <textarea className={styles.source} value={source} readOnly />
    </Modal>
  );
};

export default SvgSourceModal;
