import classNames from 'classnames';
import { FC, useState } from 'react';

import ChevronDownIcon from '../../../assets/icons/chevron-down.svg';
import { useBet, useModal, useWeb3 } from '../../../hooks';
import { Bet } from '../../../types';
import { convertWeiToEth, formatDate, getStatus } from '../../../utils';
import { VoteForm } from '../../forms/modal';
import { Button, Loader, StatusBadge } from '../../global';

interface BetCardProps {
  bet: Bet;
  number: number;
  handleFetch: any;
}

const map = {
  1: 'In progress',
  2: 'In progress',
  3: 'Vote',
  4: 'Vote',
  5: 'Claim',
  6: 'Finished'
};

const checkIfDisabled = (betState: string) => {
  if (+betState < 3 || +betState === 6) {
    return true;
  } else return false;
};

const ActionButton: FC<{ handleAction: any; bet: Bet }> = ({ handleAction, bet, ...rest }) => {
  return (
    <Button
      className={classNames(
        'btn-primary block text-sm font-bold mt-4 py-2 px-8 h-auto w-max sticky',
        {
          'disabled:opacity-50': checkIfDisabled(bet.betState)
        }
      )}
      onClick={handleAction}
      disabled={checkIfDisabled(bet.betState)}>
      {rest.children}
    </Button>
  );
};

export const BetCard: FC<BetCardProps> = ({ bet, number, handleFetch }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { isLoading, handleClaim } = useBet(bet, handleFetch);
  const { web3 } = useWeb3();
  const { showModal } = useModal();

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleOpenModal = () => {
    showModal(<VoteForm bet={bet} handleFetch={handleFetch} />);
  };

  const handleAction = async () => {
    if (+bet.betState === 3 || +bet.betState === 4) {
      handleOpenModal();
      return;
    } else if (+bet.betState === 5) {
      await handleClaim();
      return;
    }
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
          <span className="font-bold mt-1">{convertWeiToEth(web3, bet.deposit)} MATIC</span>
          {isLoading ? (
            <Loader classes="w-8 h-8 mt-4" />
          ) : (
            <>
              {bet.isJudge && bet.didVote === false ? (
                <ActionButton handleAction={handleAction} bet={bet}>
                  {map[+bet.betState]}
                </ActionButton>
              ) : (
                <>
                  {+bet.betState === 5 &&
                  !bet.didClaim &&
                  ((bet.didFarmYield && bet.isJudge) || bet.isWinner) ? (
                    <ActionButton bet={bet} handleAction={handleClaim}>
                      Claim
                    </ActionButton>
                  ) : (
                    <Button
                      className="btn-primary text-white disabled:opacity-50 block text-sm font-bold mt-4 py-2 px-8 h-auto w-max sticky"
                      disabled>
                      {+bet.betState === 6 ? 'Finished' : 'In progress...'}
                    </Button>
                  )}
                </>
              )}
            </>
          )}
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
