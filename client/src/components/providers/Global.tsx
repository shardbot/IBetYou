import React, { createContext, Dispatch, useReducer } from 'react';

import { globalReducer } from '../../reducers/globalReducer';
import { GlobalState, GlobalStateActions } from '../../types';
import Notification from '../global/Notification';

const initialState: GlobalState = {
  notification: {
    isActive: false,
    content: '',
    type: 'default'
  }
};

export const GlobalStateContext = createContext<{
  state: GlobalState;
  dispatch: Dispatch<GlobalStateActions>;
}>(undefined);

export const GlobalProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {state.notification.isActive && <Notification />}
      {children}
    </GlobalStateContext.Provider>
  );
};
