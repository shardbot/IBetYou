import { useContext } from 'react';

import { GlobalStateContext } from '../components/providers/Global';

export const useNotification = () => {
  const { state, dispatch } = useContext(GlobalStateContext);

  const getState = () => {
    return state.notification;
  };

  const showNotification = (text: string, type = 'default') => {
    dispatch({
      type: 'SHOW_NOTIFICATION',
      payload: {
        content: text,
        type
      }
    });
  };

  const hideNotification = () => {
    dispatch({
      type: 'REMOVE_NOTIFICATION',
      payload: null
    });
  };

  return {
    getState,
    showNotification,
    hideNotification
  };
};
