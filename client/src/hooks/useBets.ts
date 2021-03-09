import { useState } from 'react';

import { checkVote, getBet, getBettorBets, getJudgeBets } from '../services/contract';
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
    await Promise.all(bettorBetsAddresses.map((address) => getBet(web3, address))).then(
      (results) => {
        console.log('Bettor bets');
        console.log(results);
        const transformedResults = results.map((item, i) => {
          const isWinner = item.winner.toUpperCase() === accountAddress.toUpperCase();
          return {
            ...item,
            address: bettorBetsAddresses[i],
            expirationDate: item.expirationTime,
            isJudge: false,
            didFarmYield: item.didFarmYield,
            isWinner: isWinner
          };
        });
        console.log(transformedResults);
        allBets = [...allBets, ...transformedResults];
      }
    );

    // get bets where user is judge
    const judgeBetsAddresses = await getJudgeBets(web3, accountAddress);

    await Promise.all(judgeBetsAddresses.map((address) => getBet(web3, address))).then(
      async (results) => {
        console.log('Judge bets');
        console.log(results);
        const votes = results.map(async (result) => {
          return checkVote(web3, result.betAddress, accountAddress);
        });
        await Promise.all(votes).then((vote) => {
          const transformedResults = results.map((item, i) => {
            const isWinner = item.winner.toUpperCase() === accountAddress.toUpperCase();
            return {
              ...item,
              address: judgeBetsAddresses[i],
              expirationDate: item.expirationTime,
              isJudge: true,
              didVote: vote[i],
              didFarmYield: item.didFarmYield,
              isWinner: isWinner
            };
          });
          console.log(transformedResults);
          allBets = [...allBets, ...transformedResults];
        });
      }
    );

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
