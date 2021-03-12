import { ReactNode, useContext } from 'react';

import { GlobalStateContext } from '../components/providers/Global';

export const useModal = () => {
  const { state, dispatch } = useContext(GlobalStateContext);

  const showModal = (content: ReactNode) => {
    dispatch({
      type: 'SHOW_MODAL',
      payload: {
        content
      }
    });
  };

  const hideModal = () => {
    dispatch({
      type: 'HIDE_MODAL',
      payload: null
    });
  };

  const isVisible = () => state.modal.isVisible;

  const content = () => state.modal.content;

  return { showModal, hideModal, isVisible, content };
};
