export type AuthAction =
  | { type: 'SET_WALLET'; payload }
  | { type: 'LOG_IN'; payload }
  | { type: 'LOG_OUT'; payload };

export interface AuthState {
  isConnected: boolean;
  wallet: any;
}

export const AuthReducer = (state: AuthState, action: AuthAction) => {
  const { type } = action;

  switch (type) {
    case 'SET_WALLET':
      console.log(action.payload);
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
