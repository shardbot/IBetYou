import { betAbi, betFactoryAbi, betMapperAbi } from '../abis';
import { Bet } from '../types/web3-v1-contracts/Bet';
import { BetFactory } from '../types/web3-v1-contracts/BetFactory';
import { BetMapper } from '../types/web3-v1-contracts/BetMapper';
import { convertEthToWei, getDateInMs } from '../utils';

const BET_FACTORY_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const BET_MAPPER_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_BET_MAPPER_ADDRESS;
const TX_EXPIRATION = Math.floor(Date.now() / 1000) + 300;

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

const createBetMapperContract = (web3: Web3) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return (new web3.eth.Contract(betMapperAbi, BET_MAPPER_CONTRACT_ADDRESS) as any) as BetMapper;
};

export const getRevertMessage = async (web3: Web3, error: any) => {
  let result: string;

  const pattern = /(?<=execution reverted: )(.*)(?=")/g;
  const receiptJSON = JSON.parse(JSON.stringify(error));
  const txHash = receiptJSON.receipt.transactionHash;
  const tx = await web3.eth.getTransaction(txHash);

  await web3.eth.call(tx).catch((e) => (result = String(e).match(pattern)[0]));

  return result;
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

// export const getBets = async (web3: Web3) => {
//   const contract = createBetFactoryContract(web3);
//
//   return contract.methods.getBets().call();
// };

export const getBettorBets = async (web3: Web3, accountAddress: string): Promise<string[]> => {
  const contract = createBetMapperContract(web3);

  return contract.methods.getBettorBets(accountAddress).call();
};

export const getJudgeBets = async (web3: Web3, accountAddress: string): Promise<string[]> => {
  const contract = createBetMapperContract(web3);

  return contract.methods.getJudgeBets(accountAddress).call();
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
    return contract.methods.addBettorJudge(TX_EXPIRATION).send({
      from: accountAddress
    });
  } else {
    return contract.methods.addCounterBettorJudge(TX_EXPIRATION).send({
      from: accountAddress
    });
  }
};

export const vote = async (
  web3: Web3,
  voteType: 'for-bettor' | 'for-counter-bettor',
  betContractAddress: string | any,
  accountAddress: string | any
) => {
  const contract = createBetContract(web3, betContractAddress);

  if (voteType === 'for-bettor') {
    return contract.methods.voteForBettor(TX_EXPIRATION).send({
      from: accountAddress
    });
  } else {
    return contract.methods.voteForCounterBettor(TX_EXPIRATION).send({
      from: accountAddress
    });
  }
};

export const claimReward = async (
  web3: Web3,
  betContractAddress: string | any,
  accountAddress: string | any
) => {
  const contract = createBetContract(web3, betContractAddress);
  return contract.methods.claimReward().send({
    from: accountAddress,
    to: accountAddress
  });
};
