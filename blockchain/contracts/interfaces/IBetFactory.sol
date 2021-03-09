// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IBetFactory {
    function isBetDeployed(address _address) external view returns (bool);
}
