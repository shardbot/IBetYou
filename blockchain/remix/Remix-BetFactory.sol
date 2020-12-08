// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

// Libraries
import { Ownable } from 'https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/release-v3.2.0-solc-0.7/contracts/access/Ownable.sol';
import { SafeMath } from 'https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/release-v3.2.0-solc-0.7/contracts/math/SafeMath.sol';
import {
  ReentrancyGuard
} from 'https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/release-v3.2.0-solc-0.7/contracts/utils/ReentrancyGuard.sol';
import "Bet.sol";

contract BetFactory is Ownable, ReentrancyGuard {
   
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
        return newBet;
    }
    
    function getBets() public view returns  (Bet[] memory) {
        return bets;
    }

}