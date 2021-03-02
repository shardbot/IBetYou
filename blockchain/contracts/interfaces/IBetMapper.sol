// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IBetMapper {
    function register(address _address) external;

    function getBets(address _address) external view returns (address[] memory);

    function setFactory(address _address) external;
}
