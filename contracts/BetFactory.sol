// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

import "./Bet.sol";

contract BetFactory {
    
    Bet[] deployedBets;
    address manager;
    mapping (address => bool) addressExists;

    event Deployed(
        address _value
    );

    constructor() {
        manager = msg.sender;
    }

    function createBet(address _opponent, address[] memory _judges, uint _endTimeSec, bool _betsOn) public payable restrictJudges(msg.sender, _judges) timeRestricted(block.timestamp, _endTimeSec){
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

    // Cannot appoint same judge twice, creator cannot be judge
    modifier restrictJudges(address _manager, address[] memory _judges){
        for(uint i=0; i<_judges.length; i++){
            require(_judges[i] != _manager);
            require(!addressExists[_judges[i]]);
            addressExists[_judges[i]] = true;
        }
        _;
    }

    function getDeployedBets() public view returns(Bet[] memory){
        return deployedBets;
    }

    function getManager() public view returns(address){
        return manager;
    }
    
}