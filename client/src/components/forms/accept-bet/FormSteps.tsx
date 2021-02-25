import { Dispatch, SetStateAction } from 'react';

import { BetAction } from '../../../reducers/betReducer';
import { Bet } from '../../../types';
import { Success } from '../common/Success';
import { JudgeEmailForm } from './JudgeEmailForm';
import { SummaryForm } from './SummaryForm';

export const FormSteps = (
  setStep: Dispatch<SetStateAction<number>>,
  step: number,
  bet: Bet,
  setBet: Dispatch<BetAction>
) => [
  {
    content: <JudgeEmailForm setStep={setStep} step={step} bet={bet} setBet={setBet} />
  },
  {
    content: <SummaryForm setStep={setStep} step={step} bet={bet} />
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
