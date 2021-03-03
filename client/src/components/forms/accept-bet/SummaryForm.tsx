import { useRouter } from 'next/router';
import { FC, SyntheticEvent, useState } from 'react';

import { useAuth, useNotification, useWeb3 } from '../../../hooks';
import { bet as makeBet, getRevertMessage } from '../../../services/contract';
import { sendEmail } from '../../../services/mail';
import { convertWeiToEth } from '../../../utils';
import { Input } from '../../global';
import { Header } from '../common';
import { ActionGroup } from '../common/ActionGroup';
import { FormProps } from '../index';

export const SummaryForm: FC<FormProps> = ({ setStep, step, bet }) => {
  const { web3 } = useWeb3();
  const { connectWallet, getAccount, readyToTransact } = useAuth();
  const { showNotification, hideNotification } = useNotification();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: SyntheticEvent) => {
    hideNotification();
    e.preventDefault();
    setIsLoading(true);

    const { address } = router.query;
    let account = null;

    // connect wallet
    const wallet = await connectWallet();
    if (!wallet) {
      showNotification('Please connect your wallet!', 'error');
      setIsLoading(false);
      return;
    }

    // check if wallet is ready to transact
    const isReadyToTransact = await readyToTransact();
    if (isReadyToTransact) {
      account = getAccount();

      try {
        showNotification(
          'Please wait until transaction is completed and mail is sent to the appointed judge.'
        );
        // accept bet as counter bettor
        await makeBet(web3, account.address, address, bet.deposit, 'counter-bettor');
      } catch (e) {
        getRevertMessage(web3, e).then((message) => {
          showNotification(message, 'error');
        });
        setIsLoading(false);
        return;
      }

      try {
        // send mail to judge
        await sendEmail(bet.judgeEmail, address, 'judge', 'counter-bettor-judge');
      } catch (e) {
        console.log(e);
        showNotification('Oops! Mail could not be delivered to the appointed judge!', 'error');
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
    </form>
  );
};
