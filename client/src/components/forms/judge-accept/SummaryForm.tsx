import { useRouter } from 'next/router';
import { FC, SyntheticEvent, useContext, useState } from 'react';

import { useAuth } from '../../../hooks/useAuth';
import { Web3Context } from '../../../pages/_app';
import { addJudge } from '../../../services/contract';
import { convertWeiToEth } from '../../../utils';
import { Input } from '../../global';
import { ErrorAlert, Header } from '../common';
import { ActionGroup } from '../common/ActionGroup';
import { FormProps } from '../index';

export const SummaryForm: FC<FormProps> = ({ setStep, step, bet }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>(null);
  const web3 = useContext(Web3Context);
  const { connectWallet, getAccount, readyToTransact } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const { address, type } = router.query;
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

    if (isReadyToTransact) {
      account = getAccount();
      console.log(account);

      try {
        // add judge
        await addJudge(web3, type, address, account);
      } catch (e) {
        setError('Oops! Something went wrong! Please try again.');
        setIsLoading(false);
        return;
      }
    }

    setIsLoading(false);
    setError(null);
    setStep(step + 1);
  };

  return (
    <form>
      <Header
        title="Accept to be a judge"
        subText="Please review the summary and accept to be a judge for this bet."
      />

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
          Disclaimer text. Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the standard dummy text ever since the 1500s, when an
          unknown printer took a galley of type and scrambled it to make a type specimen book.
        </p>
      </div>

      <div className="flex justify-end">
        <ActionGroup handleContinue={handleSubmit} isSubmit={true} isLoading={isLoading} />
      </div>

      {error && <ErrorAlert message={error} />}
    </form>
  );
};
