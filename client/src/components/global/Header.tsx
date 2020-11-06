import { FC } from 'react';

import { LOGO_IMG_SRC } from '../../constants';
import styles from '../../styles/modules/Header.module.scss';

export const Header: FC = () => {
  return (
    <header className={styles.header}>
      <img className={styles.logo} src={LOGO_IMG_SRC} alt="IBetYou logo" />
    </header>
  );
};
