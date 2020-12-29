import { FC } from 'react';

import styles from '../../styles/modules/StepList.module.scss';
import { Step } from './Step';

interface StepListProps {
  steps: Step[];
}

interface Step {
  id: string;
  text: string;
}

export const StepList: FC<StepListProps> = ({ steps }) => {
  return (
    <ul>
      {steps.map((step: Step, index: number) => (
        <li className={styles.listItem} key={step.id}>
          <Step number={index + 1} text={step.text} />
        </li>
      ))}
    </ul>
  );
};
