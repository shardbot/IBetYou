import { useRouter } from 'next/router';
import { FC } from 'react';

import { EMPTY_IMG_SRC } from '../../constants';
import { Button } from './Button';

interface ErrorProps {
  message: string;
}

export const Error: FC<ErrorProps> = ({ message }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/');
  };

  return (
    <div className="flex flex-col text-center items-center">
      <img src={EMPTY_IMG_SRC} alt="success" className="w-80 h-80 xl:w-96 h-96" />
      <h1 className="my-8 font-bold text-xl sm:text-2xl">{message}</h1>
      <Button className="btn-primary text-sm sm:text-base sm:max-w-max px-6" onClick={handleClick}>
        Home
      </Button>
    </div>
  );
};
