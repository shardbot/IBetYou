Bet factory: 0x94bdA9F608587b615Cb323CC6095548a5B8d32Ac


For creating a new Bet call method:

let betAddress = await BetFactory.methods.createBet(description, expirationTime).send({ from: accounts[0] });
