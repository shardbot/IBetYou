import { useState } from 'react';

import { claimReward, getRevertMessage, vote } from '../services/contract';
import { Bet } from '../types';
import { useAuth, useNotification, useWeb3 } from './';

export const useBet = (bet: Bet, handleFetch: () => any) => {
  const { web3 } = useWeb3();
  const { getAccount } = useAuth();
  const { showNotification, hideNotification } = useNotification();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleVote = async (voteFor: 'for-bettor' | 'for-counter-bettor') => {
    hideNotification();
    setIsLoading(true);

    if ((+bet.betState === 3 || +bet.betState === 4) && bet.isJudge) {
      try {
        showNotification('Please wait until transaction is completed.');
        await vote(web3, voteFor, bet.betAddress, getAccount().address);
        handleFetch();
        setIsLoading(false);
        showNotification('You successfully voted', 'success');
        return;
      } catch (e) {
        getRevertMessage(web3, e).then((message) => {
          showNotification(message, 'error');
        });
        setIsLoading(false);
      }
    } else return;
  };

  const handleClaim = async () => {
    hideNotification();
    setIsLoading(true);

    if (+bet.betState === 5) {
      try {
        showNotification('Please wait until transaction is completed.');
        await claimReward(web3, bet.betAddress, getAccount().address);
        handleFetch();
        setIsLoading(false);
        showNotification('You successfully claimed your reward!', 'success');
        return;
      } catch (e) {
        getRevertMessage(web3, e).then((message) => {
          showNotification(message, 'error');
        });
        setIsLoading(false);
      }
    } else return;
  };

  return {
    handleVote,
    handleClaim,
    isLoading
  };
};
