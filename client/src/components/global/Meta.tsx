import Head from 'next/head';
import { FC } from 'react';

interface MetaProps {
  title: string;
}

export const Meta: FC<MetaProps> = ({ title }) => {
  return (
    <Head>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />

      <title>{title}</title>

      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};
