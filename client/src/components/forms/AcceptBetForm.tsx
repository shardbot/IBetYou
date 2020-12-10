import { FC } from 'react';

import styles from '../../styles/modules/AcceptBetForm.module.scss';
import btnStyles from '../../styles/modules/Button.module.scss';
import { Button, Input } from '../global';

export const AcceptBetForm: FC = () => {
  return (
    <form className={styles.form}>
      <Input
        name="betOwnerEmail"
        label="I bet"
        type="email"
        placeholder="Opponent's email"
        value="test"
        disabled
        required
      />
      <Input
        name="stakeOfTheBet"
        label="For"
        type="number"
        placeholder="X.XXX ETH"
        value="0.00002"
        disabled
        required
      />
      <Input
        name="betText"
        label="that"
        type="textarea"
        placeholder="X is true"
        value="This is the description of the bet"
        disabled
      />
      <Input
        name="judgeEmail"
        label="The judge will be"
        type="email"
        placeholder="Judge's email"
        required>
        <span className={styles.inputDisclaimer}>
          and I agree to accept his decision without dispute
        </span>
      </Input>
      <Button type="submit" className={[btnStyles.button, btnStyles.buttonPrimary].join(' ')}>
        CONFIRM
      </Button>
    </form>
  );
};
