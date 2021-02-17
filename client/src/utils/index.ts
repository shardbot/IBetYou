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

export const validation = {
  isEmpty(value: any): boolean {
    return value.length === 0;
  },
  isEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },
  isNumber(value: any): boolean {
    return !isNaN(value);
  },

  messages: {
    email: 'Please enter a valid email address!',
    description: 'Please enter a valid description!',
    stake: 'Please enter a valid number!',
    date: 'Please enter a valid date!'
  }
};
