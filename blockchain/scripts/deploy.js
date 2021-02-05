async function main() {
	const [deployer] = await ethers.getSigners();
	const signer = ethers.provider.getSigner();

	console.log(`Deployer: ${deployer}`);
	console.log(`Signer: ${signer}`);

	const quickSwapTestJSON = require('../artifacts/contracts/QuickSwapExchangeTest.sol/QuickSwapExchangeTest.json');
	const quickSwapTestABI = quickSwapTestJSON['abi'];
	const quickSwapByteCode = quickSwapTestJSON['bytecode'];

	console.log('Deploying contracts with the account:', deployer.address);

	console.log('Account balance:', (await deployer.getBalance()).toString());

	const quickSwapTestFactory = new ethers.ContractFactory(quickSwapTestABI, quickSwapByteCode, deployer);
	const deployedContract = await quickSwapTestFactory.deploy();
	
	console.log(`Deployed contract at: ${deployedContract.address}`);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
