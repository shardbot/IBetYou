import { FC, SyntheticEvent, useState } from 'react';

import { validation } from '../../../utils';
import { Input } from '../../global';
import { Header } from '../common';
import { ActionGroup } from '../common/ActionGroup';
import { FormProps } from '../index';
import { handleOnChange } from './FormSteps';

export const JudgeEmailForm: FC<FormProps> = ({ step, setStep, bet, setBet }) => {
  const [error, setError] = useState<string | null>(null);

  const handleContinue = (e: SyntheticEvent) => {
    e.preventDefault();

    const { judgeEmail } = bet;
    if (validation.isEmpty(judgeEmail) || !validation.isEmail(judgeEmail)) {
      setError(validation.messages.email);
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
        title="Appoint judge"
        subText="Please fill in the details below so that we can send the invitation to appointed judge."
        className="mb-12 sm:mb-24"
      />

      <div className="mb-12 sm:mb-24">
        <Input
          name="judgeEmail"
          label="Enter your judge email"
          type="text"
          placeholder="Email"
          value={bet.judgeEmail}
          onChange={(e) => handleOnChange(e, setBet)}
          validation={error}
        />
      </div>

      <div className="flex justify-end">
        <ActionGroup handleBack={handleBack} handleContinue={handleContinue} />
      </div>
    </form>
  );
};
