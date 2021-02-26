import classNames from 'classnames';
import { FC } from 'react';

interface LoaderProps {
  classes?: string;
}

export const Loader: FC<LoaderProps> = ({ classes }) => {
  return (
    <div
      className={classNames(`border-4 border-green-cyan rounded-full loader`, {
        [classes]: !!classes
      })}
    />
  );
};
