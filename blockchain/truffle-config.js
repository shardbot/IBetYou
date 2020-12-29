const dotenv = require("dotenv");
dotenv.config(".env");
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
	networks: {
		rinkeby: {
			provider: new HDWalletProvider(
				process.env.PRIVATE_KEY,
				`https://rinkeby.infura.io/v3/${process.env.INFURA_ID}`
			),
			network_id: 4,
		},
	},

	mocha: {},

	compilers: {
		solc: {
			version: "0.7.0",
		},
	},
};
