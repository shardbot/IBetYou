// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "./IWETHGateway.sol";

contract AaveDepositWithdraw {
    using SafeERC20 for IERC20;

    IERC20 aWETH = IERC20(0x030bA81f1c18d280636F32af80b9AAd02Cf0854e);

    IWETHGateway gateway =
        IWETHGateway(address(0xDcD33426BA191383f1c9B431A342498fdac73488));

    constructor() {}

    fallback() external payable {}

    // Deposits ETH to AAVE pool
    function depositETH() public {
        gateway.depositETH{value: address(this).balance}(address(this), 0);
    }

    // Withdraws ETH from AAVE pool
    function withdrawETH() public {
        uint256 balance = aWETH.balanceOf(address(this));
        aWETH.safeApprove(address(gateway), balance);
        gateway.withdrawETH(balance, address(this));
    }

    function getETHBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getAWETHBalance() public view returns (uint256) {
        return aWETH.balanceOf(address(this));
    }
}
