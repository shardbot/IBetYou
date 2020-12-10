import { FC, useState } from 'react';

import { InitiateBetForm } from '../components/forms';
import { MainLayout } from '../components/layouts';
import styles from '../styles/modules/pages/InitiateBet.module.scss';
import { PageWithLayout } from '../types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface InitialBet {}

const InitiateBet: FC = () => {
  const [bet, setBet] = useState<InitialBet>(null);

  return (
    <div className={styles.container}>
      <InitiateBetForm setBet={setBet} bet={bet} />
    </div>
  );
};

(InitiateBet as PageWithLayout).Layout = MainLayout;

export default InitiateBet;
