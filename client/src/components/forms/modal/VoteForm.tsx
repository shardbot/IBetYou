import { ChangeEvent, FC, SyntheticEvent, useState } from 'react';

import { useBet, useModal } from '../../../hooks';
import { Bet } from '../../../types';
import { Button } from '../../global';

type CheckBoxChoices = 'for-bettor' | 'for-counter-bettor';

interface VoteFormProps {
  bet: Bet;
  handleFetch: () => void;
}

export const VoteForm: FC<VoteFormProps> = ({ bet, handleFetch }) => {
  const [checkBox, setCheckBox] = useState<CheckBoxChoices>('for-bettor');
  const { isLoading, handleVote } = useBet(bet, handleFetch);
  const { hideModal } = useModal();

  const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
    setCheckBox(e.target.value as CheckBoxChoices);
  };

  const vote = async (e: SyntheticEvent) => {
    e.preventDefault();
    await handleVote(checkBox);
    hideModal();
  };

  return (
    <form className="flex flex-col w-full text-white">
      <h3 className="text-white font-bold">Vote for</h3>
      <p className="text-slate-gray">Please select person you are voting for</p>
      <div className="flex flex-col sm:flex-row w-full mx-auto sm:max-w-min">
        {/* FIRST CHOICE - NO*/}
        <div className="radio-box sm:mr-16 cursor-pointer">
          <input
            className="appearance-none"
            id="for-bettor"
            type="radio"
            value="for-bettor"
            name="for-bettor"
            checked={'for-bettor' === checkBox}
            onChange={handleCheck}
          />
          <label
            className="rounded-lg border text-center border-slate-gray hover:border-green-cyan mx-auto w-32 h-32 sm:w-48 sm:h-48 block font-bold flex items-center justify-center cursor-pointer"
            htmlFor="for-bettor">
            Bettor
          </label>
        </div>
        {/* FIRST CHOICE - YES*/}
        <div className="radio-box cursor-pointer">
          <input
            className="appearance-none"
            id="for-counter-bettor"
            type="radio"
            value="for-counter-bettor"
            name="for-counter-bettor"
            checked={'for-counter-bettor' === checkBox}
            onChange={handleCheck}
          />
          <label
            className="rounded-lg border border-slate-gray text-center hover:border-green-cyan mx-auto w-32 h-32 sm:w-48 sm:h-48 block font-bold flex items-center justify-center cursor-pointer"
            htmlFor="for-counter-bettor">
            Counter bettor
          </label>
        </div>
      </div>
      <Button
        className="btn-primary text-white mt-8 disabled:opacity-50"
        disabled={isLoading}
        onClick={vote}>
        {isLoading ? 'Please wait...' : 'Vote'}
      </Button>
    </form>
  );
};
