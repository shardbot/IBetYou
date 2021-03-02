// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IBetFactory} from "./interfaces/IBetFactory.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract BetMapper is Ownable {
    modifier onlyBetContract(address _address) {
        require(
            factory.isBetDeployed(_address),
            "Only bet contract can use this functionality."
        );
        _;
    }

    IBetFactory private factory;

    mapping(address => address[]) addressBets;

    function register(address _address) external onlyBetContract(msg.sender) {
        addressBets[_address].push(msg.sender);
    }

    function getBets(address _address)
        external
        view
        returns (address[] memory)
    {
        return addressBets[_address];
    }

    function setFactory(address _address) external onlyOwner {
        factory = IBetFactory(_address);
    }
}
