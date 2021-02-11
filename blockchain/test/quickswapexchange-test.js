const { expect } = require('chai');

const quickSwapTestJSON = require('../artifacts/contracts/QuickSwapExchangeTest.sol/QuickSwapExchangeTest.json');
const quickSwapTestABI = quickSwapTestJSON['abi'];

let deployer;
let quickSwapExchangeTest;
let d = new Date();

const contractAddress = '0x1172ee120c1593177993adB4c13A8de38951d780';

describe('QuickSwapExchangeTest', function () {
	before(async () => {
		[deployer] = await ethers.getSigners();
		quickSwapExchangeTest = await new ethers.Contract(contractAddress, quickSwapTestABI, deployer);
	});

	it('Should transfer 1 eth to contract', async () => {
		console.log(ethers.utils.parseEther('1.0'));
		await deployer.sendTransaction({
			from: deployer.address,
			to: contractAddress,
			value: ethers.utils.parseEther('1.0'),
			gasLimit: 800000
		});
		const contractValue = await quickSwapExchangeTest.getMaticBalance(contractAddress);
		console.log(contractValue);
	});

	it('Should swap eth for maUSDC', async () => {
		const tx = await quickSwapExchangeTest.swapEthForMaUSDC(d.getTime() + 15, {
			gasLimit: 8000000,
			gasPrice: 5
		});
		const contractMaUSDCValue = await quickSwapExchangeTest.getMaUSDCBalance(contractAddress);
		console.log(tx);
		console.log(contractMaUSDCValue);
	});
});
