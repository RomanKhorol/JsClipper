import { FC, ReactNode } from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import styles from "./Section.module.scss";

type sectionProps = {
  sectionId: string;
  children: ReactNode;
  className?: string;
  rootClassName?: string;
  localePrefix?: string;
};

const Section: FC<sectionProps> = ({
  sectionId,
  children,
  className,
  rootClassName,
  localePrefix = "leftMenu",
}) => {
  const { t } = useTranslation();

  return (
    <div className={classNames(styles.root, rootClassName)}>
      <div className={styles.title}>{t(`${localePrefix}.${sectionId}.title`)}</div>
      <div className={className}>{children}</div>
    </div>
  );
};

export default Section;
