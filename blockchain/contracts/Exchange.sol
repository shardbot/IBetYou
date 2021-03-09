// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import {
    ReentrancyGuard
} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IQuickSwapRouter02.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Exchange is ReentrancyGuard {
    address public constant maUSDC =
        address(0x9719d867A500Ef117cC201206B8ab51e794d3F82);
    address public constant USDC =
        address(0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174);
    address public constant MATIC =
        address(0x0000000000000000000000000000000000001010);

    IQuickSwapRouter02 router =
        IQuickSwapRouter02(0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff);

    constructor() {}

    /**
     * @notice Swaps MATIC(ETH) tokens for maUSDC tokens
     * @param _unixTime If transaction is not mined and unixTime has expire, transaction will revert
     */
    function swapMaticForMaUSDC(uint256 _unixTime) public payable nonReentrant {
        router.swapExactETHForTokens{value: msg.value}(
            0,
            _createPath(router.WETH(), USDC),
            address(this),
            _unixTime
        );

        uint256 USDCAmount = _getTokenBalance(address(this), USDC);
        IERC20(USDC).approve(address(router), USDCAmount);
        router.swapExactTokensForTokens(
            USDCAmount,
            0,
            _createPath(USDC, maUSDC),
            msg.sender,
            _unixTime
        );
    }

    /**
     * @notice Swaps maUSDC tokens for MATIC(ETH) tokens
     * @param _unixTime If transaction is not mined and unixTime has expire, transaction will revert
     */
    function swapMaUSDCForMatic(uint256 _unixTime) public nonReentrant {
        uint256 maUSDCAmount = _getTokenBalance(msg.sender, maUSDC);
        IERC20(maUSDC).transferFrom(msg.sender, address(this), maUSDCAmount);
        IERC20(maUSDC).approve(address(router), maUSDCAmount);
        router.swapExactTokensForTokens(
            maUSDCAmount,
            0,
            _createPath(maUSDC, USDC),
            address(this),
            _unixTime
        );

        uint256 USDCAmount = _getTokenBalance(address(this), USDC);
        IERC20(USDC).approve(address(router), USDCAmount);
        router.swapExactTokensForETH(
            USDCAmount,
            0,
            _createPath(USDC, router.WETH()),
            msg.sender,
            _unixTime
        );
    }

    /**
     * @notice Returns token balance of an address
     * @param _target address of token bearer
     * @param _token address of a token
     */
    function _getTokenBalance(address _target, address _token)
        internal
        view
        returns (uint256)
    {
        return IERC20(_token).balanceOf(_target);
    }

    /**
     * @notice Returns trade route for a token exchange
     * @param _address1 address of starting token (input)
     * @param _address2 address of output token
     */
    function _createPath(address _address1, address _address2)
        internal
        pure
        returns (address[] memory)
    {
        address[] memory path = new address[](2);
        path[0] = _address1;
        path[1] = _address2;

        return path;
    }
}
