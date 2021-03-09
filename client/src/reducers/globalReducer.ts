import { GlobalState, GlobalStateActions } from '../types';

export const globalReducer = (state: GlobalState, action: GlobalStateActions) => {
  const { type } = action;

  switch (type) {
    case 'SHOW_NOTIFICATION':
      return {
        ...state,
        notification: {
          isActive: true,
          content: action.payload.content,
          type: action.payload.type || 'default'
        }
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notification: {
          isActive: false,
          content: '',
          type: ''
        }
      };
    case 'SHOW_MODAL':
      return {
        ...state,
        modal: {
          isVisible: true,
          content: action.payload.content
        }
      };
    case 'HIDE_MODAL':
      return {
        ...state,
        modal: {
          isVisible: false,
          content: null
        }
      };
    default:
      return state;
  }
};
