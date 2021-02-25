import { FC } from 'react';

import { StepsOverviewItem } from './StepsOverviewItem';

interface StepsOverviewContainerProps {
  steps: Array<{
    id: number;
    number: number;
    title: string;
    icon: JSX.Element;
  }>;
  currentStep: number;
}

export const StepsOverviewContainer: FC<StepsOverviewContainerProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex flex-col sm:flex-row rounded-md border border-slate-gray w-full p-6 justify-center mb-16">
      {steps.map((step) => (
        <div
          className="flex flex-col items-center xs:items-baseline sm:flex-row items-center"
          key={step.id}>
          <StepsOverviewItem
            key={step.id}
            isActive={step.id === currentStep}
            currentStep={currentStep}
            numberOfSteps={steps.length}
            stepInformation={step}
          />
          {step.id < steps.length && (
            <span className="hidden sm:block bg-slate-gray w-px h-4 sm:h-1/2 sm:mx-5" />
          )}
        </div>
      ))}
    </div>
  );
};
