import { FC, SyntheticEvent, useState } from 'react';

import { Input } from '../../global';
import { Header } from '../common';
import { ActionGroup } from '../common/ActionGroup';
import { FormProps } from '../index';
import { handleOnChange } from './FormSteps';
import { validation } from '../../../utils';

export const BetDescriptionForm: FC<FormProps> = ({ setStep, step, bet, setBet }) => {
  const [error, setError] = useState<string | null>(null);

  const handleContinue = (e: SyntheticEvent) => {
    e.preventDefault();

    const { description } = bet;
    if (validation.isEmpty(description)) {
      setError(validation.messages.description);
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
          onChange={(e) => handleOnChange(e, setBet)}
          value={bet.description}
          validation={error}
        />
      </div>

      <div className="flex justify-end">
        <ActionGroup handleBack={handleBack} handleContinue={handleContinue} />
      </div>
    </form>
  );
};
