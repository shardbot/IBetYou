import { useState } from 'react';

import { claimReward, getRevertMessage, vote } from '../services/contract';
import { Bet } from '../types';
import { useAuth, useNotification, useWeb3 } from './';

export const useBet = (bet: Bet, handleFetch: () => any) => {
  const { web3 } = useWeb3();
  const { getAccount } = useAuth();
  const { showNotification, hideNotification } = useNotification();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAction = async () => {
    hideNotification();
    setIsLoading(true);

    if (+bet.betState === 5) {
      try {
        showNotification('Please wait until transaction is completed.');
        await claimReward(web3, bet.betAddress, getAccount().address);
        handleFetch();
        setIsLoading(false);
        showNotification('You successfully claimed your reward!');
        return;
      } catch (e) {
        getRevertMessage(web3, e).then((message) => {
          showNotification(message, 'error');
        });
        setIsLoading(false);
      }
    }

    if ((+bet.betState === 3 || +bet.betState === 4) && bet.isJudge) {
      try {
        showNotification('Please wait until transaction is completed.');
        await vote(web3, 'for-bettor', bet.betAddress, getAccount().address);
        handleFetch();
        setIsLoading(false);
        showNotification('You successfully voted');
        return;
      } catch (e) {
        getRevertMessage(web3, e).then((message) => {
          showNotification(message, 'error');
        });
        setIsLoading(false);
      }
    }
  };

  return {
    handleAction,
    isLoading
  };
};
