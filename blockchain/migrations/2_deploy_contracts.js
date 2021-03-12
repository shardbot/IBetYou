//let Factory = artifacts.require('BetFactory.sol');
let Balancer = artifacts.require('BalancerDepositWithdraw.sol');

module.exports = function (deployer) {
	//deployer.deploy(Factory);
	deployer.deploy(Balancer);
};
