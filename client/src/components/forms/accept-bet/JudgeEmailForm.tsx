import { Dispatch, FC, SetStateAction, SyntheticEvent } from 'react';

import { Input } from '../../global';
import { Header } from '../common';
import { ActionGroup } from '../common/ActionGroup';

interface JudgeEmailFormProps {
  setStep: Dispatch<SetStateAction<number>>;
  step: number;
}

export const JudgeEmailForm: FC<JudgeEmailFormProps> = ({ step, setStep }) => {
  const handleContinue = (e: SyntheticEvent) => {
    e.preventDefault();
    setStep(step + 1);
  };

  return (
    <form>
      <Header
        title="Appoint judge"
        subText="Please fill in the details below so that we can send the invitation to appointed judge."
        className="mb-12 sm:mb-24"
      />

      <div className="mb-12 sm:mb-24">
        <Input name="judgeEmail" label="Enter your judge email" type="text" placeholder="Email" />
      </div>

      <div className="flex justify-end">
        <ActionGroup handleContinue={handleContinue} />
      </div>
    </form>
  );
};
