// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IBetMapper {
    enum Role {BETTOR, JUDGE}

    function registerBettor(address _bettorAddress, address _betAddress)
        external;

    function registerJudge(address _judgeAddress, address _betAddress) external;

    function getBettingBets(address _address)
        external
        view
        returns (address[] memory);

    function getJudgingBets(address _address)
        external
        view
        returns (address[] memory);
}
