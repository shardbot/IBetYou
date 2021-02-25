import { FC } from 'react';

import { GAME_DAY_IMG_SRC } from '../../../constants';
import { Button, LinkButton } from '../../global';
import { useAuth } from '../../../hooks/useAuth';

interface SuccessProps {
  message: string;
  secondMessage: string;
  to?: string;
  buttonLabel?: string;
}

export const Success: FC<SuccessProps> = ({ message, secondMessage, to, buttonLabel }) => {
  const { redirectToDashboard } = useAuth();
  const handleClick = () => {
    redirectToDashboard();
  };

  return (
    <div className="flex flex-col text-center items-center">
      <img src={GAME_DAY_IMG_SRC} alt="success" />
      <h1 className="my-8 font-bold text-xl sm:text-2xl">{message}</h1>
      <h3 className="mb-8 font-bold text-xl sm:text-2xl">{secondMessage}</h3>
      <Button className="btn-primary text-sm sm:text-base sm:max-w-max" onClick={handleClick}>
        Go to Dashboard
      </Button>
    </div>
  );
};
