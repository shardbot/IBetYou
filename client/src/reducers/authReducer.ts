import { AuthActions, AuthState } from '../types';

export const authReducer = (state: AuthState, action: AuthActions) => {
  const { type } = action;

  switch (type) {
    case 'SET_WALLET':
      return {
        ...state,
        wallet: action.payload.wallet
      };
    case 'LOG_IN':
      return {
        ...state,
        isConnected: true
      };
    case 'LOG_OUT':
      return {
        ...state,
        isConnected: false
      };
    default:
      return state;
  }
};
