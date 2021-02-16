import { Dispatch, FC, SetStateAction, SyntheticEvent } from 'react';

import { Input } from '../../global';
import { Header } from '../common';
import { ActionGroup } from '../common/ActionGroup';

interface SummaryFormProps {
  setStep: Dispatch<SetStateAction<number>>;
  step: number;
}

export const SummaryForm: FC<SummaryFormProps> = ({ setStep, step }) => {
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
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
          value="I bet you that bitcoin will be at 100,000 $ at the end of this bet"
          readOnly={true}
          classes="mb-4 h-32"
        />
        <Input
          name="expirationDate"
          label="Date of expiry"
          type="text"
          value="12/02/2021"
          readOnly={true}
          disabled
        />
      </div>

      <div className="mb-12 sm:mb-24 text-center">
        <span className="mr-4 font-bold text-slate-gray text-sm">Stake of the bet</span>
        <span className="font-bold text-5xl">1 ETH</span>
      </div>
      <div className="mb-8 text-center">
        <p className="text-slate-gray">
          Disclaimer text. Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the standard dummy text ever since the 1500s, when an
          unknown printer took a galley of type and scrambled it to make a type specimen book.
        </p>
      </div>

      <div className="flex justify-end">
        <ActionGroup handleContinue={handleSubmit} isSubmit={true} />
      </div>
    </form>
  );
};
