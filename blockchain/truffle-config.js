const dotenv = require('dotenv');
dotenv.config("../.env")
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
	networks: {
		goerli: {
			provider: new HDWalletProvider(
				process.env.PRIVATE_KEY,
				`https://goerli.infura.io/v3/${process.env.INFURA_ID}`
			),
			network_id: 5,
		},
	},

	mocha: {
	},

	compilers: {
		solc: {
			version: "0.7.3",
		},
	},
};
