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
        ) nonReentrant {
            betStorage.admin = _admin;
            betStorage.description = _description;
            betStorage.deposit = _deposit;
            betStorage.expirationTime = _expirationTime;
            betStorage.betState = BetState.BET_CREATED;
            emit CurrentState(betStorage.betState);
            nextState();
    }

    //----------------------------------------
    // Modifiers
    //----------------------------------------
    
    modifier atState(BetState _state) {
        require(betStorage.betState == _state, "You can't do that anymore");
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
            nextState();
        }
        _;
    }
    
    //----------------------------------------
    // External functions
    //----------------------------------------
    
    /// @param _choice Determines if caller will be assigned as bettor(_choice = true) or counter bettor(_choice = false)
    /// @dev Assigns caller as bettor or counter bettor. Requires a bet to be in ASSIGNING_BETTORS state and value sent must match deposit value. If both roles are taken, nextState() is called.
    /// @return bet state
    function bet(bool _choice) atState(BetState.ASSIGNING_BETTORS) matchDeposit(msg.value) public payable returns (BetState) {
        if(_choice) {
            assignRole(msg.sender, BETTOR_ROLE, "BETTOR");
        }
        else {
            assignRole(msg.sender, COUNTER_BETTOR_ROLE, "COUNTER BETTOR");
        }
        if(betStorage.roleParticipants[BETTOR_ROLE] != address(0) && betStorage.roleParticipants[COUNTER_BETTOR_ROLE] != address(0)) {
            nextState();
        }
        return betStorage.betState;
    }
    
    /// @param _choice Determines if caller will be assigned as bettor judge(_choice = true) or counter bettor judge(_choice = false)
    /// @dev Assigns caller as bettor judge or counter bettor judge. Requires a bet to be in ASSIGNING_JUDGES state and judges can't be bettors. If both roles are taken, nextState() is called.
    /// @return bet state
    function addJudge(bool _choice) atState(BetState.ASSIGNING_JUDGES) excludeBettors(msg.sender) public returns (BetState) {
        if(_choice) {
            assignRole(msg.sender, BETTOR_JUDGE, "BETTOR JUDGE");
        }
        else {
            assignRole(msg.sender, COUNTER_BETTOR_JUDGE, "COUNTER BETTOR JUDGE");
        }
        if (betStorage.roleParticipants[BETTOR_JUDGE] != address(0) && betStorage.roleParticipants[COUNTER_BETTOR_JUDGE] != address(0)) {
            nextState();
        }
        return betStorage.betState;
    }
    
    /// @param _vote If _vote is true, vote goes to bettor, otherwise it goes to counter bettor. 
    /// @dev Gives a from from judge to one of the bettors. Requires a bet to be in VOTING_STAGE state, current time must be greater than expirationTime, only judges and disputer can vote and they can only vote once.
    /// @return bet state
    function vote(bool _vote) timedTransition(BetState.BET_WAITING) atState(BetState.VOTING_STAGE) onlyJudgeOrDisputer(msg.sender) didNotVote(msg.sender) public returns (BetState) {
        betStorage.didVote[msg.sender] = true;
        if(_vote) {
          betStorage.votes[betStorage.roleParticipants[BETTOR_ROLE]] = betStorage.votes[betStorage.roleParticipants[BETTOR_ROLE]].add(1);
        }
        else {
            betStorage.votes[betStorage.roleParticipants[COUNTER_BETTOR_ROLE]] = betStorage.votes[betStorage.roleParticipants[COUNTER_BETTOR_ROLE]].add(1);
        }
        if(betStorage.votes[betStorage.roleParticipants[COUNTER_BETTOR_ROLE]] > JUDGE_PER_SIDE || betStorage.votes[betStorage.roleParticipants[BETTOR_ROLE]] > JUDGE_PER_SIDE) {
            nextState();
        }
        else if(betStorage.votes[betStorage.roleParticipants[COUNTER_BETTOR_ROLE]].add(betStorage.votes[betStorage.roleParticipants[BETTOR_ROLE]]) == MAX_JUDGES) {
            emit Dispute();
        }
        return betStorage.betState;
    }

    //----------------------------------------
    // Internal functions
    //----------------------------------------
    
    /// @dev Transitions to next state
    function nextState() internal {
        betStorage.betState = BetState(uint(betStorage.betState) + 1);
        emit CurrentState(betStorage.betState);
    }
    
    /// @dev Assigns caller to a certain role, requires that role is not already taken
    /// @param _sender Address to be assigned, _role Role to be given, _roleName String representation of a role
    function assignRole(address _sender, bytes32 _role, bytes32 _roleName) roleNotTaken(_role) internal {
        betStorage.participantRoles[_sender] = _role;
        betStorage.roleParticipants[_role] = _sender;
        emit Action(_sender, _roleName, "Role assigned");
    }
    
    /// @dev Transfers currency to caller if he is a winner. Requires a bet to be in BET_OVER state
    function transferCurrencyToWinner() atState(BetState.BET_OVER) onlyWinner(msg.sender) internal {
        _asyncTransfer(msg.sender, address(this).balance);
    }
}