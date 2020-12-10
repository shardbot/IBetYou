import { ChangeEvent, Dispatch, FC, SetStateAction } from 'react';

import { InitialBet } from '../../pages/initiate-bet';
import btnStyles from '../../styles/modules/Button.module.scss';
import styles from '../../styles/modules/InitiateBetForm.module.scss';
import { Button, Input } from '../global';

interface InitiateBetFormProps {
  bet: InitialBet;
  setBet: Dispatch<SetStateAction<InitialBet>>;
}

export const InitiateBetForm: FC<InitiateBetFormProps> = ({ bet, setBet }) => {
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setBet({
      ...bet,
      [name]: value
    });
  };

  return (
    <form className={styles.form}>
      <Input
        name="ownerEmail"
        label="I bet"
        type="email"
        placeholder="Opponent's email"
        onChange={onChangeHandler}
        required
      />
      <Input
        name="description"
        label="that"
        type="textarea"
        placeholder="X is true"
        onChange={onChangeHandler}
        required
      />
      <Input
        name="judgeEmail"
        label="I appoint the following judge"
        type="email"
        placeholder="Judge's email"
        onChange={onChangeHandler}
        required
      />
      <Input
        name="deposit"
        label="The stake of the bet is (ETH)"
        type="number"
        placeholder="X.XXX ETH"
        onChange={onChangeHandler}
        required
      />
      <Input
        name="expirationTime"
        label="Date of expiry"
        type="date"
        onChange={onChangeHandler}
        required
      />
      <Button type="submit" className={[btnStyles.button, btnStyles.buttonPrimary].join(' ')}>
        INITIATE BET
      </Button>
    </form>
  );
};
