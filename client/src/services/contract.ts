import { betAbi, betFactoryAbi } from '../abis';
import { Bet } from '../types/web3-v1-contracts/Bet';
import { BetFactory } from '../types/web3-v1-contracts/BetFactory';
import { convertEthToWei, getDateInMs } from '../utils';

const BET_FACTORY_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

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
  judgeType: JudgeType | any,
  betContractAddress: string | any,
  accountAddress: string | any
) => {
  const contract = createBetContract(web3, betContractAddress);

  if (judgeType === 'bettor-judge') {
    console.log('add bettor judge');
    return contract.methods.addBettorJudge().send({
      from: accountAddress
    });
  } else {
    console.log('add counter-bettor judge');
    return contract.methods.addCounterBettorJudge().send({
      from: accountAddress
    });
  }
};
