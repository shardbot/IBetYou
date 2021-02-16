import { Dispatch, SetStateAction } from 'react';

import { Success } from '../common/Success';
import { JudgeEmailForm } from './JudgeEmailForm';
import { SummaryForm } from './SummaryForm';

export const FormSteps = (setStep: Dispatch<SetStateAction<number>>, step: number) => [
  {
    content: <JudgeEmailForm setStep={setStep} step={step} />
  },
  {
    content: <SummaryForm setStep={setStep} step={step} />
  },
  {
    content: (
      <Success
        message="You successfully accepted the bet!"
        secondMessage="Good Luck!"
        buttonLabel="Go to Dashboard"
        to="/user/dashboard"
      />
    )
  }
];
