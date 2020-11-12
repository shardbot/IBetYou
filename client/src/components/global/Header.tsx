import { useRouter } from 'next/router';
import { FC } from 'react';

import { LOGO_IMG_SRC } from '../../constants';
import styles from '../../styles/modules/Header.module.scss';

export const Header: FC = () => {
  const router = useRouter();
  const isIndexRoute: boolean = router.pathname === '/';

  return (
    <header className={`${isIndexRoute ? styles.header : styles['header--secondary']}`}>
      <img
        className={`${isIndexRoute ? styles.logo : styles['logo--secondary']}`}
        src={LOGO_IMG_SRC}
        alt="IBetYou logo"
      />
    </header>
  );
};
