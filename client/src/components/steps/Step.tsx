import { FC } from 'react';

import styles from '../../styles/modules/Step.module.scss';

interface StepProps {
  number: string | number;
  text: string;
}

export const Step: FC<StepProps> = ({ number, text }) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.number}>{number}</span>
      <p className={styles.text}>{text}</p>
    </div>
  );
};
