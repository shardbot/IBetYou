import { FC, SyntheticEvent, useState } from 'react';

import { validation } from '../../../utils';
import { Input } from '../../global';
import { Header } from '../common';
import { ActionGroup } from '../common/ActionGroup';
import { FormProps } from '../index';
import { handleOnChange } from './FormSteps';

export const OpponentEmailForm: FC<FormProps> = ({ setStep, step, bet, setBet }) => {
  const [error, setError] = useState<string | null>(null);

  const handleContinue = (e: SyntheticEvent) => {
    e.preventDefault();

    const { opponentEmail } = bet;
    if (validation.isEmpty(opponentEmail) || !validation.isEmail(opponentEmail)) {
      setError(validation.messages.email);
      return;
    }

    setError(null);
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
          onChange={(e) => handleOnChange(e, setBet)}
          value={bet.opponentEmail}
          validation={error}
        />
      </div>

      <div className="flex justify-end">
        <ActionGroup handleContinue={handleContinue} />
      </div>
    </form>
  );
};
