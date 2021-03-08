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

    enum Role {Bettor, Judge}

    IBetFactory private factory;

    mapping(address => mapping(Role => address[])) addressRoleBets;

    function register(address _address, Role _role)
        external
        onlyBetContract(msg.sender)
    {
        addressRoleBets[_address][_role].push(msg.sender);
    }

    function getBettorBets(address _address)
        external
        view
        returns (address[] memory)
    {
        return addressRoleBets[_address][Role.Bettor];
    }

    function getJudgeBets(address _address)
        external
        view
        returns (address[] memory)
    {
        return addressRoleBets[_address][Role.Judge];
    }

    function setFactory(address _address) external onlyOwner {
        factory = IBetFactory(_address);
    }
}
