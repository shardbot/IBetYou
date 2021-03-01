// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IBetMapper {
    enum Role {BETTOR, JUDGE}

    function registerBettor(address _address) external;

    function registerJudge(address _address) external;

    function getBettingBets(address _address)
        external
        view
        returns (address[] memory);

    function getJudgingBets(address _address)
        external
        view
        returns (address[] memory);

    function setFactory(address _address) external;
}
