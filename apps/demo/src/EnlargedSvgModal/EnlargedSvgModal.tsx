import { useEffect, useState, type FC } from "react";
import { Modal } from "../components";
import styles from "./EnlargedSvgModal.module.scss";

type EnlargedSvgModalProps = {
  onClose: () => void;
};

const EnlargedSvgModal: FC<EnlargedSvgModalProps> = ({ onClose }) => {
  const [source, setSource] = useState("");

  useEffect(() => {
    setSource(document.getElementById("svgcontainer")?.innerHTML ?? "");
  }, []);

  return (
    <Modal title="Enlarged SVG" onClose={onClose}>
      <div className={styles.preview} dangerouslySetInnerHTML={{ __html: source }} />
    </Modal>
  );
};

export default EnlargedSvgModal;
