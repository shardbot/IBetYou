// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

// Libraries
import { SafeMath } from 'blockchain/node_modules/@openzeppelin/contracts/math/SafeMath.sol';
import { PullPayment } from 'blockchain/node_modules/@openzeppelin/contracts/payment/PullPayment.sol';
import { ReentrancyGuard } from 'blockchain/node_modules/@openzeppelin/contracts/utils/ReentrancyGuard.sol';

contract Bet is ReentrancyGuard, PullPayment {

    //----------------------------------------
    // Type definitions
    //----------------------------------------
    using SafeMath for uint256;
    
    //----------------------------------------
    // Constants
    //----------------------------------------
    uint internal constant MAX_JUDGES = 2;
    uint internal constant JUDGE_PER_SIDE = 1; 

    //----------------------------------------
    // Contract roles
    //----------------------------------------
    bytes32 internal constant BETTOR_ROLE = keccak256("BETTOR");
    bytes32 internal constant COUNTER_BETTOR_ROLE = keccak256("COUNTER_BETTOR");
    bytes32 internal constant BETTOR_JUDGE = keccak256("BETTOR_JUDGE");
    bytes32 internal constant COUNTER_BETTOR_JUDGE = keccak256("COUNTER_BETTOR_JUDGE");
    
    /**
     * @notice Structure with all possible bet states
     * BET_CREATED - When contract is created but nobody deployed a fee
     * BETTOR_ADDED - When bettor is added
     * COUNTER_BETTOR_ADDED - When counter bettor is added
     * BOTH_SIDES_ADDED - When bettor and counter bettor are added
     * BET_WAITING - When judges are added, waiting for time to expire so they can start voting
     * DISPUTE - When both bettor and counter bettor have same number of votes and all judges have voted
     * BETTOR_VICTORY - When bettor won 
     * COUNTER_BETTOR_VICTORY - When counter bettor won
     */
     
    enum BetState {
        BET_CREATED, 
        BETTOR_ADDED,
        COUNTER_BETTOR_ADDED,
        BOTH_SIDES_ADDED,
        BET_WAITING,
        DISPUTE,
        BETTOR_VICTORY,
        COUNTER_BETTOR_VICTORY
    }

    struct Participant {
        bytes32 role;
    }
    
    struct Storage {
        address admin;
        uint256 expirationTime;
        string description;
        uint256 deposit;
        BetState betState;
        mapping(address => bytes32) participantRoles;
        mapping(bytes32 => address) roleParticipants;
        mapping(address => bool) didVote;
        mapping(bool => uint256) votes;
    }

    event BettorBetted();
    event CounterBettorBetted();
    event BothSidesAdded();
    event BettorJudgeApplied(address _judge);
    event CounterBettorJudgeApplied(address _judge);
    event AllJudgesApplied();
    event BettorJudgeVoted(address _judge);
    event CounterBettorJudgeVoted(address _judge);
    event DisputorVoted(address _disputor);
    event BettorWon(address _bettor);
    event CounterBettorWon(address _counterBettor);
    event Dispute();
    

    //----------------------------------------
    // State variables
    //----------------------------------------
    Storage public betStorage;

    //----------------------------------------
    // Constructor
    //----------------------------------------
    constructor(
        address _admin, 
        uint256 _deposit, 
        string memory _description, 
        uint256 _expirationTime
        ) nonReentrant {
            betStorage.admin = _admin;
            betStorage.description = _description;
            betStorage.deposit = _deposit;
            betStorage.expirationTime = _expirationTime;
            betStorage.betState = BetState.BET_CREATED;
    }

    //----------------------------------------
    // Modifiers
    //----------------------------------------

    modifier mustBeJudgeOrAdmin(address _sender) {
        require(betStorage.participantRoles[_sender] == BETTOR_JUDGE || betStorage.participantRoles[_sender] == COUNTER_BETTOR_JUDGE || betStorage.admin == _sender, "Sender is not a judge");
        _;
    }

    modifier didNotVote(address _sender) {
        require(betStorage.didVote[_sender] != true, "Judge already voted");
        _;
    }

    modifier roleParticipantExists(bytes32 _role) {
        require(betStorage.roleParticipants[_role] != address(0), "You cannot apply as a judge before your party accepted bet");
        _;
    }

    modifier timeExpired(){
        require(betStorage.expirationTime <= block.timestamp, "You can't vote yet");
        _;
    }
    
    modifier onlyOneParticipant(bytes32 _role) {
        require(betStorage.roleParticipants[_role] == address(0), "This participant role has already been taken");
        _;
    }
    
    modifier matchDeposit(uint256 _value) {
        require(_value == betStorage.deposit, "Value sent doesn't match deposit value");
        _;
    }

    modifier onlyAdmin(address _sender) {
        require(betStorage.admin == _sender, "You are not an admin");
        _;
    }
    
    modifier excludeBettors(address _sender) {
        require(betStorage.roleParticipants[BETTOR_ROLE] != _sender && betStorage.roleParticipants[COUNTER_BETTOR_ROLE] != _sender, "You can't be a judge if you participated in bet");
        _;
    }
    
    //----------------------------------------
    // External functions
    //----------------------------------------
    
    function bet() matchDeposit(msg.value) onlyOneParticipant(BETTOR_ROLE) public payable returns (BetState) {
        BetState currentState = betStorage.betState;
        betStorage.participantRoles[msg.sender] = BETTOR_ROLE;
        betStorage.roleParticipants[BETTOR_ROLE] = msg.sender;
        betStorage.betState = BetState.BETTOR_ADDED;
        emit BettorBetted();
        // if counter bettor was added before bettor
        betStorage.betState = checkBothPartiesAccepted(currentState);
        return betStorage.betState;
    }

    function counterBet() matchDeposit(msg.value) onlyOneParticipant(COUNTER_BETTOR_ROLE) public payable returns (BetState) {
        BetState currentState = betStorage.betState;
        betStorage.participantRoles[msg.sender] = COUNTER_BETTOR_ROLE;
        betStorage.roleParticipants[COUNTER_BETTOR_ROLE] = msg.sender;
        betStorage.betState = BetState.COUNTER_BETTOR_ADDED;
        emit CounterBettorBetted();
        // if bettor was added before counter bettor
        betStorage.betState = checkBothPartiesAccepted(currentState);
        return betStorage.betState;
    }

    function addBettorJudge() excludeBettors(msg.sender) roleParticipantExists(BETTOR_ROLE) onlyOneParticipant(BETTOR_JUDGE) public returns (BetState) {
        betStorage.participantRoles[msg.sender] = BETTOR_JUDGE;
        betStorage.roleParticipants[BETTOR_JUDGE] = msg.sender;
        emit BettorJudgeApplied(msg.sender);
        checkJudgesCount();
        return betStorage.betState;
    }

    function addCounterBettorJudge() excludeBettors(msg.sender) roleParticipantExists(COUNTER_BETTOR_ROLE) onlyOneParticipant(COUNTER_BETTOR_JUDGE) public returns (BetState) {
        betStorage.participantRoles[msg.sender] = COUNTER_BETTOR_JUDGE;
        betStorage.roleParticipants[COUNTER_BETTOR_JUDGE] = msg.sender;
        emit CounterBettorJudgeApplied(msg.sender);
        checkJudgesCount();
        return betStorage.betState;
    }

    function vote(bool _vote) mustBeJudgeOrAdmin(msg.sender) didNotVote(msg.sender) timeExpired() public returns (BetState) {
        betStorage.didVote[msg.sender] = true;
        betStorage.votes[_vote] = betStorage.votes[_vote].add(1);
        if(betStorage.participantRoles[msg.sender] == BETTOR_JUDGE) {
            emit BettorJudgeVoted(msg.sender);
        }
        else if(betStorage.participantRoles[msg.sender] == COUNTER_BETTOR_JUDGE) {
            emit CounterBettorJudgeVoted(msg.sender);
        }
        else
            emit DisputorVoted(betStorage.admin);
        // set betState depending on current vote distribution
        checkResult();
        return betStorage.betState;
    }

    function resolveDispute(bool _vote) onlyAdmin(msg.sender) public {
        vote(_vote);
    }

    //----------------------------------------
    // Internal functions
    //----------------------------------------
    function checkBothPartiesAccepted(BetState _state) internal returns (BetState) {
        if(_state == BetState.BETTOR_ADDED || _state == BetState.COUNTER_BETTOR_ADDED) {
            emit BothSidesAdded();
            return BetState.BOTH_SIDES_ADDED;
        }
        return _state;
    }
    
    function checkJudgesCount() internal {
        if(betStorage.roleParticipants[COUNTER_BETTOR_JUDGE] != address(0) && betStorage.roleParticipants[BETTOR_JUDGE] != address(0)) {
            betStorage.betState = BetState.BET_WAITING;
            emit AllJudgesApplied();
        }
    }

    function checkResult() internal {
        if(betStorage.votes[true].add(betStorage.votes[false]) != MAX_JUDGES) {
            return;
        }
        else if(betStorage.votes[true] == MAX_JUDGES) {
            betStorage.betState = BetState.BETTOR_VICTORY;
            emit BettorWon(betStorage.roleParticipants[BETTOR_ROLE]);
        }
        else if(betStorage.votes[false] == MAX_JUDGES) {
            betStorage.betState = BetState.COUNTER_BETTOR_VICTORY;
            emit CounterBettorWon(betStorage.roleParticipants[COUNTER_BETTOR_ROLE]);
        }
        else if(betStorage.votes[true].add(betStorage.votes[false]) == MAX_JUDGES){
            betStorage.betState = BetState.DISPUTE;
            emit Dispute();
        }
    }    

    function transferCurrencyToWinner(address _winner) internal {
        _asyncTransfer(_winner, address(this).balance);
    }
}