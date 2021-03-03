import { useState } from 'react';

import { getBet, getBettorBets, getJudgeBets } from '../services/contract';
import { Bet } from '../types';
import { convertWeiToEth } from '../utils';
import { useWeb3 } from './useWeb3';

export const useBets = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bets, setBets] = useState<Bet[]>([]);
  const [totalStake, setTotalStake] = useState<number>(null);
  const { web3 } = useWeb3();

  const fetchUserBets = async (accountAddress: string) => {
    let allBets: Bet[] = [];

    setIsLoading(true);

    // get bets where user is bettor
    const bettorBetsAddresses = await getBettorBets(web3, accountAddress);
    console.log(bettorBetsAddresses);
    await Promise.all(bettorBetsAddresses.map((address) => getBet(web3, address))).then(
      (results) => {
        console.log('Bettor bets');
        console.log(results);
        const transformedResults = results.map((item, i) => {
          return {
            ...item,
            address: bettorBetsAddresses[i],
            expirationDate: item.expirationTime,
            isJudge: false
          };
        });
        allBets = [...allBets, ...transformedResults];
      }
    );

    // get bets where user is bettor
    const judgeBetsAddresses = await getJudgeBets(web3, accountAddress);
    console.log(bettorBetsAddresses);
    await Promise.all(judgeBetsAddresses.map((address) => getBet(web3, address))).then(
      (results) => {
        console.log('Bettor bets');
        console.log(results);
        const transformedResults = results.map((item, i) => {
          return {
            ...item,
            address: judgeBetsAddresses[i],
            expirationDate: item.expirationTime,
            isJudge: true
          };
        });
        allBets = [...allBets, ...transformedResults];
      }
    );

    console.log(allBets);

    // Total stake
    const totalStake = getTotalStake(allBets);

    setBets(allBets);
    setTotalStake(totalStake);
    setIsLoading(false);
  };

  const getTotalStake = (bets: Bet[]) => {
    const total = bets.reduce((acc, currentValue) => {
      return acc + +currentValue.deposit;
    }, 0);

    const totalInEth = convertWeiToEth(web3, total.toString());

    return +totalInEth;
  };

  return {
    fetchUserBets,
    isLoading,
    bets,
    totalStake
  };
};
