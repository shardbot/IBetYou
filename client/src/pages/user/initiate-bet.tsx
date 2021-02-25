import { FC, useReducer, useState } from 'react';

import CalendarIcon from '../../assets/icons/calendar.svg';
import UserIcon from '../../assets/icons/dollar-sign.svg';
import EyeIcon from '../../assets/icons/eye.svg';
import MailIcon from '../../assets/icons/mail.svg';
import TypeIcon from '../../assets/icons/type.svg';
import DollarSignIcon from '../../assets/icons/user.svg';
import { FormSteps } from '../../components/forms/initiate-bet';
import { SecondaryLayout } from '../../components/layouts';
import { StepsOverviewContainer } from '../../components/steps';
import { BetReducer, DefaultBetState } from '../../reducers/betReducer';
import { PageWithLayout } from '../../types';

const steps = [
  {
    id: 1,
    number: 1,
    title: 'Opponent email',
    icon: <MailIcon />
  },
  {
    id: 2,
    number: 2,
    title: 'Bet description',
    icon: <TypeIcon />
  },
  {
    id: 3,
    number: 3,
    title: 'Appoint judge',
    icon: <UserIcon />
  },
  {
    id: 4,
    number: 4,
    title: 'Stake of the bet',
    icon: <DollarSignIcon />
  },
  {
    id: 5,
    number: 5,
    title: 'Expiration date',
    icon: <CalendarIcon />
  },
  {
    id: 6,
    number: 6,
    title: 'Summary',
    icon: <EyeIcon />
  }
];

const InitiateBet: FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bet, setBet] = useReducer(BetReducer, DefaultBetState);
  const formSteps = FormSteps(setCurrentStep, currentStep, bet, setBet);

  return (
    <div className="px-6">
      <div className="max-w-xl mx-auto flex flex-col mb-24">
        {/* OVERVIEW */}
        {currentStep <= steps.length && (
          <StepsOverviewContainer steps={steps} currentStep={currentStep} />
        )}
        {/* FORM */}
        {formSteps[currentStep - 1].content}
      </div>
    </div>
  );
};

(InitiateBet as PageWithLayout).Layout = SecondaryLayout;

export default InitiateBet;
