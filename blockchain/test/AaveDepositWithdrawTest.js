// Libs
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545/');

const AaveDepositWithdraw = artifacts.require('AaveDepositWithdraw');
const unlockedAccount = ''; // address of unlocked account with Ganache

let aaveContract;
contract('Aave', (accounts) => {
	before(async () => {
		aaveContract = await AaveDepositWithdraw.new();
	});
	it('Successfully receives funds.', async () => {
		await web3.eth.sendTransaction({
			from: unlockedAccount,
			to: aaveContract.address,
			value: web3.utils.toWei('15', 'ether')
		});
		const balance = await aaveContract.getETHBalance();
		console.log(`ETH balance: ${balance}`);
		assert.ok(balance);
	});
	it('Deposits ETH to AAVE sucessfully.', async () => {
		await aaveContract.depositETH();
		const aWETHBalance = await aaveContract.getAWETHBalance();
		console.log(`Current aWETH balance: ${aWETHBalance}`);
		assert.ok(aWETHBalance);
	});
	it('Withdraws ETH from AAVE successfully.', async () => {
		const eTHBalanceBefore = await aaveContract.getETHBalance();
		const aWETHBalanceBefore = await aaveContract.getAWETHBalance();
		console.log(`ETH balance before withdrawal: ${eTHBalanceBefore}, aWETH: ${aWETHBalanceBefore}`);
		await aaveContract.withdrawETH();
		const eTHBalanceAfter = await aaveContract.getETHBalance();
		const aWETHBalanceAfter = await aaveContract.getAWETHBalance();
		console.log(`ETH balance after withdrawal: ${eTHBalanceAfter}, aWETH: ${aWETHBalanceAfter}`);
		assert(eTHBalanceBefore < eTHBalanceAfter);
	});
});
