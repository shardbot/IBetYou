import { FC } from 'react';

import { GAME_DAY_IMG_SRC } from '../../../constants';
import { LinkButton } from '../../global';

interface SuccessProps {
  message: string;
  secondMessage: string;
  buttonLabel: string;
  to: string;
}

export const Success: FC<SuccessProps> = ({ message, secondMessage, buttonLabel, to }) => {
  return (
    <div className="flex flex-col text-center items-center">
      <img src={GAME_DAY_IMG_SRC} alt="success" />
      <h1 className="my-8 font-bold text-xl sm:text-2xl">{message}</h1>
      <h3 className="mb-8 font-bold text-xl sm:text-2xl">{secondMessage}</h3>
      <LinkButton
        className="btn-primary text-sm sm:text-base sm:max-w-max"
        to={to}
        text={buttonLabel}
      />
    </div>
  );
};
