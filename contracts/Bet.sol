// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

contract Bet {
    
    bool creatorChoice;
    uint public creationTime;
    uint public expirationTime;
    uint public judgesCount; 
    uint public votedYes;
    uint public votedNo;
    address[] creatorJudges;
    address[] opponentJudges;
    address public betCreator;
    address public opponent;
    uint public minimumDeposit;
    
    mapping(address => bool) public isJudge;
    mapping(address => bool) public didVote;
    mapping(bool => address) public choiceToAddress;
    
    constructor(address _betCreator, address _opponent, address[] memory _creatorJudges, uint _minimumDeposit, uint _expirationTime, bool _creatorChoice) validExpirationTime(block.timestamp, _expirationTime) onlyUniqueJudges(_betCreator, _creatorJudges){
        betCreator = _betCreator;
        opponent = _opponent;
        creatorJudges = _creatorJudges;
        minimumDeposit = _minimumDeposit;
        expirationTime = _expirationTime;
        creatorChoice = _creatorChoice;
        choiceToAddress[_creatorChoice] = _betCreator;
        judgesCount = _creatorJudges.length;
        creationTime = block.timestamp;
        votedYes = 0;
        votedNo = 0;
    }
    
    receive() external payable{}

    function getBalance() public view returns(uint){
        return address(this).balance;
    }
    
    function acceptBet(address[] memory _opponentJudges) public equalJudgesNumber(_opponentJudges) limitJudges(_opponentJudges) onlyUniqueJudges(opponent, _opponentJudges) minimumBetLimit(msg.value) onlyOpponent(msg.sender) payable{
        choiceToAddress[!creatorChoice] = opponent; 
        opponentJudges = _opponentJudges;
    }
    
    function judgeVote(bool vote) public onlyVoteOnce(msg.sender) onlyJudge(msg.sender){    
        if(vote){
            votedYes++;
        }
        else{
            votedNo++;
        }
        if(votedYes>judgesCount){
            payable(choiceToAddress[true]).transfer(address(this).balance);
        }
        else if(votedNo>judgesCount){
            payable(choiceToAddress[false]).transfer(address(this).balance);
        }
        else if(votedNo + votedYes == judgesCount*2){
            payable(choiceToAddress[true]).transfer(address(this).balance/2);
            payable(choiceToAddress[false]).transfer(address(this).balance);
        }
        didVote[msg.sender] = true;
    } 

    modifier validExpirationTime(uint _blockTime, uint _expirationTime){
        require(_expirationTime > _blockTime, "Invalid bet expiration time.");
        _;
    }

    modifier onlyOpponent(address _opponent){
        require(_opponent == opponent, "You are not allowed to accept this bet.");
        _;
    }
    modifier equalJudgesNumber(address[] memory _judges){
        require(_judges.length == judgesCount, "Number of judges doesn't match your opponent.");
        _;
    }
    
    modifier limitJudges(address[] memory _judges){
        require(opponentJudges.length == 0, "You have already added judges.");
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

    modifier onlyJudge(address _judge){
        require(isJudge[_judge], "Only judges are allowed to vote.");
        _;
    }
    
    modifier onlyUniqueJudges(address _invoker, address[] memory _judges){
        for(uint i=0; i<_judges.length; i++){
            bool judgeCounted = isJudge[_judges[i]];
            require(!judgeCounted, "You have added same judge more than once.");
            require(_judges[i] != _invoker, "You cannot be a judge.");
            isJudge[_judges[i]] = true;
        }
        _;
    }
}