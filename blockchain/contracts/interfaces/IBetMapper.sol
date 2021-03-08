// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IBetMapper {
    enum Role {Bettor, Judge}

    function register(address _address, Role _role) external;

    function getBettorBets(address _address)
        external
        view
        returns (address[] memory);

    function getJudgeBets(address _address)
        external
        view
        returns (address[] memory);

    function setFactory(address _address) external;
}
