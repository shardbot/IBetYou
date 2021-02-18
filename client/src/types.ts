import { NextPage } from 'next';
import { FC } from 'react';

declare global {
  interface Window {
    ethereum: Partial<{
      enable: () => void;
    }>;
  }
}

export type PageWithLayout = NextPage & { Layout?: FC };

export interface Bet {
  opponentEmail?: string;
  description: string;
  expirationDate?: string;
  judgeEmail?: string;
  betState?: string;
  deposit: string;
}
