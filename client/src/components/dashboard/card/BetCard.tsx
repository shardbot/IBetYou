import classNames from 'classnames';
import { FC, SyntheticEvent, useState } from 'react';

import ChevronDownIcon from '../../../assets/icons/chevron-down.svg';
import { Button } from '../../global';

export const BetCard: FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleExpand = (e: SyntheticEvent) => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="h-auto w-full bg-real-dark rounded-lg p-4 flex flex-col">
      <div className="flex">
        <span className="block mr-4">1.</span>
        <div className="flex-1 flex flex-col">
          <div className="flex items-center">
            <span>Finished</span>
            <span className="block w-1 h-1 bg-white rounded-full mx-2" />
            <span>24 April 2021.</span>
          </div>
          <span className="font-bold">0.0005 ETH</span>
          <Button className="btn-primary block text-sm font-normal mt-4 py-2 px-8 h-auto w-max sticky">
            Claim reward
          </Button>
        </div>
        <Button
          className={classNames('h-full mb-2 block self-end', {
            'transform rotate-0': !isExpanded,
            'transform rotate-180': isExpanded
          })}
          onClick={handleExpand}>
          <ChevronDownIcon />
        </Button>
      </div>
      <p
        className={classNames('mt-4 block px-8 text-slate-gray', {
          hidden: !isExpanded,
          block: isExpanded
        })}>
        I bet you that bitcoin will be at 100,000 $ at the end of this bet
      </p>
    </div>
  );
};
