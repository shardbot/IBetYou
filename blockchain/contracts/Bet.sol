// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

// Libraries
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { SafeMath } from '@openzeppelin/contracts/math/SafeMath.sol';
import {
  ReentrancyGuard
} from '@openzeppelin/contracts/utils/ReentrancyGuard.sol';

contract Bet is ReentrancyGuard {

    //----------------------------------------
    // Type definitions
    //----------------------------------------
    using SafeMath for uint256;

    //----------------------------------------
    // Contract roles
    //----------------------------------------
    bytes32 internal constant BETTOR_ROLE = keccak256("BETTOR");
    bytes32 internal constant COUNTER_BETOR_ROLE = keccak256("COUNTER_BETTOR");
    bytes32 internal constant BETTOR_JUDGE = keccak256("BETTOR_JUDGE");
    bytes32 internal constant COUNTER_BETTOR_JUDGE = keccak256("COUNTER_BETTOR_JUDGE");

    enum BetState {
        CREATED, // When contract is created but nobody deployed a fee
        BETTER_BETTED, // Better betted
        JUDGES_APPLIED, //Both judges have applied
        ACTIVE, // When all have applied and can judges can vote
        DISPUTE, // When judges voted differently
        FINISHED // When winner is decided and funds can be paid to him
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
        bool[] votes;
    }

    event BettorBetted();
    event CounterBettorBetted();
    event BettorJudgeApplied();
    event CounterBettorJudgeApplied();
    event BettorJudgeVoted();
    event CounterBettorJudgeVoted();

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
            betStorage.betState = BetState.CREATED;
    }

    //----------------------------------------
    // Modifiers
    //----------------------------------------

    modifier checkJudgeLimit() {
        _;
        if(betStorage.roleParticipants[BETTOR_JUDGE] != address(0) && betStorage.roleParticipants[COUNTER_BETTOR_JUDGE] != address(0)){ 
            betStorage.betState = BetState.JUDGES_APPLIED;
        }
    }

    modifier mustBeJudge(address _sender) {
        require(betStorage.participantRoles[_sender] == BETTOR_JUDGE || betStorage.participantRoles[_sender] == COUNTER_BETTOR_JUDGE, "Sender is not a judge");
        _;
    }

    modifier didNotVote(address _sender) {
        require(betStorage.didVote[_sender] != true, "Judge already voted!");
        _;
    }

    //----------------------------------------
    // External functions
    //----------------------------------------
    
    function bet() public returns (BetState){
        require(betStorage.roleParticipants[BETTOR_ROLE] == address(0), "Bettor already exists");
        require(betStorage.participantRoles[msg.sender] == bytes32(0), "Applicant already part of the bet");
        betStorage.participantRoles[msg.sender] = BETTOR_ROLE;
        betStorage.roleParticipants[BETTOR_ROLE] = msg.sender;
        betStorage.betState = BetState.BETTER_BETTED;
        emit BettorBetted();
        return betStorage.betState;
    }

    function counterBet() public returns (BetState) {
        require(betStorage.betState == BetState.BETTER_BETTED, "First better must bet");
        require(betStorage.roleParticipants[COUNTER_BETOR_ROLE] == address(0), "Count bettor already exists");
        require(betStorage.participantRoles[msg.sender] == bytes32(0), "Applicant already part of the bet");
        betStorage.participantRoles[msg.sender] = COUNTER_BETOR_ROLE;
        betStorage.roleParticipants[COUNTER_BETOR_ROLE] = msg.sender;
        betStorage.betState = BetState.ACTIVE;
        emit CounterBettorBetted();
        return betStorage.betState;
    }

    function addBettorJudge() checkJudgeLimit() public returns (BetState)  {
        require(betStorage.betState == BetState.ACTIVE, "Bet must be active to add judges");
        require(betStorage.roleParticipants[BETTOR_JUDGE] == address(0), "Count bettor judge already exists");
        require(betStorage.participantRoles[msg.sender] == bytes32(0), "Applicant already part of the bet");
        betStorage.participantRoles[msg.sender] = BETTOR_JUDGE;
        betStorage.roleParticipants[BETTOR_JUDGE] = msg.sender;
        emit BettorJudgeApplied();
        return betStorage.betState;
    }

    function addCounterBettorJudge() checkJudgeLimit() public returns (BetState) {
        require(betStorage.betState == BetState.ACTIVE, "Bet must be active to add judges");
        require(betStorage.roleParticipants[COUNTER_BETTOR_JUDGE] == address(0), "Count bettor judge already exists");
        require(betStorage.participantRoles[msg.sender] == bytes32(0), "Applicant already part of the bet");
        betStorage.participantRoles[msg.sender] = COUNTER_BETTOR_JUDGE;
        betStorage.roleParticipants[COUNTER_BETTOR_JUDGE] = msg.sender;
        emit CounterBettorJudgeApplied();
        return betStorage.betState;
    }

    function vote(bool _vote) mustBeJudge(msg.sender) didNotVote(msg.sender) public returns (BetState) {
        betStorage.didVote[msg.sender] = true;
        betStorage.votes.push(_vote);
        if(betStorage.participantRoles[msg.sender] == BETTOR_JUDGE) {
            emit BettorJudgeVoted();
            return betStorage.betState;
        }
        emit CounterBettorJudgeVoted();
        return betStorage.betState;
    }

    function checkResult() public {
        // TODO:
    }

    //----------------------------------------
    // Internal functions
    //----------------------------------------


}