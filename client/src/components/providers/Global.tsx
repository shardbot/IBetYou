import dynamic from 'next/dynamic';
import React, { createContext, Dispatch, useReducer } from 'react';

import { globalReducer } from '../../reducers/globalReducer';
import { GlobalState, GlobalStateActions } from '../../types';
import Notification from '../global/Notification';

const Modal = dynamic(() => import('../global/Modal'), { ssr: false });

const initialState: GlobalState = {
  notification: {
    isActive: false,
    content: '',
    type: 'default'
  },
  modal: {
    isVisible: false,
    content: null
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
      {state.modal.isVisible && <Modal />}
      {children}
    </GlobalStateContext.Provider>
  );
};
