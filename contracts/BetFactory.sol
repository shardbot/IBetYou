// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

import "./Bet.sol";

contract BetFactory {
    
    Bet[] deployedBets;
    address manager;

    event Deployed(
        address _value
    );

    constructor() {
        manager = msg.sender;
    }

    function createBet(address _opponent, address[] memory _judges, uint _endTimeSec, bool _betsOn) public payable timeRestricted(_endTimeSec, block.timestamp){
        Bet bet = new Bet(msg.sender, _opponent, _judges, msg.value, _endTimeSec, _betsOn);
        payable(address(bet)).transfer(msg.value);
        deployedBets.push(bet);
        emit Deployed(address(bet));
    }

    // Cannot bet on past event
    modifier timeRestricted(uint blockTime, uint endTime){
        require(endTime > blockTime);
        _;
    }

    function getDeployedBets() public view returns(Bet[] memory){
        return deployedBets;
    }
}