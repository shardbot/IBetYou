let Factory = artifacts.require("BetFactory.sol");

module.exports = function (deployer) {
    deployer.deploy(Factory)
};