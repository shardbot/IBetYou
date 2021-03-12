const dotenv = require('dotenv');
dotenv.config('.env');
require('@nomiclabs/hardhat-waffle');

const MATIC_PRIVATE_KEY = process.env.PRIVATE_KEY;
const MATIC_MAIN_RPC = process.env.MATIC_MAIN_RPC;

task('accounts', 'Prints the list of accounts', async () => {
    const accounts = await ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

module.exports = {
    solidity: '0.8.0',
    networks: {
        matic: {
            url: MATIC_MAIN_RPC,
            network_id: 80001,
            chain_id: 137,
            gas: 4500000,
            gasPrice: 10000000000,
            accounts: [`0x${MATIC_PRIVATE_KEY}`],
        },
    },
};
