// Libs
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545/');

// Abis
const providerABI = require('./abi/LendingPoolProviderABI.json');
const lendingPoolABI = require('./abi/LendingPoolABI.json');
const ERC20ABI = require('./abi/ERC20.json');

const unlockedAccount = '...'; // find rich account on etherscan and unlock it with ganache
const ethAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

// Create the LendingPoolAddressProvider contract instance
const getLendingPoolAddressProviderContract = () => {
	const lpAddressProviderAddress = '0x24a42fD28C976A61Df5D00D0599C34c4f90748c8';
	const lpAddressProviderContract = new web3.eth.Contract(providerABI, lpAddressProviderAddress);
	return lpAddressProviderContract;
};

// Get the latest LendingPoolCore address
const getLendingPoolCoreAddress = async () => {
	const lpCoreAddress = await getLendingPoolAddressProviderContract()
		.methods.getLendingPoolCore()
		.call()
		.catch((e) => {
			throw Error(`Error getting lendingPool address: ${e.message}`);
		});

	console.log('LendingPoolCore address: ', lpCoreAddress);
	return lpCoreAddress;
};

// Get the latest LendingPool address
const getLendingPoolAddress = async () => {
	const lpAddress = await getLendingPoolAddressProviderContract()
		.methods.getLendingPool()
		.call()
		.catch((e) => {
			throw Error(`Error getting lendingPool address: ${e.message}`);
		});
	console.log('LendingPool address: ', lpAddress);
	return lpAddress;
};

/**
 * Deposit ETH into Aave to receive the equivalent aETH
 * Note: User must have ETH already in their wallet!
 */
const deposit = async () => {
	const ethAmountinWei = web3.utils.toWei('10', 'ether').toString();
	const referralCode = '0';
	try {
		const lpCoreAddress = await getLendingPoolCoreAddress();

		// Approve the LendingPoolCore address with the ETH contract
		const ethContract = new web3.eth.Contract(ERC20ABI, ethAddress);
		await ethContract.methods
			.approve(lpCoreAddress, ethAmountinWei)
			.send({
				from: unlockedAccount,
				gasLimit: web3.utils.toHex(60000),
				gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
			})
			.catch((e) => {
				throw Error(`Error approving ETH allowance: ${e.message}`);
			});

		// Make the deposit transaction via LendingPool contract
		const lpAddress = await getLendingPoolAddress();
		const lpContract = new web3.eth.Contract(lendingPoolABI, lpAddress);
		await lpContract.methods
			.deposit(ethAddress, ethAmountinWei, referralCode)
			.send({
				from: unlockedAccount,
				value: ethAmountinWei,
				gasLimit: web3.utils.toHex(250000),
				gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
			})
			.catch((e) => {
				throw Error(`Error depositing to the LendingPool contract: ${e.message}`);
			});
	} catch (e) {
		console.log(e.message);
	}
};

const test = async () => {
	const initial_balance = await web3.eth.getBalance(unlockedAccount);
	console.log(`Initial unlocked account balance: ${initial_balance}`);
	deposit().then(async () => {
		const balance_after = await web3.eth.getBalance(unlockedAccount);
		console.log(`Balance after depositing to AAVE: ${balance_after}`);
	});
};

test();
