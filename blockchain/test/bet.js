const { assert } = require('chai');
const { expect } = require('chai').use(require('chai-bignumber')());
const dotenv = require('dotenv');
dotenv.config('.env');

const betJSON = require('../artifacts/contracts/Bet.sol/Bet.json');
const betABI = betJSON['abi'];
const betByteCode = betJSON['bytecode'];
const providerAddress = 'https://rpc-mainnet.maticvigil.com/';

let bettor;
let counterBettor;
let bettorJudge;
let counterBettorJudge;
let provider;
let bet;

describe('Bet', () => {
	before(async () => {
		[deployer] = await ethers.getSigners();
		bettor = deployer.address;
		provider = await ethers.getDefaultProvider(providerAddress);
		counterBettor = new ethers.Wallet(process.env.COUNTER_BETTOR_PRIVATE_KEY, provider);
	});
	it('Sends one ether from deployer to counter bettor.', async () => {
		const balanceBefore = await counterBettor.getBalance();
		const tx = await deployer.sendTransaction({
			from: deployer.address,
			to: counterBettor.address,
			value: ethers.utils.parseEther('1.0')
		});
		provider.waitForTransaction(tx.hash, 1).then(
			async () => {
				const balanceAfter = await counterBettor.getBalance();
				expect(balanceAfter).to.be.bignumber.greaterThan(balanceBefore);
			},
			() => {
				assert.fail();
			}
		);
	});
	it('Successfully deploys a new bet.', async () => {
		const betFactoryMock = new ethers.ContractFactory(betABI, betByteCode, deployer);
		bet = await betFactoryMock.deploy(bettor, ethers.utils.parseEther('1.0'), 'Test bet', 0);
		console.log(`Deployed bet address: ${bet.address}`);

		expect(bet.address).to.not.equal('0x0');
	});
	it('Successfully changes state after bettor and counter bettor have been added.', async () => {
		const betStateBefore = await bet.getBet();

		betBettor = bet.connect(deployer);
		await betBettor.addBettor({
			value: ethers.utils.parseEther('1.0')
		});

		betCounterBettor = bet.connect(counterBettor);
		await betCounterBettor.addCounterBettor({
			value: ethers.utils.parseEther('1.0')
		});

		const betStateAfter = await bet.getBet();
		console.log(betStateBefore);

		expect(betStateBefore.betState).to.not.equal(betStateAfter.betState);
	});
});
