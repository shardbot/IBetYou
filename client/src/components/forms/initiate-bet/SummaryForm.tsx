import { FC, SyntheticEvent, useState } from 'react';

import { useAuth, useNotification, useWeb3 } from '../../../hooks';
import { bet as makeBet, createBet, getBet, getRevertMessage } from '../../../services/contract';
import { sendEmail } from '../../../services/mail';
import { Input } from '../../global';
import { Header } from '../common';
import { ActionGroup } from '../common/ActionGroup';
import { FormProps } from '../index';

export const SummaryForm: FC<FormProps> = ({ setStep, step, bet }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { getAccount, readyToTransact } = useAuth();
  const { web3 } = useWeb3();
  const { showNotification, hideNotification } = useNotification();

  const handleSubmit = async (e: SyntheticEvent) => {
    hideNotification();
    e.preventDefault();
    setIsLoading(true);

    // get account information
    const account = getAccount();
    // address given from created bet
    let betAddress = null;

    // check if wallet is ready to transact - proper network must be selected
    const isReadyToTransact = await readyToTransact();
    if (isReadyToTransact) {
      // Try to create bet if wallet is ready
      try {
        showNotification('Please wait until bet is created so you can deposit specified amount');
        const response = await createBet(web3, account.address, {
          expirationDate: bet.expirationDate,
          description: bet.description,
          deposit: bet.deposit
        });
        // get address of created bet
        betAddress = response.events.BetDeployed.returnValues[0];
      } catch (e) {
        getRevertMessage(web3, e).then((message) => {
          showNotification(message, 'error');
        });
        setIsLoading(false);
        return;
      }

      try {
        hideNotification();
        showNotification(
          'Please wait until transaction is completed and mail is sent to the appointed judge.'
        );

        // 2. SEND DEPOSIT
        // get previously created bet
        const createdBet = await getBet(web3, betAddress);

        // send deposit
        await makeBet(web3, account.address, betAddress, createdBet.deposit, 'bettor');
      } catch (e) {
        getRevertMessage(web3, e).then((message) => {
          showNotification(message, 'error');
        });
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
        showNotification('Oops! Mails could not be delivered!', 'error');
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      hideNotification();

      setStep(step + 1);
    } else return;
  };

  const handleBack = (e: SyntheticEvent) => {
    e.preventDefault();
    setStep(step - 1);
  };

  return (
    <form>
      <Header title="Confirm bet" subText="Please review the summary and confirm the bet. " />

      <h1 className="text-center my-16 font-bold text-2xl">Summary</h1>

      <div className="mb-12 sm:mb-24">
        <Input
          name="opponentEmail"
          label="Email of the opponent"
          type="text"
          value={bet.opponentEmail}
          disabled
          readOnly={true}
          classes="mb-4"
        />
        <Input
          name="description"
          label="Bet description"
          type="textarea"
          value={bet.description}
          disabled
          readOnly={true}
          classes="mb-4 h-32"
        />
        <Input
          name="email"
          label="Email of the appointed judge"
          type="text"
          value={bet.judgeEmail}
          readOnly={true}
          disabled
          classes="mb-4"
        />
        {bet.expirationDate && (
          <Input
            name="expirationDate"
            label="Date of expiry"
            type="text"
            value={bet.expirationDate}
            readOnly={true}
            disabled
          />
        )}
      </div>

      <div className="mb-12 sm:mb-24 text-center">
        <span className="mr-4 font-bold text-slate-gray text-sm">Stake of the bet</span>
        <span className="font-bold text-5xl">{bet.deposit} MATIC</span>
      </div>
      <div className="mb-8 text-center">
        <p className="text-slate-gray">
          By accepting this bet you confirm that you understand that this bet will lock $ for a
          specified amount of time and the amount will be transferred to the specified address This
          is done using a smart contracts and is irreversible.
        </p>
      </div>

      <div className="flex justify-end">
        <ActionGroup
          handleBack={handleBack}
          handleContinue={handleSubmit}
          isSubmit={true}
          isLoading={isLoading}
        />
      </div>
    </form>
  );
};
