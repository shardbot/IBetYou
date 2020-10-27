// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./Bet.sol";

contract BetFactory is AccessControl{
    Bet[] deployedBets;
    bytes32 public constant JUDGE_ROLE = keccak256("JUDGE_ROLE");

    event Deployed(
        address _value
    );

    modifier onlyAdmin(address _sender){
        require(hasRole(DEFAULT_ADMIN_ROLE, _sender), "Caller is not an admin");
        _;
    }

    modifier equalArrayLength(address[] memory array1, address[] memory array2){
        require(array1.length == array2.length);
        _;
    }

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function createBet(string memory _betCreatorName, address _opponent, address[] memory _judges, uint _expirationTime) public payable returns(address){
        address _admin = getAdmin();
        Bet bet = new Bet(address(this), _admin, msg.sender, _betCreatorName, _opponent, _judges, msg.value, _expirationTime);
        payable(address(bet)).transfer(msg.value);
        deployedBets.push(bet);
        emit Deployed(address(bet));
        return(address(bet));
    }

    function getDeployedBets() public view onlyAdmin(msg.sender) returns(Bet[] memory){
        return deployedBets;
    }

    // Only admin can call this?
    function getAdmin() public view returns(address){
        return this.getRoleMember(DEFAULT_ADMIN_ROLE, 0);
    }
    
    function isJudge(address _judge) public view returns(bool){
        return this.hasRole(JUDGE_ROLE, _judge);
    }

    function addJudges(address[] memory _judges) public onlyAdmin(msg.sender){
        for(uint i=0; i<_judges.length; i++){
            _setupRole(JUDGE_ROLE, _judges[i]);
        }
    }
}