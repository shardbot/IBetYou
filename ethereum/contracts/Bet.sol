// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

import "@openzeppelin/contracts/access/AccessControl.sol";

/*
Check if judges are unique
Check if any of judges is bet creator or bet taker
 */
 
contract Bet is AccessControl{

    struct Bettor {
        string name;
        uint votes;
    }

    uint public constant MAX_JUDGES = 2;
    uint public constant MIN_JUDGES = 1;

    uint public expirationTime;
    uint public minimumDeposit;
    uint public creatorJudgesCount;

    bool public betOver = false;
    
    bytes32 public constant BET_CREATOR_ROLE = keccak256("BET_CREATOR_ROLE");
    bytes32 public constant BET_TAKER_ROLE = keccak256("BET_TAKER_ROLE");
    bytes32 public constant JUDGE_ROLE = keccak256("JUDGE_ROLE");

    mapping(address => bool) public didVote;
    mapping(address => Bettor) public bettors;

    modifier canJudgeVote{
        require(block.timestamp >= expirationTime, "You can't vote because event didn't happen yet.");
        _;
    }

    modifier limitJudgesCreator(address[] memory _judges){
        require(_judges.length <= MAX_JUDGES && _judges.length >= MIN_JUDGES, "You have to assign at least one judge and two at most.");
        _;
    }

    modifier limitJudgesBetTaker(address[] memory _judges){
        require(_judges.length == creatorJudgesCount, "Number of judges you assigned must match opponent's.");
        _;
    }

    modifier onlyBetTaker(address _sender){
        require(hasRole(BET_TAKER_ROLE, _sender), "Caller is not a bet taker");
        _;
    }
    
    modifier restrictJudges(address[] memory _judges){
        uint judgesLength = this.getRoleMemberCount(JUDGE_ROLE);
        require(judgesLength == _judges.length, "You have already added judges.");
        _;
    }

    modifier minimumBetLimit(uint _value){
        require(_value >= minimumDeposit, "Insufficient amount of ether sent.");
        _;
    }

    modifier onlyVoteOnce(address _judge){
        require(!didVote[_judge], "You have already voted.");
        _;
    }

    modifier onlyJudge(address _sender){
        require(hasRole(JUDGE_ROLE, _sender), "Caller is not a judge.");
        _;
    }

    modifier onlyBettors(address _sender){
        require(hasRole(BET_TAKER_ROLE, _sender) || hasRole(BET_CREATOR_ROLE, _sender), "This address doesn't belong to bettors.");
        _;
    }

    constructor(address _admin, address _betCreator, string memory _betCreatorName, address _opponent, address[] memory _creatorJudges, uint _minimumDeposit, uint _expirationTime) limitJudgesCreator(_creatorJudges){
        _setupRole(DEFAULT_ADMIN_ROLE, _admin);
        _setupRole(BET_CREATOR_ROLE, _betCreator);
        _setupRole(BET_TAKER_ROLE, _opponent);
        setupJudgeRole(_creatorJudges);
        
        bettors[_betCreator] = Bettor({
                name: _betCreatorName,
                votes: 0
            });

        minimumDeposit = _minimumDeposit;
        expirationTime = _expirationTime;
        creatorJudgesCount = _creatorJudges.length;
    }
    
    receive() external payable{}

    function getBalance() public view returns(uint){
        return address(this).balance;
    }

    function setupJudgeRole(address[] memory _judges) private{
        for(uint i=0; i<_judges.length; i++){
            _setupRole(JUDGE_ROLE, _judges[i]);
        }
    }
    
    function acceptBet(address[] memory _opponentJudges, string memory _betTakerName) public restrictJudges(_opponentJudges) limitJudgesBetTaker(_opponentJudges) minimumBetLimit(msg.value) onlyBetTaker(msg.sender) payable{
        address _betTaker = this.getRoleMember(BET_TAKER_ROLE, 0); 
        bettors[_betTaker] = Bettor({
                name: _betTakerName,
                votes: 0
            });
        setupJudgeRole(_opponentJudges);
    }
    
    function judgeVote(address _candidate) public canJudgeVote onlyBettors(_candidate) onlyVoteOnce(msg.sender) onlyJudge(msg.sender){    
        bettors[_candidate].votes++;

        if(bettors[_candidate].votes > creatorJudgesCount){
            payable(_candidate).transfer(address(this).balance);
            betOver = true;
        }
        didVote[msg.sender] = true;
    }
    
}