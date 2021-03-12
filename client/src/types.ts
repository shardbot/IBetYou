import { NextPage } from 'next';
import { FC, ReactNode } from 'react';

declare global {
  interface Window {
    ethereum: Partial<{
      enable: () => void;
    }>;
  }
}

export type PageWithLayout = NextPage & { Layout?: FC };

export type GlobalState = {
  notification: {
    isActive: boolean;
    content: any;
    type?: 'default' | 'error' | 'success';
  };
  modal: {
    isVisible: boolean;
    content: ReactNode;
  };
};

type NotificationActions =
  | { type: 'SHOW_NOTIFICATION'; payload: any }
  | { type: 'REMOVE_NOTIFICATION'; payload: any };

type ModalActions = { type: 'SHOW_MODAL'; payload: any } | { type: 'HIDE_MODAL'; payload: any };

export type GlobalStateActions = NotificationActions | ModalActions;

export interface AuthState {
  isConnected: boolean;
  wallet: any;
}

export type AuthActions =
  | { type: 'SET_WALLET'; payload }
  | { type: 'LOG_IN'; payload }
  | { type: 'LOG_OUT'; payload };

export interface Bet {
  opponentEmail?: string;
  description: string;
  expirationDate?: string;
  judgeEmail?: string;
  betState?: string;
  betAddress?: string;
  deposit: string;
  isJudge?: boolean;
  didVote?: boolean;
  didFarmYield?: boolean;
  winner?: string;
  isWinner?: boolean;
  didClaim?: boolean;
}
