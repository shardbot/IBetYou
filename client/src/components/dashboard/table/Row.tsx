import { FC, useContext } from 'react';

import { Web3Context } from '../../../pages/_app';
import { Bet } from '../../../types';
import { convertWeiToEth, formatDate, getStatus } from '../../../utils';
import { Button, StatusBadge } from '../../global';

interface RowProps {
  bet: Bet;
  number: number;
}

export const Row: FC<RowProps> = ({ bet, number }) => {
  const web3 = useContext(Web3Context);

  return (
    <tr className="bg-real-dark shadow-lg">
      <td className="text-left pr-8 pl-8 py-10 rounded-tl-lg rounded-bl-lg font-bold">{number}.</td>
      <td className="pr-8 2xl:pr-24">{bet.description}</td>
      <td className="pr-8">{bet.expirationDate ? formatDate(bet.expirationDate) : '-'}</td>
      <td>
        <StatusBadge type={getStatus(bet.betState)} />
      </td>
      <td className="pr-8 font-bold">{convertWeiToEth(web3, bet.deposit)}</td>
      <td className="text-right pr-8 rounded-tr-lg rounded-br-lg font-bold">
        {+bet.betState === 5 ? (
          <Button className="btn-primary block text-sm font-bold mt-4 py-2 px-8 h-auto w-max sticky">
            Claim reward
          </Button>
        ) : (
          <span>-</span>
        )}
      </td>
    </tr>
  );
};
