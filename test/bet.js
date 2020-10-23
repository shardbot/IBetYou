const Bet = artifacts.require("Bet");
const now = new Date();
const betCreatorName = "Satoshi";
const betTakerName = "Hal";

let betTaker;
let betTakerJudges;
let betCreatorJudges;
let expirationTime;
let minimumDeposit;
let bet;
// admin is factory owner
let admin;

contract("Bet", (accounts) => {
  beforeEach(async () => {
    admin = accounts[0];
    betCreator = accounts[1];
    betTaker = accounts[2];
    betCreatorJudges = [accounts[3], accounts[4]];
    betTakerJudges = [accounts[5], accounts[6]];
    expirationTime = Math.round(now.getTime() / 1000);
    minimumDeposit = 100;
    bet = await Bet.new(
      admin,
      betCreator,
      betCreatorName,
      betTaker,
      betCreatorJudges,
      minimumDeposit,
      expirationTime
    );
  });
  it("Successfully deployed a bet instance.", async () => {
    assert.ok(bet.address);
  });
  it("Can't assign more than two judges.", async () => {
    betCreatorJudges = [accounts[3], accounts[4], accounts[5]];
    try {
      bet = await Bet.new(
        betCreator,
        betCreator,
        betCreatorName,
        betTaker,
        betCreatorJudges,
        minimumDeposit,
        expirationTime
      );
      assert.fail();
    } catch (error) {
      const msgexist = error.message.search("revert") >= 0;
      assert.ok(msgexist);
    }
  });
  it("Only pre defined bet taker can accept bet.", async () => {
    const notOpponentAddress = accounts[6];
    try {
      await bet.acceptBet(betTakerJudges, betTakerName, {
        from: notOpponentAddress,
        value: minimumDeposit,
      });
      assert.fail();
    } catch (error) {
      const msgexist = error.message.search("revert") >= 0;
      assert.ok(msgexist);
    }
  });
  it("Only accepts bet if value sent is greater or equal to minimum deposit.", async () => {
    const unacceptableValue = minimumDeposit - 100;
    try {
      await bet.acceptBet(betTakerJudges, betTakerName, {
        from: betTaker,
        value: unacceptableValue,
      });
      assert.fail();
    } catch (error) {
      const msgexist = error.message.search("revert") >= 0;
      assert.ok(msgexist);
    }
  });
  it("Can't add judges twice to same bet eg. can't accept same bet twice.", async () => {
    try {
      await bet.acceptBet(betTakerJudges, betTakerName, {
        from: betTaker,
        value: minimumDeposit,
      });
      await bet.acceptBet(betTakerJudges, betTakerName, {
        from: betTaker,
        value: minimumDeposit,
      });
      assert.fail();
    } catch (error) {
      const msgexist = error.message.search("revert") >= 0;
      assert.ok(msgexist);
    }
  });
  it("Only allows judges to vote", async () => {
    const notJudge = accounts[6];
    try {
      await bet.judgeVote(betCreator, { from: notJudge });
      assert.fail();
    } catch (error) {
      const msgexist = error.message.search("revert") >= 0;
      assert.ok(msgexist);
    }
  });
  it("Judge can't vote if event didn't happen yet.", async () => {
    expirationTime += 1000;
    bet = await Bet.new(
      admin,
      betCreator,
      betCreatorName,
      betTaker,
      betCreatorJudges,
      minimumDeposit,
      expirationTime
    );
    try {
      await bet.judgeVote(betCreator, { from: betCreatorJudges[0] });
      assert.fail();
      creator;
    } catch (error) {
      const msgexist = error.message.search("revert") >= 0;
      assert.ok(msgexist);
    }
  });
  it("Same judge can't vote twice on a same bet.", async () => {
    try {
      await bet.judgeVote(betCreator, { from: betCreatorJudges[0] });
      await bet.judgeVote(betCreator, { from: betCreatorJudges[0] });
      assert.fail();
    } catch (error) {
      const msgexist = error.message.search("revert") >= 0;
      assert.ok(msgexist);
    }
  });
  it("Judge can only vote for bettors.", async () => {
    const notCandidate = accounts[6];
    try {
      await bet.judgeVote(notCandidate, { from: betCreatorJudges[0] });
      assert.fail();
    } catch (error) {
      const msgexist = error.message.search("revert") >= 0;
      assert.ok(msgexist);
    }
  });
  it("Ends bet when one of the bettors has more than half of all judges votes.", async () => {
    await bet.acceptBet(betTakerJudges, betTakerName, {
      from: betTaker,
      value: minimumDeposit,
    });
    await bet.judgeVote(betCreator, { from: betCreatorJudges[0] });
    await bet.judgeVote(betCreator, { from: betCreatorJudges[1] });
    await bet.judgeVote(betCreator, { from: betTakerJudges[0] });
    const isBetOver = await bet.betOver();
    assert.ok(isBetOver);
  });
});
