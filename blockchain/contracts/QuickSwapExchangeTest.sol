// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IQuickSwapRouter02.sol";

contract QuickSwapExchangeTest {
    IQuickSwapRouter02 router =
        IQuickSwapRouter02(0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff);

    address public maDAI = address(0xE0b22E0037B130A9F56bBb537684E6fA18192341);
    address public matic = address(0x0000000000000000000000000000000000001010);
    address public DAI = address(0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063);

    address public WETH;
    address public factory;

    constructor() {
        WETH = router.WETH();
        factory = router.factory();
    }

    receive() external payable {}

    function swapEthForMaDai(uint256 unixTime)
        public
        payable
        returns (uint256)
    {
        address[] memory path = new address[](2);
        path[0] = WETH;
        path[1] = DAI;
        path[2] = maDAI;

        uint256 amountOutMin = getEstimatedMaDAIforETH(msg.value)[0];
        // replace block.timestamp -- use time from frontend!
        uint256[] memory amounts =
            router.swapExactETHForTokens{value: msg.value}(
                amountOutMin,
                path,
                msg.sender,
                unixTime
            );
        uint256 outputTokenCount = uint256(amounts[amounts.length - 1]);

        return outputTokenCount;
    }

    function swapEthForDai(uint256 unixTime) public payable returns (uint256) {
        address[] memory path = new address[](2);
        path[0] = WETH;
        path[1] = DAI;

        uint256 amountOutMin = getEstimatedDAIforETH(msg.value)[0];
        // replace block.timestamp -- use time from frontend!
        uint256[] memory amounts =
            router.swapExactETHForTokens{value: msg.value}(
                amountOutMin,
                path,
                msg.sender,
                unixTime
            );
        uint256 outputTokenCount = uint256(amounts[amounts.length - 1]);

        return outputTokenCount;
    }

    function getEstimatedDAIforETH(uint256 _ethAmount)
        public
        view
        returns (uint256[] memory)
    {
        address[] memory path = new address[](2);
        path[0] = DAI;
        path[1] = WETH;
        return router.getAmountsIn(_ethAmount, path);
    }

    function getEstimatedMaDAIforETH(uint256 _ethAmount)
        public
        view
        returns (uint256[] memory)
    {
        address[] memory path = new address[](2);
        path[0] = maDAI;
        path[1] = WETH;

        return router.getAmountsIn(_ethAmount, path);
    }

    function getMaDAIBalance(address _address) public view returns (uint256) {
        return IERC20(maDAI).balanceOf(_address);
    }

    function getDAIBalance(address _address) public view returns (uint256) {
        return IERC20(DAI).balanceOf(_address);
    }

    function getMaticBalance(address _address) public view returns (uint256) {
        return _address.balance;
    }
}
