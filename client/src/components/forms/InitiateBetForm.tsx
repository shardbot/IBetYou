import { ChangeEvent, Dispatch, FC, SetStateAction, SyntheticEvent } from 'react';

import { InitialBet } from '../../pages/initiate-bet';
import btnStyles from '../../styles/modules/Button.module.scss';
import styles from '../../styles/modules/InitiateBetForm.module.scss';
import { Button, Input, Loader } from '../global';

interface InitiateBetFormProps {
  bet: InitialBet;
  setBet: Dispatch<SetStateAction<InitialBet>>;
  onSubmit: (e: SyntheticEvent) => void;
  isLoading?: boolean;
}

export const InitiateBetForm: FC<InitiateBetFormProps> = ({ bet, setBet, onSubmit, isLoading }) => {
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setBet({
      ...bet,
      [name]: value
    });
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <Input
        name="opponentEmail"
        label="I bet"
        type="email"
        placeholder="Opponent's email"
        required
        disabled={isLoading}
        onChange={onChangeHandler}
      />
      <Input
        name="description"
        label="that"
        type="textarea"
        placeholder="X is true"
        required
        disabled={isLoading}
        onChange={onChangeHandler}
      />
      <Input
        name="judgeEmail"
        label="I appoint the following judge"
        type="email"
        placeholder="Judge's email"
        required
        disabled={isLoading}
        onChange={onChangeHandler}
      />
      <Input
        name="deposit"
        label="The stake of the bet is (ETH)"
        type="number"
        step=".000001"
        pattern="^\d*(\.\d{0,6})?$"
        placeholder="X.XXX ETH"
        required
        disabled={isLoading}
        onChange={onChangeHandler}
      />
      <Input
        name="expirationDate"
        label="Date of expiry"
        type="date"
        required
        disabled={isLoading}
        onChange={onChangeHandler}
      />
      {isLoading ? (
        <div className={styles.loadingWrapper}>
          <Loader />
        </div>
      ) : (
        <Button
          type="submit"
          className={[btnStyles.button, btnStyles.buttonPrimary].join(' ')}
          disabled={isLoading}>
          INITIATE BET
        </Button>
      )}
    </form>
  );
};
