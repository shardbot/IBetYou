import { useContext } from 'react';

import { AuthContext, OnboardContext } from '../pages/_app';
import { useRouter } from 'next/router';

export const useAuth = () => {
  const { state, dispatch } = useContext(AuthContext);
  const onboard = useContext(OnboardContext);
  const router = useRouter();

  const readyToTransact = async () => {
    return await onboard.walletCheck();
  };

  const redirectToDashboard = () => {
    dispatch({
      type: 'LOG_IN',
      payload: null
    });

    router.push('/user/dashboard');
  };

  const logIn = () => {
    dispatch({
      type: 'LOG_IN',
      payload: null
    });
  };

  const isLoggedIn = () => {
    return state.isConnected;
  };

  const getAccount = () => {
    return onboard.getState();
  };

  const connectWallet = async () => {
    const select = await onboard.walletSelect();
    console.log(select);
    // return if exited - function return false
    if (!select) {
      console.log('Exited');
      return false;
    }

    // is wallet selected and ready to transact
    const isReadyToTransact = await readyToTransact();
    console.log('Ready to transact?', isReadyToTransact);

    console.log('Dispatch here');

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
    logIn
  };
};
