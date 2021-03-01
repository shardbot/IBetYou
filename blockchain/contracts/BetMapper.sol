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

    enum Role {BETTOR, JUDGE}

    mapping(address => mapping(Role => address[])) addressBets;

    function registerBettor(address _address)
        external
        onlyBetContract(msg.sender)
    {
        addressBets[_address][Role.BETTOR].push(msg.sender);
    }

    function registerJudge(address _address)
        external
        onlyBetContract(msg.sender)
    {
        addressBets[_address][Role.JUDGE].push(msg.sender);
    }

    function getBettingBets(address _address)
        external
        view
        returns (address[] memory)
    {
        return addressBets[_address][Role.BETTOR];
    }

    function getJudgingBets(address _address)
        external
        view
        returns (address[] memory)
    {
        return addressBets[_address][Role.JUDGE];
    }

    function setFactory(address _address) external onlyOwner {
        factory = IBetFactory(_address);
    }
}
