import { FC } from 'react';

import { useBet, useWeb3 } from '../../../hooks';
import { Bet } from '../../../types';
import { convertWeiToEth, formatDate, getStatus } from '../../../utils';
import { Button, Loader, StatusBadge } from '../../global';

interface RowProps {
  bet: Bet;
  number: number;
  handleFetch: () => void;
}

const map = {
  3: 'Vote',
  4: 'Vote',
  5: 'Claim'
};

const ActionButton: FC<{ handleAction: any }> = ({ handleAction, ...rest }) => {
  return (
    <Button
      className="btn-primary block text-sm font-bold py-2 px-8 h-auto w-max sticky"
      onClick={handleAction}>
      {rest.children}
    </Button>
  );
};

export const Row: FC<RowProps> = ({ bet, number, handleFetch }) => {
  const { web3 } = useWeb3();
  const { handleAction, isLoading } = useBet(bet, handleFetch);

  return (
    <tr className="bg-real-dark shadow-lg">
      <td className="text-left pr-8 pl-8 py-10 rounded-tl-lg rounded-bl-lg font-bold">{number}.</td>
      <td className="pr-8 2xl:pr-24">{bet.description}</td>
      <td className="pr-8">{bet.expirationDate !== '0' ? formatDate(bet.expirationDate) : '-'}</td>
      <td>
        <StatusBadge type={getStatus(bet.betState)} />
      </td>
      <td className="pr-8 font-bold">{convertWeiToEth(web3, bet.deposit)}</td>
      <td className="text-right pr-8 rounded-tr-lg rounded-br-lg font-bold">
        {+bet.betState > 2 && +bet.betState < 6 ? (
          <>
            {isLoading ? (
              <Loader classes="w-8 h-8 ml-auto" />
            ) : (
              <>
                {bet.isJudge && bet.didVote === false ? (
                  <ActionButton handleAction={handleAction}>{map[+bet.betState]}</ActionButton>
                ) : (
                  <>
                    {+bet.betState === 5 ? (
                      <ActionButton handleAction={handleAction}>Claim</ActionButton>
                    ) : (
                      <span>-</span>
                    )}
                  </>
                )}
              </>
            )}
          </>
        ) : (
          <span>-</span>
        )}
      </td>
    </tr>
  );
};
