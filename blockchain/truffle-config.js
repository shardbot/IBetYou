const dotenv = require('dotenv');
dotenv.config('.env');
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
	networks: {
		rinkeby: {
			provider: new HDWalletProvider(
				process.env.PRIVATE_KEY,
				`https://rinkeby.infura.io/v3/${process.env.INFURA_ID}`
			),
			network_id: 4
		},
		matic: {
			provider: () => new HDWalletProvider(process.env.MATIC_TEST_PRIVATE_KEY, process.env.MATIC_TEST_RPC),
			network_id: 80001,
			gas: 4500000,
			gasPrice: 10000000000,
			confirmations: 2,
			timeoutBlocks: 200,
			skipDryRun: true
		},
		develop: {
			host: 'localhost',
			port: 8545,
			network_id: '*' // match any network
		}
	},

	mocha: {},

	compilers: {
		solc: {
			version: '0.8.0'
		}
	}
};
