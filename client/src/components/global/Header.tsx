import { FC } from 'react';

import styles from '../../styles/modules/Header.module.scss';

export const Header: FC = () => {
  return (
    <header className={styles.header}>
      <img className={styles.logo} src="/assets/images/ibetyou_logo.svg" alt="IBetYou logo" />
    </header>
  );
};
