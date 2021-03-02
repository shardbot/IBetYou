import { useContext } from 'react';

import { GlobalStateContext } from '../components/providers/Global';

export const useNotification = () => {
  const { state, dispatch } = useContext(GlobalStateContext);

  const getState = () => {
    return state.notification;
  };

  const showNotification = (text: string) => {
    dispatch({
      type: 'SHOW_NOTIFICATION',
      payload: {
        text: text
      }
    });
  };

  const hideNotification = () => {
    dispatch({
      type: 'REMOVE_NOTIFICATION'
    });
  };

  return {
    getState,
    showNotification,
    hideNotification
  };
};
