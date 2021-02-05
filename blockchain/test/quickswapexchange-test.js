const { expect } = require("chai");

describe("QuickSwapExchangeTest", function() {
  it("Should return max amount of DAI for given ETH", async function() {
    const etherAmount = 100;
    const QuickSwapExchangeTest = await ethers.getContractFactory("QuickSwapExchangeTest");
    const quickSwapExchangeTest = await QuickSwapExchangeTest.deploy();
    
    await quickSwapExchangeTest.deployed();
    expect(await quickSwapExchangeTest.getEstimatedDAIforETH(etherAmount)).to.be.an('array').that.is.not.empty;
  });
});