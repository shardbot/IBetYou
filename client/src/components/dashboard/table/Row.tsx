import { FC, useContext, useState } from 'react';

import { useAuth } from '../../../hooks/useAuth';
import { Web3Context } from '../../../pages/_app';
import { claimReward, vote } from '../../../services/contract';
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

export const Row: FC<RowProps> = ({ bet, number, handleFetch }) => {
  const web3 = useContext(Web3Context);
  const { getAccount } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAction = async () => {
    setIsLoading(true);
    if (+bet.betState === 5) {
      try {
        await claimReward(web3, bet.betAddress, getAccount().address);
        handleFetch();
        setIsLoading(false);
        return;
      } catch (e) {
        console.log(e);
        setIsLoading(false);
      }
    }

    if (+bet.betState === 3 || +bet.betState === 4) {
      try {
        await vote(web3, 'for-bettor', bet.betAddress, getAccount().address);
        handleFetch();
        setIsLoading(false);
        return;
      } catch (e) {
        console.log(e);
        setIsLoading(false);
      }
    }
  };

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
              <Loader classes="w-8 h-8" />
            ) : (
              <Button
                className="btn-primary block text-sm font-bold py-2 px-8 h-auto w-max sticky"
                onClick={handleAction}>
                {map[+bet.betState]}
              </Button>
            )}
          </>
        ) : (
          <span>-</span>
        )}
      </td>
    </tr>
  );
};
