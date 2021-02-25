import classNames from 'classnames';
import { FC } from 'react';

import { Button } from '../../global';

interface TabProps {
  tab: {
    id: number;
    label: string;
    position: number;
  };
  selectedPosition: number;
  handleSwitch: (position: number) => void;
}

export const Tab: FC<TabProps> = ({ tab, selectedPosition, handleSwitch }) => {
  const handleClick = (position: number) => {
    handleSwitch(position);
  };

  return (
    <Button
      onClick={() => handleClick(tab.id)}
      className={classNames('pb-3', {
        'font-bold border-b-2 border-green-cyan': tab.position === selectedPosition,
        'md:mr-8': tab.position === 1
      })}>
      {tab.label}
    </Button>
  );
};
