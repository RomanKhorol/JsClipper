import { FC, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Section.module.scss";

type sectionProps = {
  sectionId: string;
  children: ReactNode;
  className?: string;
};

const Section: FC<sectionProps> = ({ sectionId, children, className }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <div className={styles.title}>{t(`leftMenu.${sectionId}.title`)}</div>
      <div className={className}>{children}</div>
    </div>
  );
};

export default Section;
