import { useRouter } from 'next/router';
import { FC, SyntheticEvent, useContext, useEffect, useState } from 'react';

import { AcceptBetForm } from '../components/forms';
import { LinkButton } from '../components/global';
import { MainLayout } from '../components/layouts';
import { useQuery } from '../hooks/useQuery';
import { bet as makeBet, getBet } from '../services/contract';
import { sendEmail } from '../services/mail';
import btnStyles from '../styles/modules/Button.module.scss';
import styles from '../styles/modules/pages/AcceptBet.module.scss';
import { PageWithLayout } from '../types';
import { Web3Context } from './_app';

export interface ContractBet {
  description: string;
  betState: string;
  expirationTime: string;
  deposit: string;
}

const AcceptBet: FC = () => {
  const web3 = useContext(Web3Context);
  const router = useRouter();
  const query = useQuery();
  const [bet, setBet] = useState<ContractBet | null>(null);
  const [judgeEmail, setJudgeEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!query) {
      return;
    }

    if (!query.address) {
      router.push('/');
    }

    const { address } = router.query;
    if (address) {
      console.log('HERE - get info');
      getBet(web3, address)
        .then((bet) => setBet(bet))
        .catch((e) => alert(e));
    }
  }, [router, web3.eth.Contract]);

  const acceptBet = async (e: SyntheticEvent) => {
    e.preventDefault();
    const { address } = router.query;
    setIsLoading(true);

    try {
      const accounts = await web3.eth.getAccounts();

      // accept bet as counter bettor
      await makeBet(web3, accounts[0], address, bet.deposit, 'counter-bettor');
    } catch (e) {
      alert(e.message);
      setIsLoading(false);
      return;
    }

    try {
      // send mail to judge
      await sendEmail(judgeEmail, address, 'judge', 'counter-bettor-judge');
    } catch (e) {
      alert(e.message);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setIsSuccess(true);
  };

  return (
    <div className={styles.container}>
      {bet && !isSuccess && (
        <>
          <AcceptBetForm
            web3={web3}
            bet={bet}
            onSubmit={acceptBet}
            setJudgeEmail={setJudgeEmail}
            isLoading={isLoading}
          />
          <p className={styles.disclaimer}>
            By accepting this bet you confirm that you understand that this bet will lock $ for a
            specified amount of time and the amount will be transferred to the ??? This is done
            using a smart contracts and is irreversible.
          </p>
        </>
      )}
      {isSuccess && (
        <div className={styles.successWrapper}>
          <p className={styles.successMsg}>Your bet has been placed. Good Luck.</p>
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

(AcceptBet as PageWithLayout).Layout = MainLayout;

export default AcceptBet;
