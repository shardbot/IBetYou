pragma solidity <=0.7.3;

contract BetFactory {
    
    address[] public deployedBets;

    function createBet(address opponent, uint minimumBet, uint endTimeSec, uint judgesCount) public payable{
        // mora dat para kolko je naveo da ce bit
        require(msg.value >= minimumBet);
        // ne mogu se kladiti na prošlost
        require(endTimeSec > block.timestamp);
        address bet = address(new Bet(msg.sender, opponent, minimumBet, endTimeSec, judgesCount));
        address payable betAddress = payable(address(bet));
        // prebaci keš od izazivača u bet instancu i dodaj adresu u array
        betAddress.transfer(msg.value);
        deployedBets.push(bet);
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
    address public creator;
    address public opponent;
    
    uint public minimumBet;
    uint public maxTimeSec; 
    mapping(address => uint) public judgesAvailable;
    mapping(address => bool) public judges;
    uint public approversCount;
    
    
    constructor(address _creator, address _opponent, uint _minimumBet, uint _endTimeSec, uint _judgesCount) public{
        startTimeSec = block.timestamp;
        minimumBet = _minimumBet;
        judgesCount = _judgesCount;
        creator = _creator;
        endTimeSec = _endTimeSec;
        opponent = _opponent;
        // brojač za suce
        judgesAvailable[creator] = _judgesCount;
        judgesAvailable[opponent] = _judgesCount;
        betAccepted = false;
    }
    
    receive() external payable{}
    
    // mora biti protivnik
    modifier restricted(){
        require(msg.sender == opponent);
        _;
    }
    
    function addJudges(address[] memory _judges) public{
        require(msg.sender == opponent || msg.sender == creator);
        require(_judges.length != 0 && _judges.length<=judgesAvailable[msg.sender]);
        for(uint i=0; i<_judges.length; i++){
            judges[_judges[i]] = true;
            judgesAvailable[msg.sender] = judgesAvailable[msg.sender] - 1;
        }
    }
    

    
    function acceptBet() public restricted payable{
        // suci moraju biti dodani te protivnik mora platiti minimum
        require(judgesAvailable[creator]==0 && judgesAvailable[opponent]==0);
        require(msg.value>=minimumBet);
        betAccepted=true;
    }
}