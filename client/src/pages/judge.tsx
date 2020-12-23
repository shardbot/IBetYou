import { useRouter } from 'next/router';
import { FC, MouseEventHandler, useContext, useEffect, useState } from 'react';

import { Button, LinkButton, Loader } from '../components/global';
import { MainLayout } from '../components/layouts';
import { addJudge, getBet } from '../services/contract';
import btnStyles from '../styles/modules/Button.module.scss';
import styles from '../styles/modules/pages/Judge.module.scss';
import { PageWithLayout } from '../types';
import { Web3Context } from './_app';

export interface ContractBet {
  description: string;
  betState: string;
  expirationTime: string;
  deposit: string;
}

interface ConfirmationProps {
  bet: ContractBet;
  isLoading: boolean;
  confirmJudge: MouseEventHandler<HTMLButtonElement>;
}

const Confirmation: FC<ConfirmationProps> = ({ bet, isLoading, confirmJudge }) => {
  return (
    <div className={styles.wrapper}>
      <p>I confirm I said to be a judge for the following bet:</p>
      <p className={styles.disclaimer}>{bet.description}</p>
      {isLoading ? (
        <Loader />
      ) : (
        <Button
          onClick={confirmJudge}
          className={[btnStyles.button, btnStyles.buttonPrimary].join(' ')}>
          CONNECT METAMASK AND CONFIRM
        </Button>
      )}
    </div>
  );
};

const Judge: FC = () => {
  const web3 = useContext(Web3Context);
  const router = useRouter();
  const [bet, setBet] = useState<ContractBet | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    const { address } = router.query;

    if (address) {
      getBet(web3, address).then((bet) => setBet(bet));
    }
  }, [router, web3.eth.Contract]);

  const confirmJudge = async () => {
    const { address, type } = router.query;
    setIsLoading(true);

    try {
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();

      await addJudge(web3, type, address, accounts[0]);
    } catch (e) {
      alert(e);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setIsSuccess(true);
  };

  return (
    <div className={styles.container}>
      {bet && !isSuccess && (
        <Confirmation bet={bet} confirmJudge={confirmJudge} isLoading={isLoading} />
      )}
      {isSuccess && (
        <div className={styles.successWrapper}>
          <p className={styles.successMsg}>You successfully accepted to be a judge for this bet.</p>
          <LinkButton
            className={[btnStyles.button, btnStyles.buttonPrimary].join(' ')}
            to="/"
            text="HOME"
          />
        </div>
      )}
    </div>
  );
};

(Judge as PageWithLayout).Layout = MainLayout;

export default Judge;
