import { FC } from "react";
import classNames from "classnames";
import { Button, Container } from "../components";
import styles from "./Header.module.scss";

type HeaderProps = {
  className?: string;
  currentLanguage: string;
  onToogleLanguage(): void;
};

const Header: FC<HeaderProps> = ({
  className,
  currentLanguage,
  onToogleLanguage,
}) => {
  return (
    <Container className={classNames(styles.root, className)}>
      <div className={styles.title}>Clipper</div>
      <Button label={currentLanguage} onClick={onToogleLanguage} />
    </Container>
  );
};
export default Header;
