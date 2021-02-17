import { Bet } from '../types';

export const DefaultBetState: Bet = {
  opponentEmail: '',
  description: '',
  judgeEmail: '',
  stake: 0,
  expirationDate: ''
};

export type BetAction = { type: 'UPDATE_BET'; payload: Partial<Bet> };

export const BetReducer = (bet: Bet, action: BetAction) => {
  const { type } = action;

  switch (type) {
    case 'UPDATE_BET':
      return {
        ...bet,
        ...action.payload
      };
  }
};
