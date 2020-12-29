import { FC, SyntheticEvent, useContext, useState } from 'react';

import { InitiateBetForm } from '../components/forms';
import { LinkButton } from '../components/global';
import { MainLayout } from '../components/layouts';
import { bet as makeBet, createBet, getBet } from '../services/contract';
import { sendEmail } from '../services/mail';
import btnStyles from '../styles/modules/Button.module.scss';
import styles from '../styles/modules/pages/InitiateBet.module.scss';
import { PageWithLayout } from '../types';
import { Web3Context } from './_app';

export interface InitialBet {
  opponentEmail: string;
  description: string;
  judgeEmail: string;
  deposit: string;
  expirationDate: string;
}

const InitiateBet: FC = () => {
  const web3 = useContext(Web3Context);
  const [bet, setBet] = useState<InitialBet>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const initiateBet = async (e: SyntheticEvent) => {
    e.preventDefault();

    let betAddress = null;
    let account = null;

    setIsLoading(true);

    try {
      // 1. CREATE BET
      // Enable metamask
      await window.ethereum.enable();

      // Get accounts
      const accounts = await web3.eth.getAccounts();
      account = accounts[0];

      // call createBet method in smart contract
      const response = await createBet(web3, account, {
        expirationDate: bet.expirationDate,
        description: bet.description,
        deposit: bet.deposit
      });
      console.log(response);

      // get address of created bet
      betAddress = response.events.BetDeployed.returnValues[0];
      console.log(betAddress);
    } catch (e) {
      alert(e.message);
      console.log(e);
      setIsLoading(false);
      return;
    }

    try {
      // 2. SEND DEPOSIT
      // get previously created bet
      const createdBet = await getBet(web3, betAddress);
      console.log(createdBet);

      // send deposit
      await makeBet(web3, account, betAddress, createdBet.deposit, 'bettor');
    } catch (e) {
      alert(e.message);
      setIsLoading(false);
      return;
    }

    try {
      // 3. SEND EMAIL
      // opponent
      await sendEmail(bet.opponentEmail, betAddress, 'counter-bettor', null);

      // judge
      await sendEmail(bet.judgeEmail, betAddress, 'judge', 'bettor-judge');
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
      {!isSuccess ? (
        <InitiateBetForm setBet={setBet} bet={bet} onSubmit={initiateBet} isLoading={isLoading} />
      ) : (
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

(InitiateBet as PageWithLayout).Layout = MainLayout;

export default InitiateBet;
