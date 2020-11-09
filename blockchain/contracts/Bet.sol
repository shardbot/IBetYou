// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract Bet is AccessControl {

    bytes32 public constant BETTOR_ROLE = keccak256("BET_PARTICIPANT_ROLE");
    bytes32 public constant JUDGE_ROLE = keccak256("JUDGE_ROLE");

    mapping(address => bool) public didVote;
    mapping(address => uint) public numVotes;

    modifier onlyAdmin(address _sender){
        require(hasRole(DEFAULT_ADMIN_ROLE, _sender), "Only admin can call this function.");
        _;
    }

    modifier canJudgeVote {
        require(block.timestamp >= expirationTime, "You can't vote because event didn't happen yet.");
        _;
    }

    modifier minimumBetLimit(uint _value) {
        require(_value >= minimumDeposit, "Insufficient amount of ether sent.");
        _;
    }

    modifier onlyVoteOnce(address _sender) {
        require(!didVote[_sender], "You have already voted.");
        _;
    }

    modifier onlyJudge(address _sender) {
        require(hasRole(JUDGE_ROLE, _sender), "Caller is not a judge.");
        _;
    }

    modifier onlyBettors(address _sender) {
        require(hasRole(BETTOR_ROLE, _sender), "This address doesn't belong to bettors.");
        _;
    }
    
    modifier onlyUniqueJudges(address _sender){
        require(!hasRole(JUDGE_ROLE, _sender) && !hasRole(BETTOR_ROLE, _sender));
        _;
    }

    constructor(address _admin, address _betCreator, uint _minimumDeposit, string memory _description, uint _expirationTime) {
        _setupRole(DEFAULT_ADMIN_ROLE, _admin);
        _setupRole(BETTOR_ROLE, _betCreator);
        description = _description;
        minimumDeposit = _minimumDeposit;
        expirationTime = _expirationTime;
        numVotes[_betCreator] = 0;
    }
    
    receive() external payable{}

    function getBalance() public view returns(uint){
        return address(this).balance;
    }

    function acceptBet() public minimumBetLimit(msg.value) payable{
        _setupRole(BETTOR_ROLE, msg.sender);
        numVotes[msg.sender] = 0;
    }
    
    function addJudge() public onlyUniqueJudges(msg.sender){
        _setupRole(JUDGE_ROLE, msg.sender);
        judgesCount++;
    }

    function judgeVote(address _candidate) public canJudgeVote onlyBettors(_candidate) onlyVoteOnce(msg.sender) onlyJudge(msg.sender){    
        numVotes[_candidate]++;

        if(numVotes[_candidate] > judgesCount/2){
            payable(_candidate).transfer(address(this).balance);
        }
        didVote[msg.sender] = true;
    }

    function adminDecide(address _candidate) public onlyAdmin(msg.sender) {
        payable(_candidate).transfer(address(this).balance);
    }
}