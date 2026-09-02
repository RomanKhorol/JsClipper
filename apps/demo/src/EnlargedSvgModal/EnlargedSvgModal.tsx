import type { FC } from "react";
import { Modal } from "../components";
import styles from "./EnlargedSvgModal.module.scss";

type EnlargedSvgModalProps = {
  onClose: () => void;
  source: string;
};

const EnlargedSvgModal: FC<EnlargedSvgModalProps> = ({ onClose, source }) => (
    <Modal title="Enlarged SVG" onClose={onClose}>
      <div className={styles.preview} dangerouslySetInnerHTML={{ __html: source }} />
    </Modal>
  );

export default EnlargedSvgModal;
