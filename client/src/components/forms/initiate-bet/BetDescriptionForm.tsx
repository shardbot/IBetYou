import { Dispatch, FC, SetStateAction, SyntheticEvent } from 'react';

import { Input } from '../../global';
import { Header } from '../common';
import { ActionGroup } from '../common/ActionGroup';

interface BetDescriptionFormProps {
  setStep: Dispatch<SetStateAction<number>>;
  step: number;
}

export const BetDescriptionForm: FC<BetDescriptionFormProps> = ({ setStep, step }) => {
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
        title="Add bet description"
        subText="Please fill in the bet description"
        className="mb-12 sm:mb-24"
      />

      <div className="mb-12 sm:mb-24">
        <Input
          name="description"
          label="Enter bet description"
          type="textarea"
          placeholder="Description"
          classes="h-32"
        />
      </div>

      <div className="flex justify-end">
        <ActionGroup handleBack={handleBack} handleContinue={handleContinue} />
      </div>
    </form>
  );
};
