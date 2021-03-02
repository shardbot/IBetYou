import React, { createContext, Dispatch, useReducer } from 'react';

import { authReducer } from '../../reducers/authReducer';
import { AuthActions, AuthState } from '../../types';

const initialState: AuthState = {
  isConnected: false,
  wallet: null
};

export const AuthContext = createContext<{
  state: AuthState;
  dispatch: Dispatch<AuthActions>;
}>(null);

export const AuthProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
};
