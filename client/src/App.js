import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { betFactoryAbi, betAbi } from "./abi/abis";
import "./App.css";

const web3 = new Web3(Web3.givenProvider);
const betFactoryAddr = "0xB1c4d1De4d0139ADa082526081B07a70b141FEF2";
const betFactoryContract = new web3.eth.Contract(betFactoryAbi, betFactoryAddr);

function App() {
	const [refreshBets, setRefreshBets] = useState(false);
	const [deployedBets, setDeployedbets] = useState([]);
	useEffect(() => {
		async function fetchData() {
			const response = await betFactoryContract.methods
				.getDeployedBets()
				.call();
			setDeployedbets(response);
		}
		fetchData();
		setRefreshBets(false);
	}, [refreshBets]);

	const [accounts, setAccounts] = useState([]);
	useEffect(() => {
		async function fetchData() {
			setAccounts(await web3.eth.getAccounts());
			window.ethereum.on("accountsChanged", async function () {
				setAccounts(await web3.eth.getAccounts());
			});
		}
		fetchData();
	}, []);

	const [admin, setAdmin] = useState("");
	useEffect(() => {
		async function fetchData() {
			const response = await betFactoryContract.methods.getAdmin().call();
			setAdmin(response);
		}
		fetchData();
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(accounts);
		betFactoryContract.methods
			.createBet(
				"Marko",
				"0x23d87A5Aa4f67cD83d5E8958ce2E6bBedACA5a2e",
				[
					"0xACe55F5Ba05cE92643D38dBc85C3758F4E023582",
					"0x47309ae4443B51c5B95dAb207eAB3712161582b7",
				],
				9603740299
			)
			.send({ from: accounts[0], value: 2000000000 });
		setRefreshBets(true);
	};

	return (
		<div className="App">
			<header className="App-header">
				<h3>Accounts: {accounts}</h3>
				<h3>Admin: {admin}</h3>
				<h3>Latest deployed bet: {deployedBets.slice(-1)}</h3>
			</header>
			<button onClick={handleSubmit}>Deploy bet</button>
		</div>
	);
}

export default App;
