// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <0.8.0;
pragma experimental ABIEncoderV2;

// Libraries
import {IQuickSwapRouter02} from "./interfaces/IQuickSwapRouter02.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeMath} from "@openzeppelin/contracts/math/SafeMath.sol";
import {PullPayment} from "@openzeppelin/contracts/payment/PullPayment.sol";
import {
    ReentrancyGuard
} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {
    PaymentSplitter
} from "@openzeppelin/contracts/payment/PaymentSplitter.sol";

contract Bet is ReentrancyGuard {
    //----------------------------------------
    // Type definitions
    //----------------------------------------
    using SafeMath for uint256;

    //----------------------------------------
    // Global variables
    //----------------------------------------
    IQuickSwapRouter02 router =
        IQuickSwapRouter02(0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff);
    address private winner;
    PaymentSplitter splitter;
    uint256[] private shares;
    address[] private addresses;

    //----------------------------------------
    // Constants
    //----------------------------------------
    uint256 internal constant MAX_JUDGES = 2;
    uint256 internal constant JUDGE_PER_SIDE = 1;
    uint256 internal constant MAX_INT = uint256(-1);

    //----------------------------------------
    // Token addresses
    //----------------------------------------
    address public constant maUSDC =
        address(0x9719d867A500Ef117cC201206B8ab51e794d3F82);
    address public constant QUICK =
        address(0x831753DD7087CaC61aB5644b308642cc1c33Dc13);

    //----------------------------------------
    // Contract roles
    //----------------------------------------
    bytes32 internal constant BETTOR_ROLE = keccak256("BETTOR");
    bytes32 internal constant COUNTER_BETTOR_ROLE = keccak256("COUNTER_BETTOR");
    bytes32 internal constant BETTOR_JUDGE = keccak256("BETTOR_JUDGE");
    bytes32 internal constant COUNTER_BETTOR_JUDGE =
        keccak256("COUNTER_BETTOR_JUDGE");

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

    receive() external payable {}

    //----------------------------------------
    // Modifiers
    //----------------------------------------

    modifier atState(BetState _state) {
        require(
            betStorage.betState == _state,
            "This functionality is not allowed in current bet state"
        );
        _;
    }

    modifier roleNotTaken(bytes32 _role) {
        require(
            betStorage.roleParticipants[_role] == address(0),
            "That role is taken"
        );
        _;
    }

    modifier onlyWinner(address _sender) {
        require(
            betStorage.votes[_sender] > JUDGE_PER_SIDE,
            "You are not allowed to claim the prize"
        );
        _;
    }

    modifier onlyJudgeOrDisputer(address _sender) {
        require(
            betStorage.participantRoles[_sender] == BETTOR_JUDGE ||
                betStorage.participantRoles[_sender] == COUNTER_BETTOR_JUDGE ||
                betStorage.admin == _sender,
            "Sender is not a judge"
        );
        _;
    }

    modifier didNotVote(address _sender) {
        require(betStorage.didVote[_sender] != true, "You have already voted");
        _;
    }

    modifier matchDeposit(uint256 _value) {
        require(
            _value == betStorage.deposit,
            "Value sent doesn't match deposit value"
        );
        _;
    }

    modifier excludeBettors(address _sender) {
        require(
            betStorage.roleParticipants[BETTOR_ROLE] != _sender &&
                betStorage.roleParticipants[COUNTER_BETTOR_ROLE] != _sender,
            "You are not allowed to be a judge"
        );
        _;
    }

    modifier timedTransition(BetState _state) {
        if (
            betStorage.betState == _state &&
            block.timestamp >= betStorage.expirationTime
        ) {
            _nextState();
        }
        _;
    }

    modifier uniqueJudges(address _sender) {
        require(
            _sender != betStorage.roleParticipants[BETTOR_JUDGE] &&
                _sender != betStorage.roleParticipants[COUNTER_BETTOR_JUDGE],
            "You are a judge already"
        );
        _;
    }

    modifier uniqueBettors(address _sender) {
        require(
            _sender != betStorage.roleParticipants[BETTOR_ROLE] &&
                _sender != betStorage.roleParticipants[COUNTER_BETTOR_ROLE],
            "You are a bettor already"
        );
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
    function claimReward() public atState(BetState.BET_OVER) {
        splitter.release(msg.sender);
    }

    /**
     * @notice Returns bet description
     */
    function getBet()
        public
        view
        returns (
            string memory description,
            BetState betState,
            uint256 expirationTime,
            uint256 deposit
        )
    {
        return (
            betStorage.description,
            betStorage.betState,
            betStorage.expirationTime,
            betStorage.deposit
        );
    }

    function getBalance() public view returns (uint256) {
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
    function _bet(bool _choice, uint256 _value)
        internal
        atState(BetState.ASSIGNING_BETTORS)
        matchDeposit(_value)
        uniqueBettors(msg.sender)
        returns (BetState)
    {
        if (_choice) {
            _assignRole(msg.sender, BETTOR_ROLE, "BETTOR");
        } else {
            _assignRole(msg.sender, COUNTER_BETTOR_ROLE, "COUNTER BETTOR");
        }
        if (
            betStorage.roleParticipants[BETTOR_ROLE] != address(0) &&
            betStorage.roleParticipants[COUNTER_BETTOR_ROLE] != address(0)
        ) {
            _nextState();
        }
        return betStorage.betState;
    }

    /**
     * @notice Assigns caller as bettor's or counter bettor's judge
     * @param _choice Determines if caller will be assigned as a bettor's judge(true) or counter bettor's judge(false)
     */
    function _addJudge(bool _choice)
        internal
        atState(BetState.ASSIGNING_JUDGES)
        excludeBettors(msg.sender)
        uniqueJudges(msg.sender)
        returns (BetState)
    {
        if (_choice) {
            _assignRole(msg.sender, BETTOR_JUDGE, "BETTOR JUDGE");
        } else {
            _assignRole(
                msg.sender,
                COUNTER_BETTOR_JUDGE,
                "COUNTER BETTOR JUDGE"
            );
        }
        if (
            betStorage.roleParticipants[BETTOR_JUDGE] != address(0) &&
            betStorage.roleParticipants[COUNTER_BETTOR_JUDGE] != address(0)
        ) {
            //Exchange ETH(MATIC) for maUSDC here
            _swapEthForMaUSDC(MAX_INT);
            _nextState();
        }
        return betStorage.betState;
    }

    /**
     * @notice Gives a vote to bettor or counter bettor
     * @param _vote Determines if vote will be given to bettor(true) or counter bettor(false)
     */
    function _giveVote(bool _vote)
        internal
        timedTransition(BetState.BET_WAITING)
        atState(BetState.VOTING_STAGE)
        onlyJudgeOrDisputer(msg.sender)
        didNotVote(msg.sender)
        returns (BetState)
    {
        betStorage.didVote[msg.sender] = true;
        if (_vote) {
            betStorage.votes[
                betStorage.roleParticipants[BETTOR_ROLE]
            ] = betStorage.votes[betStorage.roleParticipants[BETTOR_ROLE]].add(
                1
            );
        } else {
            betStorage.votes[
                betStorage.roleParticipants[COUNTER_BETTOR_ROLE]
            ] = betStorage.votes[
                betStorage.roleParticipants[COUNTER_BETTOR_ROLE]
            ]
                .add(1);
        }
        if (
            betStorage.votes[betStorage.roleParticipants[COUNTER_BETTOR_ROLE]] >
            JUDGE_PER_SIDE ||
            betStorage.votes[betStorage.roleParticipants[BETTOR_ROLE]] >
            JUDGE_PER_SIDE
        ) {
            if (
                betStorage.votes[
                    betStorage.roleParticipants[COUNTER_BETTOR_ROLE]
                ] > betStorage.votes[betStorage.roleParticipants[BETTOR_ROLE]]
            ) winner = betStorage.roleParticipants[COUNTER_BETTOR_ROLE];
            else winner = betStorage.roleParticipants[BETTOR_ROLE];

            _swapMaUSDCForEth(MAX_INT);
            _setUpPaymentSplitter();
            _nextState();
        } else if (
            betStorage.votes[betStorage.roleParticipants[COUNTER_BETTOR_ROLE]]
                .add(
                betStorage.votes[betStorage.roleParticipants[BETTOR_ROLE]]
            ) == MAX_JUDGES
        ) {
            emit Dispute();
        }
        return betStorage.betState;
    }

    /**
     * @notice Transits bet to a new state
     */
    function _nextState() internal {
        betStorage.betState = BetState(uint256(betStorage.betState) + 1);
        emit CurrentState(betStorage.betState);
    }

    /**
     * @notice Gives a certain role to caller
     * @param _sender Address of a caller
     * @param _role Hashed role name "keccak256"
     * @param _roleName Role name as string
     */
    function _assignRole(
        address _sender,
        bytes32 _role,
        bytes32 _roleName
    ) internal roleNotTaken(_role) {
        betStorage.participantRoles[_sender] = _role;
        betStorage.roleParticipants[_role] = _sender;
        emit Action(_sender, _roleName, "Role assigned");
    }

    /**
     * @notice Swaps MATIC(ETH) tokens for maUSDC tokens
     * @param _unixTime If transaction is not mined and unixTime has expire, transaction will revert
     */
    function _swapEthForMaUSDC(uint256 _unixTime) internal {
        address[] memory path1 = _createPath(router.WETH(), QUICK);
        address[] memory path2 = _createPath(QUICK, maUSDC);

        router.swapExactETHForTokens{value: address(this).balance}(
            0,
            path1,
            address(this),
            _unixTime
        );

        uint256 QUICKAmount = _getTokenBalance(address(this), QUICK);
        IERC20(QUICK).approve(address(router), QUICKAmount);
        router.swapExactTokensForTokens(
            QUICKAmount,
            0,
            path2,
            address(this),
            _unixTime
        );
    }

    /**
     * @notice Swaps maUSDC tokens for MATIC(ETH) tokens
     * @param _unixTime If transaction is not mined and unixTime has expire, transaction will revert
     */
    function _swapMaUSDCForEth(uint256 _unixTime) internal {
        address[] memory path1 = _createPath(maUSDC, QUICK);
        address[] memory path2 = _createPath(QUICK, router.WETH());

        uint256 maUSDCAmount = _getTokenBalance(address(this), maUSDC);
        IERC20(maUSDC).approve(address(router), maUSDCAmount);
        router.swapExactTokensForTokens(
            maUSDCAmount,
            0,
            path1,
            address(this),
            _unixTime
        );

        uint256 QUICKAmount = _getTokenBalance(address(this), QUICK);
        IERC20(QUICK).approve(address(router), QUICKAmount);
        router.swapExactTokensForETH(
            QUICKAmount,
            0,
            path2,
            address(this),
            _unixTime
        );
    }

    /**
     * @notice Returns token balance of an address
     * @param _target address of token bearer
     * @param _token address of a token
     */
    function _getTokenBalance(address _target, address _token)
        internal
        view
        returns (uint256)
    {
        return IERC20(_token).balanceOf(_target);
    }

    /**
     * @notice Returns trade route for a token exchange
     * @param _address1 address of starting token (input)
     * @param _address2 address of output token
     */
    function _createPath(address _address1, address _address2)
        internal
        pure
        returns (address[] memory)
    {
        address[] memory path = new address[](2);
        path[0] = _address1;
        path[1] = _address2;

        return path;
    }

    /**
     * @notice Sets up PaymentSplitter so funds can be claimed
     */
    function _setUpPaymentSplitter() internal {
        addresses = [
            winner,
            betStorage.roleParticipants[COUNTER_BETTOR_JUDGE],
            betStorage.roleParticipants[BETTOR_JUDGE],
            betStorage.admin
        ];
        shares = [97, 1, 1, 1];

        splitter = new PaymentSplitter{value: address(this).balance}(
            addresses,
            shares
        );
    }
}
