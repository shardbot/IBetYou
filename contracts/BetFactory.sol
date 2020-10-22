// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./Bet.sol";

contract BetFactory is AccessControl{
    Bet[] deployedBets;

    event Deployed(
        address _value
    );

    modifier onlyAdmin(address _sender){
        require(hasRole(DEFAULT_ADMIN_ROLE, _sender), "Caller is not an admin");
        _;
    }

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function createBet(string memory _betCreatorName, address _opponent, address[] memory _judges, uint _expirationTime) public payable{
        address _admin = getAdmin();
        Bet bet = new Bet(_admin, msg.sender, _betCreatorName, _opponent, _judges, msg.value, _expirationTime);
        payable(address(bet)).transfer(msg.value);
        deployedBets.push(bet);
        emit Deployed(address(bet));
    }

    function getDeployedBets() public view onlyAdmin(msg.sender) returns(Bet[] memory){
        return deployedBets;
    }

    // Only admin can call this?
    function getAdmin() public view returns(address){
        return this.getRoleMember(DEFAULT_ADMIN_ROLE, 0);
    }
    
}