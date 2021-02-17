import { FC, HTMLAttributes } from 'react';

import { Badge } from './Badge';

interface StatusBadgeProps extends HTMLAttributes<HTMLDivElement> {
  type: 'active' | 'pending' | 'finished';
  classes?: string;
}

const styles = {
  active: 'bg-green-cyan text-green-cyan',
  finished: 'bg-green-cyan text-green-cyan'
};

export const StatusBadge: FC<StatusBadgeProps> = ({ type }) => {
  return (
    <Badge
      label={type}
      classes={`px-4 py-0.5 font-bold text-sm bg-opacity-10 capitalize ${styles[type]}`}
    />
  );
};
