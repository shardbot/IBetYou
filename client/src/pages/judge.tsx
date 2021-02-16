import { FC, useState } from 'react';

import EyeIcon from '../assets/icons/eye.svg';
import { FormSteps } from '../components/forms/judge-accept';
import { SecondaryLayout } from '../components/layouts';
import { StepsOverviewContainer } from '../components/steps';
import { PageWithLayout } from '../types';

const steps = [
  {
    id: 1,
    number: 1,
    title: 'Summary',
    icon: <EyeIcon />
  }
];

const Judge: FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const formSteps = FormSteps(setCurrentStep, currentStep);

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

(Judge as PageWithLayout).Layout = SecondaryLayout;

export default Judge;
