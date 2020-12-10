import '../styles/globals.scss';

import { AppProps } from 'next/app';
import { createContext, FC, Fragment, useEffect } from 'react';
import Web3 from 'web3';

import { PageWithLayout } from '../types';

export const Web3Context = createContext<Web3 | null>(null);

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const Layout = (Component as PageWithLayout).Layout
    ? (Component as PageWithLayout).Layout
    : Fragment;

  const web3 = new Web3(Web3.givenProvider);

  // useEffect(() => {
  //   console.log(window.ethereum);
  // }, []);

  return (
    <Web3Context.Provider value={web3}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Web3Context.Provider>
  );
};

export default App;
