import React, { useState } from "react";
import Web3 from "web3";
import { betFactoryAbi, betAbi } from "./abi/abis";
import "./App.css";

const web3 = new Web3(Web3.givenProvider);
const betFactoryAddr = "0xA6BA44e0b88719c6a91155583d944EE21263329D";
const betFactoryContract = new web3.eth.Contract(betFactoryAbi, betFactoryAddr);

function App() {
	const [admin, setAdmin] = useState("");

	const handleGet = async (e) => {
		e.preventDefault();
		const result = await betFactoryContract.methods.getAdmin().call();
		setAdmin(result);
		console.log(result);
	};
	return (
		<div className="App">
			<header className="App-header">
				<button onClick={handleGet} type="button">
					Get Admin
				</button>
				{admin}
			</header>
		</div>
	);
}

export default App;
