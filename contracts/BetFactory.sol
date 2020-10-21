// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

import "./Bet.sol";

contract BetFactory {
    
    Bet[] deployedBets;
    address factoryManager;

    event Deployed(
        address _value
    );

    constructor() {
        factoryManager = msg.sender;
    }

    function createBet(address _opponent, address[] memory _judges, uint _expirationTime, bool _betsOn) public payable{
        Bet bet = new Bet(msg.sender, _opponent, _judges, msg.value, _expirationTime, _betsOn);
        payable(address(bet)).transfer(msg.value);
        deployedBets.push(bet);
        emit Deployed(address(bet));
    }

    function getDeployedBets() public view returns(Bet[] memory){
        return deployedBets;
    }

    function getManager() public view returns(address){
        return factoryManager;
    }
    
}