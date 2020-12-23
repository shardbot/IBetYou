import { ChangeEvent, Dispatch, FC, SetStateAction, SyntheticEvent } from 'react';

import { ContractBet } from '../../pages/accept-bet';
import styles from '../../styles/modules/AcceptBetForm.module.scss';
import btnStyles from '../../styles/modules/Button.module.scss';
import { convertWeiToEth } from '../../utils';
import { Button, Input, Loader } from '../global';

interface AcceptBetFormProps {
  bet: ContractBet;
  web3: Web3;
  setJudgeEmail: Dispatch<SetStateAction<any>>;
  onSubmit?: (e: SyntheticEvent) => void;
  isLoading?: boolean;
}

export const AcceptBetForm: FC<AcceptBetFormProps> = ({
  bet,
  web3,
  onSubmit,
  setJudgeEmail,
  isLoading
}) => {
  const onEmailChangeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;

    setJudgeEmail(value);
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {/*<Input*/}
      {/*  name="betOwnerEmail"*/}
      {/*  label="I bet"*/}
      {/*  type="email"*/}
      {/*  placeholder="Opponent's email"*/}
      {/*  value="test"*/}
      {/*  disabled*/}
      {/*  required*/}
      {/*/>*/}
      <Input
        name="stakeOfTheBet"
        label="For"
        type="number"
        placeholder="X.XXX ETH"
        value={convertWeiToEth(web3, bet.deposit)}
        disabled
        required
      />
      <Input
        name="betText"
        label="that"
        type="textarea"
        placeholder="X is true"
        value={bet.description}
        disabled
      />
      <Input
        name="judgeEmail"
        label="The judge will be"
        type="email"
        placeholder="Judge's email"
        onChange={onEmailChangeHandler}
        disabled={isLoading}
        required>
        <span className={styles.inputDisclaimer}>
          and I agree to accept his decision without dispute
        </span>
      </Input>
      {isLoading ? (
        <div className={styles.loadingWrapper}>
          <Loader />
        </div>
      ) : (
        <Button type="submit" className={[btnStyles.button, btnStyles.buttonPrimary].join(' ')}>
          CONFIRM
        </Button>
      )}
    </form>
  );
};
