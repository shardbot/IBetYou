const BetFactory = artifacts.require('BetFactory');
const Bet = artifacts.require("Bet");
const now = new Date()

let opponentAddress
let judges
let expirationTime = Math.round(now.getTime() / 1000) + 10000;
let creatorChoice = true
let minimumDeposit = 100;


let betFactory



contract('BetFactory', (accounts) => {
    beforeEach(async () => {
        betFactory = await BetFactory.deployed() 
    })

    it('Deploys a factory contract.', async () =>{
        judges = [accounts[2], accounts[3]]
        opponentAddress = accounts[1]
        assert(betFactory.address !== '')
    }
    )

    it('Deploys a bet contract.', async () => {
        judges = [accounts[2], accounts[3]]
        opponentAddress = accounts[1]
        await betFactory.createBet(opponentAddress, judges, expirationTime, creatorChoice, {from: accounts[5], value: minimumDeposit})
        const betInstances = await betFactory.getDeployedBets()
        assert(betInstances.length != 0)
    })

    it('Cannot appoint same judge twice', async () => {
        judges = [accounts[2], accounts[2]]
        opponentAddress = accounts[1]
        try{
            await betFactory.createBet(opponentAddress, judges, expirationTime, creatorChoice, {value: minimumDeposit})
            assert(false)
        }
        catch(err){
            assert(err)
        }
    })

    it('Creator cannot appoint himself/herself as a judge.', async () => {
        judges = [accounts[3], accounts[4]]
        opponentAddress = accounts[1]
        try{
            await betFactory.createBet(opponentAddress, judges, expirationTime, creatorChoice, {value: minimumDeposit})
            console.log('success')
            assert(false)
        }
        catch(err){
            console.log(err.message)
            assert(err)
        }
    })

    it('Cannot bet on past event', async () => {
        const secondsInPast = 10000
        const expirationTime = Math.round(now.getTime() / 1000) - secondsInPast

        judges = [accounts[2], accounts[3]]
        opponentAddress = accounts[1]

        try{
            await betFactory.createBet(opponentAddress, judges, expirationTime, creatorChoice, {value: minimumDeposit})
            assert(false)
        }
        catch(err){
            assert(err)
        }
    })
})