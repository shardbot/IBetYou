import '../styles/globals.scss';

import Onboard from 'bnc-onboard';
import { API } from 'bnc-onboard/dist/src/interfaces';
import { AppProps } from 'next/app';
import { createContext, Dispatch, FC, Fragment, useEffect, useReducer, useState } from 'react';
import Web3 from 'web3';

import { AuthAction, AuthReducer, AuthState } from '../reducers/authReducer';
import { PageWithLayout } from '../types';

const initialState = {
  isConnected: false,
  wallet: null
};

const wallets = [
  { walletName: 'metamask' },
  {
    walletName: 'walletConnect',
    rpc: {
      ['137']: 'https://rpc-mainnet.maticvigil.com/`'
    }
  }
];

export const Web3Context = createContext<Web3 | null>(null);
export const OnboardContext = createContext<API | null>(null);
export const AuthContext = createContext<{
  state: AuthState;
  dispatch: Dispatch<AuthAction>;
}>(null);

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const [web3, setWeb3] = useState<Web3>(() => new Web3(Web3.givenProvider));
  const [onboard, setOnboard] = useState<API>();
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  const Layout = (Component as PageWithLayout).Layout
    ? (Component as PageWithLayout).Layout
    : Fragment;

  // initialize onboarding instance
  useEffect(() => {
    const onboardInstance = Onboard({
      dappId: 'test',
      networkId: 137,
      hideBranding: true,
      walletSelect: {
        wallets: wallets
      },
      subscriptions: {
        wallet: (wallet) => {
          const web3Instance = new Web3(wallet.provider);
          setWeb3(web3Instance);
        }
      }
    });
    setOnboard(onboardInstance);
  }, []);

  // const aa = new Web3(Web3.givenProvider);

  return (
    <OnboardContext.Provider value={onboard}>
      <Web3Context.Provider value={web3}>
        <AuthContext.Provider value={{ state, dispatch }}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AuthContext.Provider>
      </Web3Context.Provider>
    </OnboardContext.Provider>
  );
};

export default App;
