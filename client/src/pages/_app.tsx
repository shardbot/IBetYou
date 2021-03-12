import '../styles/globals.scss';

import Onboard from 'bnc-onboard';
import { API } from 'bnc-onboard/dist/src/interfaces';
import { AppProps } from 'next/app';
import { createContext, FC, Fragment, useEffect, useState } from 'react';
import Web3 from 'web3';

import { onboardConfig } from '../../config';
import { PageWithLayout } from '../types';
import { GlobalProvider } from '../components/providers/Global';
import { AuthProvider } from '../components/providers/Auth';

export const Web3Context = createContext<Web3 | null>(null);
export const OnboardContext = createContext<API | null>(null);

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const [web3, setWeb3] = useState<Web3>(() => new Web3(Web3.givenProvider));
  const [onboard, setOnboard] = useState<API>();

  const Layout = (Component as PageWithLayout).Layout
    ? (Component as PageWithLayout).Layout
    : Fragment;

  // initialize Onboard instance
  useEffect(() => {
    const onboardInstance = Onboard({
      ...onboardConfig,
      subscriptions: {
        wallet: (wallet) => {
          const web3Instance = new Web3(wallet.provider);
          setWeb3(web3Instance);
        }
      }
    });
    setOnboard(onboardInstance);
  }, []);

  return (
    <OnboardContext.Provider value={onboard}>
      <Web3Context.Provider value={web3}>
        <AuthProvider>
          <GlobalProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </GlobalProvider>
        </AuthProvider>
      </Web3Context.Provider>
    </OnboardContext.Provider>
  );
};

export default App;
