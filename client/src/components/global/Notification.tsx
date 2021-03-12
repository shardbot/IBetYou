import classNames from 'classnames';
import React from 'react';

import XIcon from '../../assets/icons/x.svg';
import { useAuth, useModal, useNotification } from '../../hooks';
import { Button } from './Button';

const styleMap = {
  default: 'bg-light-blue',
  warning: 'bg-yellow',
  success: 'bg-green-cyan',
  error: 'bg-light-red'
};

const Notification: React.FC = () => {
  const { getState, hideNotification } = useNotification();
  const { isLoggedIn } = useAuth();
  const { isVisible } = useModal();
  const { type, content } = getState();

  return (
    <div
      className={classNames(
        'flex w-3/4 lg:max-w-4xl z-40 shadow-lg opacity-95 p-5 fixed left-1/2 transform -translate-x-1/2 top-8 rounded-lg',
        styleMap[type],
        {
          'xl:ml-40': isLoggedIn() && !isVisible()
        }
      )}>
      <p className="text-white flex-1">{content}</p>
      <Button className="focus:outline-none" onClick={hideNotification}>
        <XIcon />
      </Button>
    </div>
  );
};

export default Notification;
