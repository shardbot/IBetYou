import { FC } from 'react';

import { InitiateBetForm } from '../components/forms';
import { MainLayout } from '../components/layouts';
import styles from '../styles/modules/pages/InitiateBet.module.scss';
import { PageWithLayout } from '../types';

const InitiateBet: FC = () => {
  return (
    <div className={styles.container}>
      <InitiateBetForm />
    </div>
  );
};

(InitiateBet as PageWithLayout).Layout = MainLayout;

export default InitiateBet;
