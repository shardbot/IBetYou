const BetFactory = artifacts.require('BetFactory');

let opponentAddress
let judges
// random time in future
let endTimeSec = 9603196571 
let betsOn = true


let betFactory
let bet

contract('BetFactory', (accounts) => {
    beforeEach(async () => {
        betFactory = await BetFactory.deployed() 
    })

    it('Deploys a factory contract.', async () =>{
        assert(betFactory.address !== '')
    }
    )

    it('Deploys a bet contract.', async () => {
        judges = [accounts[2], accounts[3]]
        opponentAddress = accounts[1]
        await betFactory.createBet(opponentAddress, judges, endTimeSec, betsOn, {value: 20000})
        const betInstances = await betFactory.getDeployedBets()
        assert(betInstances.length != 0)
    })

    it('Cannot appoint same judge twice', async () => {
        judges = [accounts[2], accounts[2]]
        opponentAddress = accounts[1]
        try{
            await betFactory.createBet(opponentAddress, judges, endTimeSec, betsOn, {value: 20000})
            assert(false)
        }
        catch(err){
            assert(err)
        }
    })

    it('Cannot appoint bet creator as a judge', async () => {
        judges = [accounts[0], accounts[2]]
        opponentAddress = accounts[1]
        try{
            await betFactory.createBet(opponentAddress, judges, endTimeSec, betsOn, {value: 20000})
            assert(false)
        }
        catch(err){
            assert(err)
        }
    })

    it('Cannot bet on past event', async () => {
        const now = new Date()
        const secondsInPast = 10000
        const endTimeSec = Math.round(now.getTime() / 1000) - secondsInPast

        judges = [accounts[2], accounts[3]]
        opponentAddress = accounts[1]

        try{
            await betFactory.createBet(opponentAddress, judges, endTimeSec, betsOn, {value: 20000})
            assert(false)
        }
        catch(err){
            assert(err)
        }
    })
})