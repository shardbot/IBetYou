// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <0.8.0;
pragma experimental ABIEncoderV2;

// Libraries
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {
    ReentrancyGuard
} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./Bet.sol";

contract BetFactory is Ownable, ReentrancyGuard {
    //----------------------------------------
    // State variables
    //----------------------------------------
    Bet[] private bets;

    //----------------------------------------
    // Constructor
    //----------------------------------------
    constructor() {}

    event BetDeployed(address _deployedBet);

    //----------------------------------------
    // External functions
    //----------------------------------------
    /**
     * @notice Creates a new Bet
     * @param description Description of the bet
     * @param expirationTime Timestamp when the bet expires/can be judged upon
     */
    function createBet(
        uint256 deposit,
        string memory description,
        uint256 expirationTime
    ) external nonReentrant returns (Bet) {
        Bet newBet =
            new Bet(this.owner(), deposit, description, expirationTime);
        bets.push(newBet);
        emit BetDeployed(address(newBet));
        return newBet;
    }

    /**
     * @notice Returns an array of all deployed bet instances
     */
    function getBets() public view returns (Bet[] memory) {
        return bets;
    }
}
