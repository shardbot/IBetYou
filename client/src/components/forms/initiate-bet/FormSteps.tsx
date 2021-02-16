import { Dispatch, SetStateAction } from 'react';

import { Success } from '../common/Success';
import { BetDescriptionForm } from './BetDescriptionForm';
import { ExpirationDateForm } from './ExpirationDateForm';
import { JudgeEmailForm } from './JudgeEmailForm';
import { OpponentEmailForm } from './OpponentEmailForm';
import { StakeForm } from './StakeForm';
import { SummaryForm } from './SummaryForm';

export const FormSteps = (setStep: Dispatch<SetStateAction<number>>, step: number) => [
  {
    content: <OpponentEmailForm setStep={setStep} step={step} />
  },
  {
    content: <BetDescriptionForm setStep={setStep} step={step} />
  },
  {
    content: <JudgeEmailForm setStep={setStep} step={step} />
  },
  {
    content: <StakeForm setStep={setStep} step={step} />
  },
  {
    content: <ExpirationDateForm setStep={setStep} step={step} />
  },
  {
    content: <SummaryForm setStep={setStep} step={step} />
  },
  {
    content: (
      <Success
        message="Your bet has been successfully placed!"
        secondMessage="Good Luck!"
        buttonLabel="Go to Dashboard"
        to="/user/dashboard"
      />
    )
  }
];
