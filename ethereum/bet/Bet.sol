// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

contract BetFactory {
    
    address[] public deployedBets;

    function createBet(address opponent, address[] memory judges, uint endTimeSec, bool betsOn) public payable{
        // Vrijeme isteka ugovora mora biti u budućnosti
        require(endTimeSec > block.timestamp);
        address payable bet = payable(address(new Bet(msg.sender, opponent, judges, msg.value, endTimeSec, betsOn)));
        bet.transfer(msg.value);
        deployedBets.push(bet);
    }
    
    function getDeployedBets() public view returns(address[] memory){
        return deployedBets;
    }
}

contract Bet {
    
    bool betIsOver;
    bool betAccepted;
    bool creatorBetsOn;
    uint public startTimeSec;
    uint public endTimeSec;
    uint public judgesCount; // broj koliko svaka strana smije imati sudaca
    uint public votesYes;
    uint public votesNo;
    address[] creatorJudges;
    address[] opponentJudges;
    address public creator;
    address public opponent;
    uint public minimumBet;
    
    mapping(address => bool) public isJudge;
    mapping(address => bool) public didVote;
    mapping(bool => address) public betToAddress;
    
    
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
        betAccepted = false;
        betIsOver = false;
        votesYes = 0;
        votesNo = 0;
    }
    
    receive() external payable{}
    
    // mora biti protivnik
    modifier restricted(){
        require(msg.sender == opponent);
        _;
    }
    
    function addJudges(address[] memory _judges) private{
        require(opponentJudges.length == 0, "You already added judges.");
        opponentJudges = _judges;
        
        // mapiraj suce obje strane
        for(uint i=0; i<judgesCount; i++){
            isJudge[opponentJudges[i]] = true;
            isJudge[creatorJudges[i]] = true;
        }
    }
    
    function acceptBet(address[] memory _judges) public restricted payable{
        // suci moraju biti dodani te protivnik mora platiti minimum
        require(_judges.length == judgesCount, "Number of judges doesn't match your opponent.");
        require(msg.value>=minimumBet, "Insufficient ether sent.");
        require(!betAccepted, "You already accepted bet.");
        // protivnik se kladi na suprotno
        betToAddress[!creatorBetsOn] = opponent; 
        addJudges(_judges);
        betAccepted=true;
    }
    
    function judgeVote(bool vote) public{
        // oklada mora biti prihvacena
        // glasac mora biti sudaca
        // sudac ne smije glasati vise od jednom
        // oklada ne smije biti gotova
        require(betAccepted);
        require(isJudge[msg.sender]);
        require(!didVote[msg.sender]);
        require(!betIsOver);
        
        if(vote){
            votesYes++;
        }
        else{
            votesNo++;
        }
        
        if(votesYes>judgesCount){
            // ako je vise od pola sudaca reklo da
            payable(betToAddress[true]).transfer(address(this).balance);
            betIsOver = true;
        }
        else if(votesNo>judgesCount){
            // ako je vise od pola sudaca reklo ne
            payable(betToAddress[false]).transfer(address(this).balance);
            betIsOver = true;
        }
        else if(votesNo + votesYes == judgesCount*2){
            // ako su svi glasali tj. ako je izjednaceno
            // vrati svakom igracu pola para
            payable(betToAddress[true]).transfer(address(this).balance/2);
            payable(betToAddress[false]).transfer(address(this).balance);
            betIsOver = true;
        }
        // zabiljezi suca da je glasao
        didVote[msg.sender] = true;
    } 
}