// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IExchange {
    function swapMaticForMaUSDC(uint256 _unixTime) external payable;

    function swapMaUSDCForMatic(uint256 _unixTime) external;
}
