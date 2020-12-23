export const convertEthToWei = (web3: Web3, value: string): string => {
  return web3.utils.toWei(value);
};

export const convertWeiToEth = (web3: Web3, value: string): string => {
  return web3.utils.fromWei(value);
};

// milliseconds since Jan 1, 1970, 00:00:00.000 GMT
export const getDateInMs = (date: string): number => {
  return new Date(date).getTime();
};
