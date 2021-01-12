let Factory = artifacts.require('BetFactory.sol');
let Aave = artifacts.require('AaveDepositWithdraw.sol');

module.exports = function (deployer) {
	deployer.deploy(Factory);
	deployer.deploy(Aave);
};
