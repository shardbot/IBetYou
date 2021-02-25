import { Dispatch, SetStateAction } from 'react';

import { Bet } from '../../../types';
import { Success } from '../common/Success';
import { SummaryForm } from './SummaryForm';

export const FormSteps = (setStep: Dispatch<SetStateAction<number>>, step: number, bet: Bet) => [
  {
    content: <SummaryForm setStep={setStep} step={step} bet={bet} />
  },
  {
    content: (
      <Success
        message="You successfully accepted to be a judge for this bet!"
        secondMessage="Good Luck!"
        buttonLabel="Go to Dashboard"
        to="/user/dashboard"
      />
    )
  }
];
