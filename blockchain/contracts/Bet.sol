// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

// Libraries
import { SafeMath } from '@openzeppelin/contracts/math/SafeMath.sol';
import { PullPayment } from '@openzeppelin/contracts/payment/PullPayment.sol';
import { ReentrancyGuard } from '@openzeppelin/contracts/utils/ReentrancyGuard.sol';

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
     * ASSIGNING_BETTORS - Assigning bettor and counter bettor
     * ASSIGNING_JUDGES - Assigning bettor's and counter bettor's judges
     * BET_WAITING - Waiting for time to expire so judges can start voting
     * VOTING_STAGE - Judges are allowed to vote
     * BET_OVER - Either bettor or counter bettor won
     */
     
    enum BetState {
        BET_CREATED, 
        ASSIGNING_BETTORS,
        ASSIGNING_JUDGES,
        BET_WAITING,
        VOTING_STAGE,
        BET_OVER
    }

    struct Participant {
        bytes32 role;
    }
    
    struct Storage {
        mapping(address => bytes32) participantRoles;
        mapping(bytes32 => address) roleParticipants;
        mapping(address => bool) didVote;
        mapping(address => uint256) votes;
        address admin;
        string description;
        BetState betState;
        uint256 expirationTime;
        uint256 deposit;
    }
    
    event CurrentState(BetState _betState);
    event Action(address _sender, bytes32 _roleName, bytes32 _action);
    event Dispute();
    
    //----------------------------------------
    // State variables
    //----------------------------------------
    
    Storage private betStorage;

    //----------------------------------------
    // Constructor
    //----------------------------------------
    
    constructor(
        address _admin, 
        uint256 _deposit, 
        string memory _description, 
        uint256 _expirationTime
        ) nonReentrant transitionAfter {
            betStorage.admin = _admin;
            betStorage.description = _description;
            betStorage.deposit = _deposit;
            betStorage.expirationTime = _expirationTime;
            betStorage.betState = BetState.BET_CREATED;
            emit CurrentState(betStorage.betState);
    }

    //----------------------------------------
    // Modifiers
    //----------------------------------------
    
    modifier atState(BetState _state) {
        require(betStorage.betState == _state, "This functionality is not allowed in current bet state");
        _;
    }
    
    modifier roleNotTaken(bytes32 _role) {
        require(betStorage.roleParticipants[_role] == address(0), "That role is taken");
        _;
    }
    
    modifier onlyWinner(address _sender) {
        require(betStorage.votes[_sender] > JUDGE_PER_SIDE, "You are not allowed to claim the prize");
        _;
    }

    modifier onlyJudgeOrDisputer(address _sender) {
        require(betStorage.participantRoles[_sender] == BETTOR_JUDGE || betStorage.participantRoles[_sender] == COUNTER_BETTOR_JUDGE || betStorage.admin == _sender, "Sender is not a judge");
        _;
    }

    modifier didNotVote(address _sender) {
        require(betStorage.didVote[_sender] != true, "You have already voted");
        _;
    }
    
    modifier matchDeposit(uint256 _value) {
        require(_value == betStorage.deposit, "Value sent doesn't match deposit value");
        _;
    }

    
    modifier excludeBettors(address _sender) {
        require(betStorage.roleParticipants[BETTOR_ROLE] != _sender && betStorage.roleParticipants[COUNTER_BETTOR_ROLE] != _sender, "You are not allowed to be a judge");
        _;
    }
    
    modifier timedTransition(BetState _state) {
        if(betStorage.betState == _state && block.timestamp >= betStorage.expirationTime) {
            _nextState();
        }
        _;
    }
    
    modifier uniqueJudges(address _sender) {
        require(_sender != betStorage.roleParticipants[BETTOR_JUDGE] && _sender != betStorage.roleParticipants[COUNTER_BETTOR_JUDGE], "You are a judge already");
        _;
    }
    
    modifier uniqueBettors(address _sender) {
        require(_sender != betStorage.roleParticipants[BETTOR_ROLE] && _sender != betStorage.roleParticipants[COUNTER_BETTOR_ROLE], "You are a bettor already");
        _;
    }
    
    modifier transitionAfter() {
        _;
        _nextState();
    }
    
    //----------------------------------------
    // External functions
    //----------------------------------------
    
    /**
     * @notice Assigns caller as bettor
     */
    function addBettor() public payable {
        _bet(true, msg.value);    
    }
    
    /**
     * @notice Assigns caller as counter bettor
     */
    function addCounterBettor() public payable {
        _bet(false, msg.value);
    }
    
    /**
     * @notice Assigns caller as a bettor's judge
     */
    function addBettorJudge() public {
        _addJudge(true);
    }
    
    /**
     * @notice Assigns caller as a counter bettor's judge
     */
    function addCounterBettorJudge() public {
        _addJudge(false);
    }
    
    /**
     * @notice Judge or admin can call this function to vote for bettor
     */
    function voteForBettor() public {
        _giveVote(true);
    }
    
    /**
     * @notice Judge or admin can call this function to vote for counter bettor
     */
    function voteForCounterBettor() public {
        _giveVote(false);
    }
    
    /**
     * @notice Transfers this contract's balance to caller if he won this bet
     */
    function claimReward() atState(BetState.BET_OVER) onlyWinner(msg.sender) public {
        _asyncTransfer(msg.sender, address(this).balance);
    }
    
    /**
     * @notice Returns bet description
     */
    function getBet() public view returns(
        string memory description,
        BetState betState,
        uint256 expirationTime,
        uint256 deposit) {
        return (betStorage.description, betStorage.betState, betStorage.expirationTime, betStorage.deposit);
    }
    
    function getBalance() public view returns(uint256) {
        return address(this).balance;
    }
    //----------------------------------------
    // Internal functions
    //----------------------------------------
    
    /**
     * @notice Assigns caller as bettor or counter bettor
     * @param _choice Determines if caller will be assigned as a bettor(true) or counter bettor(false)
     * @param _value Value from transaction
     */
    function _bet(bool _choice, uint _value) atState(BetState.ASSIGNING_BETTORS) matchDeposit(_value) uniqueBettors(msg.sender) internal returns (BetState) {
        if(_choice) {
            _assignRole(msg.sender, BETTOR_ROLE, "BETTOR");
        }
        else {
            _assignRole(msg.sender, COUNTER_BETTOR_ROLE, "COUNTER BETTOR");
        }
        if(betStorage.roleParticipants[BETTOR_ROLE] != address(0) && betStorage.roleParticipants[COUNTER_BETTOR_ROLE] != address(0)) {
            _nextState();
        }
        return betStorage.betState;
    }
    
    /**
     * @notice Assigns caller as bettor's or counter bettor's judge
     * @param _choice Determines if caller will be assigned as a bettor's judge(true) or counter bettor's judge(false)
     */
    function _addJudge(bool _choice) atState(BetState.ASSIGNING_JUDGES) excludeBettors(msg.sender) uniqueJudges(msg.sender) internal returns (BetState) {
        if(_choice) {
            _assignRole(msg.sender, BETTOR_JUDGE, "BETTOR JUDGE");
        }
        else {
            _assignRole(msg.sender, COUNTER_BETTOR_JUDGE, "COUNTER BETTOR JUDGE");
        }
        if (betStorage.roleParticipants[BETTOR_JUDGE] != address(0) && betStorage.roleParticipants[COUNTER_BETTOR_JUDGE] != address(0)) {
            _nextState();
        }
        return betStorage.betState;
    }
    
    /**
     * @notice Gives a vote to bettor or counter bettor
     * @param _vote Determines if vote will be given to bettor(true) or counter bettor(false)
     */
    function _giveVote(bool _vote) timedTransition(BetState.BET_WAITING) atState(BetState.VOTING_STAGE) onlyJudgeOrDisputer(msg.sender) didNotVote(msg.sender) internal returns (BetState) {
        betStorage.didVote[msg.sender] = true;
        if(_vote) {
          betStorage.votes[betStorage.roleParticipants[BETTOR_ROLE]] = betStorage.votes[betStorage.roleParticipants[BETTOR_ROLE]].add(1);
        }
        else {
            betStorage.votes[betStorage.roleParticipants[COUNTER_BETTOR_ROLE]] = betStorage.votes[betStorage.roleParticipants[COUNTER_BETTOR_ROLE]].add(1);
        }
        if(betStorage.votes[betStorage.roleParticipants[COUNTER_BETTOR_ROLE]] > JUDGE_PER_SIDE || betStorage.votes[betStorage.roleParticipants[BETTOR_ROLE]] > JUDGE_PER_SIDE) {
            _nextState();
        }
        else if(betStorage.votes[betStorage.roleParticipants[COUNTER_BETTOR_ROLE]].add(betStorage.votes[betStorage.roleParticipants[BETTOR_ROLE]]) == MAX_JUDGES) {
            emit Dispute();
        }
        return betStorage.betState;
    }
    
    /**
     * @notice Transits bet to a new state
     */
    function _nextState() internal {
        betStorage.betState = BetState(uint(betStorage.betState) + 1);
        emit CurrentState(betStorage.betState);
    }
    
    /**
     * @notice Gives a certain role to caller
     * @param _sender Address of a caller
     * @param _role Hashed role name "keccak256"
     * @param _roleName Role name as string
     */
    function _assignRole(address _sender, bytes32 _role, bytes32 _roleName) roleNotTaken(_role) internal {
        betStorage.participantRoles[_sender] = _role;
        betStorage.roleParticipants[_role] = _sender;
        emit Action(_sender, _roleName, "Role assigned");
    }
}