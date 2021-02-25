import classNames from 'classnames';
import { FC, useContext, useState } from 'react';

import ChevronDownIcon from '../../../assets/icons/chevron-down.svg';
import { useAuth } from '../../../hooks/useAuth';
import { Web3Context } from '../../../pages/_app';
import { claimReward, vote } from '../../../services/contract';
import { Bet } from '../../../types';
import { convertWeiToEth, formatDate, getStatus } from '../../../utils';
import { Button, StatusBadge } from '../../global';

interface BetCardProps {
  bet: Bet;
  number: number;
  handleFetch: () => void;
}

const map = {
  1: 'In progress',
  2: 'In progress',
  3: 'Vote',
  4: 'Vote',
  5: 'Claim',
  6: 'Finished'
};

export const BetCard: FC<BetCardProps> = ({ bet, number, handleFetch }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const web3 = useContext(Web3Context);
  const { getAccount } = useAuth();

  const handleAction = async () => {
    if (+bet.betState === 5) {
      try {
        await claimReward(web3, bet.betAddress, getAccount().address);
        handleFetch();
        return;
      } catch (e) {
        console.log(e);
      }
    }

    if (+bet.betState === 3 || +bet.betState === 4) {
      try {
        await vote(web3, 'for-bettor', bet.betAddress, getAccount().address);
        handleFetch();
        return;
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const checkIfDisabled = (betState: string) => {
    if (+betState < 3 || +betState === 6) {
      console.log('Here - true');
      return true;
    } else return false;
  };

  return (
    <div className="h-auto w-full bg-real-dark rounded-lg p-4 flex flex-col shadow-lg">
      <div className="flex">
        <span className="block mr-4 font-bold">{number}.</span>
        <div className="flex-1 flex flex-col">
          <div className="flex items-center">
            <StatusBadge type={getStatus(bet.betState)} />
            {bet.expirationDate !== '0' && (
              <>
                <span className="block w-1 h-1 bg-white rounded-full mx-2" />
                <span>{formatDate(bet.expirationDate)}</span>
              </>
            )}
          </div>
          <span className="font-bold mt-1">{convertWeiToEth(web3, bet.deposit)} ETH</span>
          <Button
            className={classNames(
              'btn-primary block text-sm font-bold mt-4 py-2 px-8 h-auto w-max sticky',
              {
                'disabled:opacity-50': checkIfDisabled(bet.betState)
              }
            )}
            onClick={handleAction}
            disabled={checkIfDisabled(bet.betState)}>
            {map[+bet.betState]}
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
        {bet.description}
      </p>
    </div>
  );
};
