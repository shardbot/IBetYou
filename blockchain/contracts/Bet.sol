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
        uint256 maxJudges;
        uint256 halfJudges;
        uint256 bettorJudgesCount;
        uint256 counterBettorJudgesCount;
        BetState betState;
        mapping(address => bytes32) participantRoles;
        mapping(bytes32 => address) roleParticipants;
        mapping(address => bool) didVote;
        mapping(bool => uint256) votes;
        mapping(address => uint256) balances;
    }

    event BettorBetted();
    event CounterBettorBetted();
    event BothSidesAdded();
    event BettorJudgeApplied();
    event CounterBettorJudgeApplied();
    event AllJudgesApplied();
    event BettorJudgeVoted();
    event CounterBettorJudgeVoted();
    event AdminVoted();
    event BettorWon();
    event CounterBettorWon();
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
            betStorage.maxJudges = 2; // Hardcoded, to be changed
            betStorage.halfJudges = 1; // Hardcoded, to be changed
            betStorage.bettorJudgesCount = 0;
            betStorage.counterBettorJudgesCount = 0;
    }

    //----------------------------------------
    // Modifiers
    //----------------------------------------

    modifier checkJudgeLimit(uint _judgesCount) {
        require(_judgesCount < betStorage.halfJudges, "You already added maximum number of judges");
        _;
    }

    modifier mustBeJudgeOrAdmin(address _sender) {
        require(betStorage.participantRoles[_sender] == BETTOR_JUDGE || betStorage.participantRoles[_sender] == COUNTER_BETTOR_JUDGE || betStorage.admin == _sender, "Sender is not a judge");
        _;
    }

    modifier didNotVote(address _sender) {
        require(betStorage.didVote[_sender] != true, "Judge already voted");
        _;
    }

    modifier bettorExists() {
        require(betStorage.roleParticipants[BETTOR_ROLE] != address(0), "Bettor didn't accept bet");
        _;
    }

    modifier counterBettorExists() {
        require(betStorage.roleParticipants[COUNTER_BETTOR_ROLE] != address(0), "Counter bettor is missing");
        _;
    }

    modifier timeExpired(){
        require(betStorage.expirationTime <= block.timestamp, "You can't vote yet");
        _;
    }
    
    modifier onlyOneParticipant(address _role){
        require(_role == address(0), "This participant role has already been taken");
        _;
    }
    
    modifier matchDeposit(uint256 _value){
        require(_value == betStorage.deposit, "Value sent doesn't match deposit value");
        _;
    }

    modifier onlyDisputeState(){
        require(betStorage.betState == BetState.DISPUTE, "Bet isn't in dispute state");
        _;
    }

    modifier onlyAdmin(address _sender){
        require(betStorage.admin == _sender, "You are not an admin");
        _;
    }
    //----------------------------------------
    // External functions
    //----------------------------------------
    
    function bet() matchDeposit(msg.value) onlyOneParticipant(betStorage.roleParticipants[BETTOR_ROLE]) public payable returns (BetState){
        BetState currentState = betStorage.betState;
        betStorage.participantRoles[msg.sender] = BETTOR_ROLE;
        betStorage.roleParticipants[BETTOR_ROLE] = msg.sender;
        betStorage.betState = BetState.BETTOR_ADDED;
        emit BettorBetted();
        // if counter bettor was added before bettor
        if(currentState == BetState.COUNTER_BETTOR_ADDED){
            betStorage.betState = BetState.BOTH_SIDES_ADDED;
            emit BothSidesAdded();
        }
        return betStorage.betState;
    }

    function counterBet() matchDeposit(msg.value) onlyOneParticipant(betStorage.roleParticipants[COUNTER_BETTOR_ROLE]) public payable returns (BetState) {
        BetState currentState = betStorage.betState;
        betStorage.participantRoles[msg.sender] = COUNTER_BETTOR_ROLE;
        betStorage.roleParticipants[COUNTER_BETTOR_ROLE] = msg.sender;
        betStorage.betState = BetState.COUNTER_BETTOR_ADDED;
        emit CounterBettorBetted();
        // if bettor was added before counter bettor
        if(currentState == BetState.BETTOR_ADDED){
            betStorage.betState = BetState.BOTH_SIDES_ADDED;
            emit BothSidesAdded();
        }
        return betStorage.betState;
    }

    function addBettorJudge() bettorExists() checkJudgeLimit(betStorage.bettorJudgesCount) public returns (BetState)  {
        betStorage.participantRoles[msg.sender] = BETTOR_JUDGE;
        betStorage.roleParticipants[BETTOR_JUDGE] = msg.sender;
        betStorage.bettorJudgesCount = betStorage.bettorJudgesCount.add(1);
        emit BettorJudgeApplied();
        checkJudgesCount();
        return betStorage.betState;
    }

    function addCounterBettorJudge() counterBettorExists() checkJudgeLimit(betStorage.counterBettorJudgesCount) public returns (BetState) {
        betStorage.participantRoles[msg.sender] = COUNTER_BETTOR_JUDGE;
        betStorage.roleParticipants[COUNTER_BETTOR_JUDGE] = msg.sender;
        betStorage.counterBettorJudgesCount = betStorage.counterBettorJudgesCount.add(1);
        checkJudgesCount();
        emit CounterBettorJudgeApplied();
        return betStorage.betState;
    }

    function vote(bool _vote) mustBeJudgeOrAdmin(msg.sender) didNotVote(msg.sender) timeExpired() public returns (BetState) {
        betStorage.didVote[msg.sender] = true;
        betStorage.votes[_vote] = betStorage.votes[_vote].add(1);
        if(betStorage.participantRoles[msg.sender] == BETTOR_JUDGE) {
            emit BettorJudgeVoted();
        }
        else if(betStorage.participantRoles[msg.sender] == COUNTER_BETTOR_JUDGE){
            emit CounterBettorJudgeVoted();
        }
        else
            emit AdminVoted();
        // set betState depending on current vote distribution
        checkResult();
        return betStorage.betState;
    }

    function resolveDispute(bool _vote) onlyDisputeState() onlyAdmin(msg.sender) public{
        vote(_vote);
    }

    //----------------------------------------
    // Internal functions
    //----------------------------------------
    function checkJudgesCount() internal {
        if(betStorage.bettorJudgesCount.add(betStorage.counterBettorJudgesCount) == betStorage.maxJudges){
            betStorage.betState = BetState.BET_WAITING;
            emit AllJudgesApplied();
        }
    }

    function checkResult() internal{
        if(betStorage.votes[true] > betStorage.halfJudges)
        {
            betStorage.betState = BetState.BETTOR_VICTORY;
            transferCurrencyToWinner(betStorage.roleParticipants[BETTOR_ROLE]);
            emit BettorWon();
        }
        else if(betStorage.votes[false] > betStorage.halfJudges)
        {
            betStorage.betState = BetState.COUNTER_BETTOR_VICTORY;
            transferCurrencyToWinner(betStorage.roleParticipants[COUNTER_BETTOR_ROLE]);
            emit CounterBettorWon();
        }
        else if(betStorage.votes[true] == betStorage.votes[false] && betStorage.votes[true].add(betStorage.votes[false]) == betStorage.maxJudges)
        {
            betStorage.betState = BetState.DISPUTE;
            emit Dispute();
        }
    }    

    function transferCurrencyToWinner(address _winner) internal{
        _asyncTransfer(_winner, address(this).balance);
    }
}