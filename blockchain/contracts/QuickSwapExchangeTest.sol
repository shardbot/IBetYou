// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <0.8.0;

import "./interfaces/IQuickSwapRouter02.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract QuickSwapExchangeTest {
    IQuickSwapRouter02 quickSwapRouterV2 =
        IQuickSwapRouter02(0xFCB5348111665Cf95a777f0c4FCA768E05601760);
    address maDAI = address(0xE0b22E0037B130A9F56bBb537684E6fA18192341);

    constructor() {}

    receive() external payable {}

    function swapETHMaDAI(uint256 daiAmount) public payable {
        address[] memory path = new address[](2);
        path[0] = quickSwapRouterV2.WETH();
        path[1] = maDAI;
        quickSwapRouterV2.swapETHForExactTokens{value: msg.value}(
            daiAmount,
            path,
            address(this),
            block.timestamp
        );
    }

    function maDAIBalanceUser() public view returns (uint256) {
        return IERC20(maDAI).balanceOf(msg.sender);
    }

    function maDAIBalanceContract() public view returns (uint256) {
        return IERC20(maDAI).balanceOf(address(this));
    }
}
