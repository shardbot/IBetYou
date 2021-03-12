import { Initialization } from 'bnc-onboard/dist/src/interfaces';

const MAIN_NETWORK_ID = 137;
const ONBOARD_API_KEY = process.env.NEXT_PUBLIC_ONBOARD_API_KEY || '';

type OnboardConfig = Pick<
  Initialization,
  'dappId' | 'networkId' | 'hideBranding' | 'walletSelect' | 'walletCheck'
>;

export const onboardConfig: OnboardConfig = {
  dappId: ONBOARD_API_KEY,
  networkId: MAIN_NETWORK_ID,
  hideBranding: true,
  walletCheck: [
    { checkName: 'connect' },
    { checkName: 'network' },
    { checkName: 'derivationPath' },
    { checkName: 'accounts' }
  ],
  walletSelect: {
    wallets: [
      {
        walletName: 'metamask'
      },
      {
        walletName: 'walletConnect',
        rpc: {
          ['137']: 'https://rpc-mainnet.maticvigil.com/'
        }
      }
    ]
  }
};
