import type { FC } from "react";
import { Modal } from "../components";
import styles from "./SvgSourceModal.module.scss";

type SvgSourceModalProps = {
  onClose: () => void;
  source: string;
};

const SvgSourceModal: FC<SvgSourceModalProps> = ({ onClose, source }) => (
    <Modal title="SVG source" onClose={onClose}>
      <textarea className={styles.source} value={source} readOnly />
    </Modal>
  );

export default SvgSourceModal;
