async function main() {
	const [deployer] = await ethers.getSigners();

	// ----------------------
	// Load metadata
	// ----------------------
	const betFactoryJSON = require('../artifacts/contracts/BetFactory.sol/BetFactory.json');
	const betFactoryABI = betFactoryJSON['abi'];
	const betFactoryByteCode = betFactoryJSON['bytecode'];

	const betJSON = require('../artifacts/contracts/Bet.sol/Bet.json');
	const betABI = betJSON['abi'];
	const betByteCode = betJSON['bytecode'];

	const exchangeJSON = require('../artifacts/contracts/Exchange.sol/Exchange.json');
	const exchangeABI = exchangeJSON['abi'];
	const exchangeByteCode = exchangeJSON['bytecode'];

	const mapperJSON = require('../artifacts/contracts/BetMapper.sol/BetMapper.json');
	const mapperABI = mapperJSON['abi'];
	const mapperByteCode = mapperJSON['bytecode'];

	// ----------------------
	// Deploy contracts
	// ----------------------
	console.log('Deploying contracts with the account:', deployer.address);

	console.log('Account balance:', (await deployer.getBalance()).toString());

	const betFactory = new ethers.ContractFactory(
		betFactoryABI,
		betFactoryByteCode,
		deployer
	);
	const deployedFactoryContract = await betFactory.deploy();

	console.log(`Deployed BetFactory at: ${deployedFactoryContract.address}`);

	const bet = new ethers.ContractFactory(betABI, betByteCode, deployer);
	const deployedBetContract = await bet.deploy();

	console.log(`Deployed Bet at: ${deployedBetContract.address}`);

	const exchange = new ethers.ContractFactory(
		exchangeABI,
		exchangeByteCode,
		deployer
	);
	const deployedExchangeContract = await exchange.deploy();

	console.log(`Deployed Exchange at: ${deployedExchangeContract.address}`);

	const betMapper = new ethers.ContractFactory(
		mapperABI,
		mapperByteCode,
		deployer
	);
	const deployedMapperContract = await betMapper.deploy();

	console.log(`Deployed BetMapper at: ${deployedMapperContract.address}`);

	// ----------------------
	// Wire contracts up
	// ----------------------
	await deployedFactoryContract.setBetAddress(deployedBetContract.address);
	await deployedFactoryContract.setExchangeAddress(
		deployedExchangeContract.address
	);
	await deployedFactoryContract.setMapperAddress(
		deployedMapperContract.address
	);
	await deployedMapperContract.setFactory(deployedFactoryContract.address);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
