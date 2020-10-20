// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

contract Bet {
    
    bool isBetOver;
    bool isBetAccepted;
    bool creatorBetsOn;
    uint public startTimeSec;
    uint public endTimeSec;
    uint public judgesCount; 
    uint public votedYes;
    uint public votedNo;
    address[] creatorJudges;
    address[] opponentJudges;
    address public creator;
    address public opponent;
    uint public minimumBet;
    
    mapping(address => bool) public isJudge;
    mapping(address => bool) public didVote;
    mapping(bool => address) public betToAddress;
    mapping(address => bool) addressExists;
    
    constructor(address _creator, address _opponent, address[] memory _judges, uint _minimumBet, uint _endTimeSec, bool _creatorBetsOn){
        creator = _creator;
        opponent = _opponent;
        creatorJudges = _judges;
        minimumBet = _minimumBet;
        endTimeSec = _endTimeSec;
        creatorBetsOn = _creatorBetsOn;
        betToAddress[_creatorBetsOn] = creator;
        
        judgesCount = _judges.length;
        startTimeSec = block.timestamp;
        isBetAccepted = false;
        isBetOver = false;
        votedYes = 0;
        votedNo = 0;
    }
    
    receive() external payable{}
    
    modifier onlyOpponent(){
        require(msg.sender == opponent);
        _;
    }
    modifier equalJudgesNumber(address[] memory _judges){
        require(_judges.length == judgesCount, "Number of judges doesn't match your opponent.");
        _;
    }
    modifier limitJudges(address[] memory _judges){
        require(opponentJudges.length == 0, "You already added judges.");
        _;
    }

    modifier minimumBetLimit{
        require(msg.value>=minimumBet, "Insufficient ether sent.");
        _;
    }

    modifier betAlreadyAccepted{
        require(!isBetAccepted, "You already accepted bet.");
        _;
    }

    modifier betNotAccepted{
        require(isBetAccepted, "Bet is not accepted.");
        _;
    }

    modifier onlyVoteOnce{
        require(!didVote[msg.sender], "You have already voted.");
        _;
    }

    modifier onlyJudge{
        require(isJudge[msg.sender], "Only judges are allowed.");
        _;
    }

    modifier betNotOver{
        require(!isBetOver, "This bet has already ended.");
        _;
    }
    
    // Cannot appoint same judge twice, creator cannot be judge
    modifier restrictJudges(address _manager, address[] memory _judges){
        for(uint i=0; i<_judges.length; i++){
            require(_judges[i] != _manager);
            require(!isJudge[_judges[i]]);
            isJudge[_judges[i]] = true;
            isJudge[creatorJudges[i]] = true;
        }
        _;
    }

    function addJudges(address[] memory _judges) private limitJudges(_judges) restrictJudges(opponent, _judges){
        opponentJudges = _judges;
    }
    
    function acceptBet(address[] memory _judges) public equalJudgesNumber(_judges) minimumBetLimit betAlreadyAccepted onlyOpponent payable{
        betToAddress[!creatorBetsOn] = opponent; 
        addJudges(_judges);
        isBetAccepted=true;
    }
    
    function judgeVote(bool vote) public betNotAccepted onlyVoteOnce onlyJudge betNotOver{ 
        if(vote){
            votedYes++;
        }
        else{
            votedNo++;
        }
        
        if(votedYes>judgesCount){
            payable(betToAddress[true]).transfer(address(this).balance);
            isBetOver = true;
        }
        else if(votedNo>judgesCount){
            payable(betToAddress[false]).transfer(address(this).balance);
            isBetOver = true;
        }
        else if(votedNo + votedYes == judgesCount*2){
            payable(betToAddress[true]).transfer(address(this).balance/2);
            payable(betToAddress[false]).transfer(address(this).balance);
            isBetOver = true;
        }
        didVote[msg.sender] = true;
    } 
}