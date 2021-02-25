import classNames from 'classnames';
import { FC } from 'react';

export const StepsOverviewItem: FC<{
  isActive: boolean;
  numberOfSteps: number;
  currentStep: number;
  stepInformation: {
    id: number;
    number: number;
    title: string;
    icon: JSX.Element;
  };
}> = ({ isActive, numberOfSteps, currentStep, stepInformation }) => {
  return (
    <div
      className={classNames('flex items-center', {
        'text-green-500': isActive,
        'hidden sm:flex': !isActive,
        'text-gray-400': !isActive && !(stepInformation.id < currentStep)
      })}>
      <div className={classNames('icon-wrapper fill-current flex items-center justify-center')}>
        {stepInformation.icon}
      </div>
      {isActive && (
        <div className="flex flex-col ml-4">
          <span
            className={classNames('text-sm min-w-max', {
              'text-green-500': isActive
            })}>
            Step {`${stepInformation.number}/${numberOfSteps}`}
          </span>
          <span className="text-white text-md font-bold">{stepInformation.title}</span>
        </div>
      )}
    </div>
  );
};
