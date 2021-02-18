import { ChangeEvent, Dispatch, SetStateAction } from 'react';

import { BetAction } from '../../../reducers/betReducer';
import { Bet } from '../../../types';
import { Success } from '../common/Success';
import { BetDescriptionForm } from './BetDescriptionForm';
import { ExpirationDateForm } from './ExpirationDateForm';
import { JudgeEmailForm } from './JudgeEmailForm';
import { OpponentEmailForm } from './OpponentEmailForm';
import { StakeForm } from './StakeForm';
import { SummaryForm } from './SummaryForm';

export const handleOnChange = (
  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setBet: Dispatch<BetAction>
) => {
  const { value, name } = e.target;

  setBet({
    type: 'UPDATE_BET',
    payload: { [name]: value }
  });
};

export const FormSteps = (
  setStep: Dispatch<SetStateAction<number>>,
  step: number,
  bet: Bet,
  setBet: Dispatch<BetAction>
) => [
  {
    content: <OpponentEmailForm setStep={setStep} step={step} bet={bet} setBet={setBet} />
  },
  {
    content: <BetDescriptionForm setStep={setStep} step={step} bet={bet} setBet={setBet} />
  },
  {
    content: <JudgeEmailForm setStep={setStep} step={step} bet={bet} setBet={setBet} />
  },
  {
    content: <StakeForm setStep={setStep} step={step} bet={bet} setBet={setBet} />
  },
  {
    content: <ExpirationDateForm setStep={setStep} step={step} bet={bet} setBet={setBet} />
  },
  {
    content: <SummaryForm setStep={setStep} step={step} bet={bet} />
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
