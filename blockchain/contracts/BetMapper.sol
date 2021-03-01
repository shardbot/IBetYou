// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BetMapper {
    enum Role {BETTOR, JUDGE}

    mapping(address => mapping(Role => address[])) addressBets;

    function registerBettor(address _bettorAddress, address _betAddress)
        external
    {
        addressBets[_bettorAddress][Role.BETTOR].push(_betAddress);
    }

    function registerJudge(address _judgeAddress, address _betAddress)
        external
    {
        addressBets[_judgeAddress][Role.JUDGE].push(_betAddress);
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
}
