import { Dispatch, SetStateAction } from 'react';

import { BetAction } from '../../reducers/betReducer';
import { Bet } from '../../types';

export interface FormProps {
  setStep: Dispatch<SetStateAction<number>>;
  step: number;
  bet: Bet;
  setBet?: Dispatch<BetAction>;
}
