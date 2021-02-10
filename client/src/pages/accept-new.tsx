import { FC, useState } from 'react';

import EyeIcon from '../assets/icons/eye.svg';
import UserIcon from '../assets/icons/user.svg';
import { FormSteps } from '../components/forms/accept-bet';
import { SecondaryLayout } from '../components/layouts';
import { StepsOverviewContainer } from '../components/steps';
import { PageWithLayout } from '../types';

const steps = [
  {
    id: 1,
    number: 1,
    title: 'Appoint judge',
    icon: <UserIcon />
  },
  {
    id: 2,
    number: 2,
    title: 'Summary',
    icon: <EyeIcon />
  }
];

const AcceptBetNew: FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const formSteps = FormSteps(setCurrentStep, currentStep);

  return (
    <div className="px-12 xs:px-8">
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

(AcceptBetNew as PageWithLayout).Layout = SecondaryLayout;

export default AcceptBetNew;
