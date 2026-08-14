import { useEffect, useState, type FC } from "react";
import { Modal } from "../components";
import styles from "./SvgSourceModal.module.scss";

type SvgSourceModalProps = {
  onClose: () => void;
};

const SvgSourceModal: FC<SvgSourceModalProps> = ({ onClose }) => {
  const [source, setSource] = useState("");

  useEffect(() => {
    setSource(document.getElementById("svgcontainer")?.innerHTML ?? "");
  }, []);

  return (
    <Modal title="SVG source" onClose={onClose}>
      <textarea className={styles.source} value={source} readOnly />
    </Modal>
  );
};

export default SvgSourceModal;
