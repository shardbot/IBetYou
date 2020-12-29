import { FC } from 'react';

import styles from '../../styles/modules/Loader.module.scss';

export const Loader: FC = () => {
  return <span className={styles.loader}>Loading...</span>;
};
