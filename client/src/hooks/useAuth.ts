import { useRouter } from 'next/router';
import { useContext } from 'react';

import { AuthContext } from '../components/providers/Auth';
import { MATIC_CHAIN_CONFIG } from '../constants';
import { OnboardContext } from '../pages/_app';

export const useAuth = () => {
  const { state, dispatch } = useContext(AuthContext);
  const onboard = useContext(OnboardContext);
  const router = useRouter();

  const readyToTransact = async () => {
    return await onboard.walletCheck();
  };

  const redirectToDashboard = () => {
    logIn();
    router.push('/user/dashboard');
  };

  const logIn = () => {
    dispatch({
      type: 'LOG_IN',
      payload: null
    });
  };

  const logOut = () => {
    dispatch({
      type: 'LOG_OUT',
      payload: null
    });
    router.push('/');
  };

  const isLoggedIn = () => {
    return state.isConnected;
  };

  const getAccount = () => {
    return onboard.getState();
  };

  const connectWallet = async () => {
    // if metamask is injected - ask user if he wants to add Matic network to his list of networks
    if (typeof window.ethereum !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [MATIC_CHAIN_CONFIG]
      });
    }

    const select = await onboard.walletSelect();
    // return if exited - function return false
    if (!select) {
      return false;
    }

    // is wallet selected and ready to transact
    const isReadyToTransact = await readyToTransact();

    if (!isReadyToTransact) return false;

    dispatch({
      type: 'SET_WALLET',
      payload: {
        wallet: onboard.getState()
      }
    });

    return true;
  };

  return {
    isLoggedIn,
    state,
    getAccount,
    connectWallet,
    readyToTransact,
    redirectToDashboard,
    logIn,
    logOut
  };
};
