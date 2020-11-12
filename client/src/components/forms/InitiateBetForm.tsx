import { FC } from 'react';

import btnStyles from '../../styles/modules/Button.module.scss';
import styles from '../../styles/modules/InitiateBetForm.module.scss';
import { Button, Input } from '../global';

export const InitiateBetForm: FC = () => {
  return (
    <form className={styles.form}>
      <Input
        name="betOwnerEmail"
        label="I bet"
        type="email"
        placeholder="Opponent's email"
        required
      />
      <Input name="betText" label="that" type="textarea" placeholder="X is true" />
      <Input
        name="judgeEmail"
        label="I appoint the following judge"
        type="email"
        placeholder="Judge's email"
        required
      />
      <Input
        name="stakeOfTheBet"
        label="The stake of the bet is (ETH)"
        type="number"
        placeholder="X.XXX ETH"
        required
      />
      <Input name="dateOfBetExpiry" label="Date of expiry" type="date" required />
      <Button type="submit" className={[btnStyles.button, btnStyles.buttonPrimary].join(' ')}>
        INITIATE BET
      </Button>
    </form>
  );
};
