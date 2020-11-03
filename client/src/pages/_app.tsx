import '../styles/globals.scss';

import { AppProps } from 'next/app';
import { FC, Fragment } from 'react';

import { PageWithLayout } from '../types';

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const Layout = (Component as PageWithLayout).Layout
    ? (Component as PageWithLayout).Layout
    : Fragment;

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default App;
