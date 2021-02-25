import { useRouter } from 'next/router';
import { FC, SyntheticEvent, useContext, useState } from 'react';

import { useAuth } from '../../../hooks/useAuth';
import { Web3Context } from '../../../pages/_app';
import { bet as makeBet } from '../../../services/contract';
import { convertWeiToEth } from '../../../utils';
import { Input } from '../../global';
import { ErrorAlert, Header } from '../common';
import { ActionGroup } from '../common/ActionGroup';
import { FormProps } from '../index';
import { sendEmail } from '../../../services/mail';

export const SummaryForm: FC<FormProps> = ({ setStep, step, bet }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>(null);
  const web3 = useContext(Web3Context);
  const { connectWallet, getAccount, readyToTransact } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const { address } = router.query;
    setIsLoading(true);

    let account = null;

    // connect wallet
    const wallet = await connectWallet();
    if (!wallet) {
      setError('Please connect wallet!');
      setIsLoading(false);
      return;
    }

    // check if wallet is ready to transact
    const isReadyToTransact = await readyToTransact();
    console.log(isReadyToTransact);
    // console.log(await readyToTransact());
    if (isReadyToTransact) {
      account = getAccount();
      console.log(account);

      try {
        // accept bet as counter bettor
        await makeBet(web3, account.address, address, bet.deposit, 'counter-bettor');
      } catch (e) {
        setError('Oops! Something went wrong! Please try again.');
        setIsLoading(false);
        return;
      }
    }

    try {
      // send mail to judge
      await sendEmail(bet.judgeEmail, address, 'judge', 'counter-bettor-judge');
    } catch (e) {
      alert(e.message);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setError(null);
    setStep(step + 1);
  };

  const handleBack = (e: SyntheticEvent) => {
    e.preventDefault();
    setStep(step - 1);
  };

  return (
    <form>
      <Header title="Accept bet" subText="Please review the summary and accept the bet." />

      <h1 className="text-center my-16 font-bold text-2xl">Summary</h1>

      <div className="mb-12 sm:mb-24">
        <Input
          name="description"
          label="Bet description"
          type="textarea"
          value={bet.description}
          readOnly={true}
          disabled
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
        <span className="font-bold text-5xl">{convertWeiToEth(web3, bet.deposit)} ETH</span>
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

      {error && <ErrorAlert message={error} />}
    </form>
  );
};
