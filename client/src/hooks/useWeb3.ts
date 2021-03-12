import { useContext } from 'react';

import { Web3Context } from '../pages/_app';

export const useWeb3 = () => {
  const web3 = useContext(Web3Context);

  return {
    web3
  };
};
