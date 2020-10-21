const BetFactory = artifacts.require("BetFactory");
const Bet = artifacts.require("Bet");
const now = new Date()

let betFactory;
let bet;
let creatorJudges;
let opponentJudges;
let opponentAddress;
let creatorAddress;
let creatorChoice = true;
let expirationTime = Math.round(now.getTime() / 1000) + 10000;
let minimumDeposit = 100;

contract("Bet", (accounts) => {
  before(async () => {
    creatorJudges = [accounts[2], accounts[3]];
    opponentAddress = accounts[1];
    creatorAddress = accounts[0];
    betFactory = await BetFactory.deployed();
  });

  beforeEach(async () => {
    await betFactory.createBet(opponentAddress, creatorJudges, expirationTime, creatorChoice, {from: creatorAddress, value: minimumDeposit});
    const betInstances = await betFactory.getDeployedBets();
    len = await betInstances.length;
    bet = await Bet.at(betInstances[len - 1]);
  })

  it("Only allows specific address to accept bet.", async () => {
    opponentJudges = [accounts[4], accounts[5]];
    restrictedAddress = accounts[0]
    try {
      await bet.acceptBet(opponentJudges, {from: restrictedAddress, value: minimumDeposit});
      assert(false);
    }
    catch(err){
        assert(err);
    }
  });

  it("Cannot appoint more judges than opponent.", async () => {
    opponentJudges = [accounts[4], accounts[5], accounts[6]];
    try {
      await bet.acceptBet(opponentJudges, {from: opponentAddress, value: minimumDeposit});
      assert(false);
    }
    catch(err){
        assert(err);
    }
  });

  it("Opponent cannot appoint himself/herself as a judge.", async () => {
    opponentJudges = [accounts[4], opponentAddress];
    try {
      await bet.acceptBet(opponentJudges, {from: opponentAddress, value: minimumDeposit});
      assert(false);
    }
    catch(err){
        assert(err);
    }
  });

  it('Cannot accept bet if invested less than minimum deposit.', async () => {
    opponentJudges = [accounts[4], accounts[5]];
    try {
      await bet.acceptBet(opponentJudges, {from: oppponentAddress, value: 1});
      assert(false);
    }
    catch(err){
        assert(err);
    }
  });

  it('Cannot accept same bet more than once.', async () => {
    opponentJudges = [accounts[4], accounts[5]];
    try {
      await bet.acceptBet(opponentJudges, {from: oppponentAddress, value: minimumDeposit});
      await bet.acceptBet(opponentJudges, {from: oppponentAddress, value: minimumDeposit});
      assert(false);
    }
    catch(err){
        assert(err);
    }
  });

  it('Only allows judges to vote', async () => {
    opponentJudges = [accounts[4], accounts[5]];
    try{
        await bet.acceptBet(opponentJudges, {from: oppponentAddress, value: minimumDeposit});
        assert(false);
    }
    catch(err){
        assert(err)
    }
  });
});
