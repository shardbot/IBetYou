pragma solidity <=0.7.3;

contract BetFactory {
    
    address[] public deployedBets;

    function createBet(address opponent, uint minimumBet, uint endTimeSec, uint judgesCount) public payable{
        require(msg.value >= minimumBet);
        require(endTimeSec > block.timestamp);
        require(judgesCount>0);

        address payable betAddress = payable(address(new Bet(msg.sender, opponent, minimumBet, endTimeSec, judgesCount)));
        betAddress.transfer(msg.value);
        deployedBets.push(betAddress);
    }
    
    function getDeployedBets() public view returns(address[] memory){
        return deployedBets;
    }
}

contract Bet {
    
    bool betAccepted;

    uint public startTimeSec;
    uint public endTimeSec;
    uint public judgesCount;
    uint public minimumBet;

    address public creator;
    address public opponent;    
    
    mapping(address => uint) public judgesAvailable;
    mapping(address => bool) public isJudge;
    
    
    
    constructor(address _creator, address _opponent, uint _minimumBet, uint _endTimeSec, uint _judgesCount){
        startTimeSec = block.timestamp;
        
        creator = _creator;
        opponent = _opponent;
        minimumBet = _minimumBet;
        endTimeSec = _endTimeSec;
        judgesCount = _judgesCount;
        
        // koliko još sudaca imaju na raspolaganju
        judgesAvailable[creator] = _judgesCount;
        judgesAvailable[opponent] = _judgesCount;
        betAccepted = false;
    }
    
    receive() external payable{}
    
    modifier restricted(){
        require(msg.sender == opponent);
        _;
    }
    
    function addJudges(address[] memory _judges) public{
        require(msg.sender == opponent || msg.sender == creator);
        require(_judges.length != 0 && _judges.length<=judgesAvailable[msg.sender]);

        for(uint i=0; i<_judges.length; i++){
            isJudge[_judges[i]] = true;
            judgesAvailable[msg.sender] = judgesAvailable[msg.sender] - 1;
        }
    }
    
    function acceptBet() public restricted payable{
        require(judgesAvailable[creator]==0 && judgesAvailable[opponent]==0);
        require(msg.value>=minimumBet);
        betAccepted=true;
    }
}