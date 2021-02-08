const { expect } = require('chai');

const quickSwapTestJSON = require('../artifacts/contracts/QuickSwapExchangeTest.sol/QuickSwapExchangeTest.json');
const quickSwapTestABI = quickSwapTestJSON['abi'];

let deployer;
let quickSwapExchangeTest;
let d = new Date();

const contractAddress = '';

describe('QuickSwapExchangeTest', function () {
	before(async () => {
		[deployer] = await ethers.getSigners();
		quickSwapExchangeTest = await new ethers.Contract(contractAddress, quickSwapTestABI, deployer);
	});

	it('Should return max amount of DAI for given ETH', async () => {
		const etherAmount = 100;
		const result = await quickSwapExchangeTest.getEstimatedDAIforETH(etherAmount);
		console.log(result[0].toNumber());
		expect(result).to.be.an('array').that.is.not.empty;
	});

	it('Should exchange ETH for maDAI', async () => {
		const etherAmount = 15;
		const swappedAmount = await quickSwapExchangeTest.swapEthForMaDai(d.getTime(), {
			value: etherAmount
		});
		expect(swappedAmount).to.not.equal(0);
	});
});
