const BetFactory = artifacts.require("BetFactory");
const now = new Date();
const betCreatorName = "Satoshi";

let betTaker;
let betCreatorJudges;
let expirationTime;
let minimumDeposit;
let betFactory;

contract("BetFactory", (accounts) => {
	before(() => {
		expirationTime = Math.round(now.getTime() / 1000) + 10000;
		betTaker = accounts[1];
		betCreatorJudges = [accounts[2], accounts[3]];
		minimumDeposit = 100;
	});
	beforeEach(async () => {
		betFactory = await BetFactory.deployed();
	});
	it("Deploys a bet contract.", async () => {
		await betFactory.createBet(
			betCreatorName,
			betTaker,
			betCreatorJudges,
			expirationTime,
			{ value: minimumDeposit }
		);
		const bets = await betFactory.getDeployedBets();
		assert.ok(bets[0]);
	});
	it("Successfully adds official judges.", async () => {
		await betFactory.addJudges(betCreatorJudges);
		betCreatorJudges.forEach(async (judge) =>
			assert.ok(await betFactory.isJudge(judge))
		);
	});
	it("Only allows admin to get deployed bet addresses.", async () => {
		await betFactory.createBet(
			betCreatorName,
			betTaker,
			betCreatorJudges,
			expirationTime,
			{ value: minimumDeposit }
		);
		try {
			bets = await betFactory.getDeployedBets({ from: accounts[1] });
			assert.fail();
		} catch (error) {
			const msgexist = error.message.search("revert") >= 0;
			assert.ok(msgexist);
		}
	});
});
