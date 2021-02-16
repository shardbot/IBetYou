import { Dispatch, FC, SetStateAction, SyntheticEvent } from 'react';

import { Input } from '../../global';
import { Header } from '../common';
import { ActionGroup } from '../common/ActionGroup';

interface StakeFormProps {
  setStep: Dispatch<SetStateAction<number>>;
  step: number;
}

export const StakeForm: FC<StakeFormProps> = ({ setStep, step }) => {
  const handleContinue = (e: SyntheticEvent) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handleBack = (e: SyntheticEvent) => {
    e.preventDefault();
    setStep(step - 1);
  };

  return (
    <form>
      <Header
        title="What is the stake of this bet?"
        subText="Please fill in the stake of the bet"
        className="mb-12 sm:mb-24"
      />

      <div className="mb-12 sm:mb-24">
        <Input name="stake" label="Enter amount" type="number" placeholder="Amount" />
      </div>

      <div className="flex justify-end">
        <ActionGroup handleBack={handleBack} handleContinue={handleContinue} />
      </div>
    </form>
  );
};
