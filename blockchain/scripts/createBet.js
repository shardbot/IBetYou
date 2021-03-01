async function main() {
	const [deployer] = await ethers.getSigners();

	console.log(`Deployer: ${deployer}`);

	const betFactoryJSON = require('../artifacts/contracts/BetFactory.sol/BetFactory.json');
	const betFactoryABI = betFactoryJSON['abi'];
	const betFactoryByteCode = betFactoryJSON['bytecode'];

	console.log('Deploying contracts with the account:', deployer.address);

	console.log('Account balance:', (await deployer.getBalance()).toString());

	const betFactory = new ethers.ContractFactory(betFactoryABI, betFactoryByteCode, deployer);
	const deployedContract = await betFactory.deploy();

	console.log(`Deployed contract at: ${deployedContract.address}`);

}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
