// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IQuickSwapRouter02.sol";

contract QuickSwapExchangeTest {
    IQuickSwapRouter02 router =
        IQuickSwapRouter02(0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff);

    address public maUSDC = address(0x9719d867A500Ef117cC201206B8ab51e794d3F82);
    address public QUICK = address(0x831753DD7087CaC61aB5644b308642cc1c33Dc13);
    address public MATIC = address(0x0000000000000000000000000000000000001010);

    address public WETH;
    address public factory;

    address private owner;

    receive() external payable {}

    constructor() payable {
        owner = msg.sender;
        WETH = router.WETH();
        factory = router.factory();
    }

    function swapEthForMaUSDC(uint256 unixTime) public {
        address[] memory path1 = _createPath(WETH, QUICK);
        address[] memory path2 = _createPath(QUICK, maUSDC);

        router.swapExactETHForTokens{value: address(this).balance / 2}(
            0,
            path1,
            address(this),
            unixTime
        );

        uint256 QUICKAmount = getTokenBalance(address(this), QUICK);
        IERC20(QUICK).approve(address(router), QUICKAmount);
        router.swapExactTokensForTokens(
            QUICKAmount,
            0,
            path2,
            address(this),
            unixTime
        );
    }

    function swapMaUSDCForEth(uint256 unixTime) public {
        address[] memory path1 = _createPath(maUSDC, QUICK);
        address[] memory path2 = _createPath(QUICK, WETH);

        uint256 maUSDCAmount = getTokenBalance(address(this), maUSDC);
        IERC20(maUSDC).approve(address(router), maUSDCAmount);
        router.swapExactTokensForTokens(
            maUSDCAmount,
            0,
            path1,
            address(this),
            unixTime
        );

        uint256 QUICKAmount = getTokenBalance(address(this), QUICK);
        IERC20(QUICK).approve(address(router), QUICKAmount);
        router.swapExactTokensForETH(
            QUICKAmount,
            0,
            path2,
            address(this),
            unixTime
        );
    }

    function sendEthToOwner() public {
        payable(owner).transfer(address(this).balance);
    }

    function getTokenBalance(address target, address token)
        public
        view
        returns (uint256)
    {
        return IERC20(token).balanceOf(target);
    }

    function _createPath(address address1, address address2)
        private
        pure
        returns (address[] memory)
    {
        address[] memory path = new address[](2);
        path[0] = address1;
        path[1] = address2;

        return path;
    }
}
