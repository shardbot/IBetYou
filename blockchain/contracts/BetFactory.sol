// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';
import {
  ReentrancyGuard
} from '@openzeppelin/contracts/utils/ReentrancyGuard.sol';
import "./Bet.sol";

contract BetFactory is Ownable, ReentrancyGuard {
    event BetDeployed(address _deployedBet);
    //----------------------------------------
    // State variables
    //----------------------------------------
    Bet[] private bets;

    //----------------------------------------
    // Constructor
    //----------------------------------------
    constructor() {}

    //----------------------------------------
    // External functions
    //----------------------------------------
    /**
     * @notice Creates a new Bet
     * @param description Description of the bet
     * @param expirationTime Timestamp when the bet expires/can be judged upon
     */
    function createBet(uint deposit, string memory description, uint expirationTime) external nonReentrant returns(Bet) {
        Bet newBet = new Bet(this.owner(), deposit, description, expirationTime);
        bets.push(newBet);
        emit BetDeployed(newBet);
        return newBet;
    }
    
    function getBets() public view returns  (Bet[] memory) {
        return bets;
    }

}