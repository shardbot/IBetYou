import { useState } from 'react';

import { checkClaim, checkVote, getBet, getBettorBets, getJudgeBets } from '../services/contract';
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
      async (results) => {
        let claims: boolean[];
        const claimsPromise = results.map(async (result) => {
          return checkClaim(web3, result.betAddress, accountAddress);
        });
        await Promise.all(claimsPromise).then((results) => {
          claims = results;
        });

        const transformedResults = results.map((item, i) => {
          const isWinner = item.winner.toUpperCase() === accountAddress.toUpperCase();
          return {
            ...item,
            address: bettorBetsAddresses[i],
            expirationDate: item.expirationTime,
            isJudge: false,
            didFarmYield: item.didFarmYield,
            isWinner: isWinner,
            didClaim: claims[i]
          };
        });
        allBets = [...allBets, ...transformedResults];
      }
    );

    // get bets where user is judge
    const judgeBetsAddresses = await getJudgeBets(web3, accountAddress);

    await Promise.all(judgeBetsAddresses.map((address) => getBet(web3, address))).then(
      async (results) => {
        let claims: boolean[];
        let votes: boolean[];

        const votesPromise = results.map(async (result) => {
          return checkVote(web3, result.betAddress, accountAddress);
        });
        const claimsPromise = results.map(async (result) => {
          return checkClaim(web3, result.betAddress, accountAddress);
        });
        await Promise.all(claimsPromise).then((results) => {
          claims = results;
        });
        await Promise.all(votesPromise).then((results) => {
          votes = results;
        });
        const transformedResults = results.map((item, i) => {
          const isWinner = item.winner.toUpperCase() === accountAddress.toUpperCase();
          return {
            ...item,
            address: judgeBetsAddresses[i],
            expirationDate: item.expirationTime,
            isJudge: true,
            didVote: votes[i],
            didFarmYield: item.didFarmYield,
            isWinner: isWinner,
            didClaim: claims[i]
          };
        });
        allBets = [...allBets, ...transformedResults];
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
