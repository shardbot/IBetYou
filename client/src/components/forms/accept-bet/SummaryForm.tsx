import { FC, SyntheticEvent } from 'react';

import { Input } from '../../global';
import { Header } from '../common';
import { ActionGroup } from '../common/ActionGroup';
import { FormProps } from '../index';

export const SummaryForm: FC<FormProps> = ({ setStep, step, bet }) => {
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
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
        <span className="font-bold text-5xl">{bet.stake} ETH</span>
      </div>
      <div className="mb-8 text-center">
        <p className="text-slate-gray">
          Disclaimer text. Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the standard dummy text ever since the 1500s, when an
          unknown printer took a galley of type and scrambled it to make a type specimen book.
        </p>
      </div>

      <div className="flex justify-end">
        <ActionGroup handleBack={handleBack} handleContinue={handleSubmit} isSubmit={true} />
      </div>
    </form>
  );
};
