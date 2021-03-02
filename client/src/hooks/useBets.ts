import { useState } from 'react';

import { getBet, getBets } from '../services/contract';
import { Bet } from '../types';
import { convertWeiToEth } from '../utils';
import { useWeb3 } from './useWeb3';

export const useBets = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bets, setBets] = useState<Bet[]>([]);
  const [totalStake, setTotalStake] = useState<number>(null);
  const { web3 } = useWeb3();

  const fetchBets = () => {
    setIsLoading(true);
    getBets(web3).then((addresses) => {
      console.log(addresses);
      Promise.all(addresses.map((address) => getBet(web3, address))).then((results) => {
        const transformedResults = results.map((item, i) => {
          return {
            ...item,
            address: addresses[i],
            expirationDate: item.expirationTime
          };
        });
        // Total stake
        const totalStake = getTotalStake(transformedResults);

        setBets(transformedResults);
        setTotalStake(totalStake);
        setIsLoading(false);
      });
    });
  };

  const getTotalStake = (bets: Bet[]) => {
    const total = bets.reduce((acc, currentValue) => {
      return acc + +currentValue.deposit;
    }, 0);

    const totalInEth = convertWeiToEth(web3, total.toString());

    return +totalInEth;
  };

  return {
    fetchBets,
    isLoading,
    bets,
    totalStake
  };
};
