import { Bet } from '../../../blockchain/types/web3-v1-contracts/Bet';
import { BetFactory } from '../../../blockchain/types/web3-v1-contracts/BetFactory';
import { betAbi, betFactoryAbi } from '../abis';
import { convertEthToWei, getDateInMs } from '../utils';

// TODO move this to env
const BET_FACTORY_CONTRACT_ADDRESS = '0xdB26cD60a810A89485c63cC5ABEb209E5643bac8';

const createBetFactoryContract = (web3: Web3) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return (new web3.eth.Contract(betFactoryAbi, BET_FACTORY_CONTRACT_ADDRESS) as any) as BetFactory;
};

const createBetContract = (web3: Web3, address: string) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return (new web3.eth.Contract(betAbi, address) as any) as Bet;
};

interface BetParams {
  deposit: string;
  expirationDate: string;
  description: string;
}

type BettorType = 'bettor' | 'counter-bettor';
type JudgeType = 'bettor-judge' | 'counter-bettor-judge';

export const getBet = async (web3: Web3, betContractAddress: string | any) => {
  const contract = createBetContract(web3, betContractAddress);

  return contract.methods.getBet().call();
};

export const createBet = async (web3: Web3, accountAddress: string, betParams: BetParams) => {
  const contract = createBetFactoryContract(web3);
  const depositInWei = convertEthToWei(web3, betParams.deposit);
  const dateInMs = getDateInMs(betParams.expirationDate);

  return contract.methods.createBet(depositInWei, betParams.description, dateInMs).send({
    from: accountAddress
  });
};

export const bet = async (
  web3: Web3,
  accountAddress: string,
  betContractAddress: string | any,
  deposit: string,
  bettorType: BettorType
) => {
  const contract = createBetContract(web3, betContractAddress);

  // TODO refactor
  if (bettorType === 'bettor') {
    return contract.methods.addBettor().send({
      from: accountAddress,
      value: deposit
    });
  } else {
    return contract.methods.addCounterBettor().send({
      from: accountAddress,
      value: deposit
    });
  }
};

export const addJudge = async (
  web3: Web3,
  judgeType: JudgeType,
  betContractAddress: string | any
) => {
  const contract = createBetContract(web3, betContractAddress);

  // TODO refactor
  if (judgeType === 'bettor-judge') {
    return contract.methods.addBettorJudge().call();
  } else {
    return contract.methods.addCounterBettorJudge().call();
  }
};
