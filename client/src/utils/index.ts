export const convertEthToWei = (web3: Web3, value: string): string => {
  return web3.utils.toWei(value);
};

export const convertWeiToEth = (web3: Web3, value: string): string => {
  return web3.utils.fromWei(value);
};

export const checkIfIsValidAddress = (web3: Web3, address: any): boolean => {
  return web3.utils.isAddress(address);
};

// milliseconds since Jan 1, 1970, 00:00:00.000 GMT
export const getDateInMs = (date: string): number => {
  if (!date) return 0;

  return new Date(date).getTime();
};

export const formatDate = (date: string): string => {
  const d = new Date(Number(date));
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

const statuses = {
  '1': 'active',
  '2': 'active',
  '3': 'pending',
  '4': 'pending',
  '5': 'claim',
  '6': 'finished'
};

export const getStatus = (statusNumber: string) => {
  return statuses[statusNumber];
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
