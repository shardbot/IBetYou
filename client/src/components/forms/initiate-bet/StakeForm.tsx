import { FC, SyntheticEvent, useState } from 'react';

import { Input } from '../../global';
import { Header } from '../common';
import { ActionGroup } from '../common/ActionGroup';
import { FormProps } from '../index';
import { handleOnChange } from './FormSteps';
import { validation } from '../../../utils';

export const StakeForm: FC<FormProps> = ({ setStep, step, bet, setBet }) => {
  const [error, setError] = useState<string | null>(null);

  const handleContinue = (e: SyntheticEvent) => {
    e.preventDefault();

    const { deposit } = bet;
    if (validation.isEmpty(deposit) || !validation.isNumber(+deposit)) {
      setError(validation.messages.stake);
      return;
    }

    setError(null);
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
        <Input
          name="deposit"
          label="Enter amount"
          type="number"
          placeholder="Amount"
          value={bet.deposit}
          onChange={(e) => {
            handleOnChange(e, setBet);
          }}
          validation={error}
        />
      </div>

      <div className="flex justify-end">
        <ActionGroup handleBack={handleBack} handleContinue={handleContinue} />
      </div>
    </form>
  );
};
