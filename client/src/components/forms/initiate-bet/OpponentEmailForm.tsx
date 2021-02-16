import { Dispatch, FC, SetStateAction, SyntheticEvent } from 'react';

import { Button, Input } from '../../global';
import { Header } from '../common';
import { ActionGroup } from '../common/ActionGroup';

interface OpponentEmailFormProps {
  setStep: Dispatch<SetStateAction<number>>;
  step: number;
}

export const OpponentEmailForm: FC<OpponentEmailFormProps> = ({ setStep, step }) => {
  const handleContinue = (e: SyntheticEvent) => {
    e.preventDefault();
    setStep(step + 1);
  };

  return (
    <form>
      <Header
        title="Let’s start with your opponent email"
        subText="Please fill in the details below so that we can send the invitation to your opponent."
        className="mb-12 sm:mb-24"
      />

      <div className="mb-12 sm:mb-24">
        <Input
          name="opponentEmail"
          label="Enter your opponent email"
          type="text"
          placeholder="Email"
        />
      </div>

      <div className="flex justify-end">
        <ActionGroup handleContinue={handleContinue} />
      </div>
    </form>
  );
};
