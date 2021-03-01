// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Libraries
import {IBetMapper} from "./interfaces/IBetMapper.sol";
import {IExchange} from "./interfaces/IExchange.sol";
import {IQuickSwapRouter02} from "./interfaces/IQuickSwapRouter02.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {
    ReentrancyGuard
} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {
    PaymentSplitter
} from "@openzeppelin/contracts/payment/PaymentSplitter.sol";

contract Bet is ReentrancyGuard {
    bool private masterCopy = true;

    //----------------------------------------
    // Global variables
    //----------------------------------------
    PaymentSplitter private splitter;
    IBetMapper private betMapper;
    IExchange internal exchange;

    //----------------------------------------
    // Constants
    //----------------------------------------
    uint256 internal constant MAX_JUDGES = 2;
    uint256 internal constant JUDGE_PER_SIDE = 1;
    uint256 internal constant MAX_INT = type(uint256).max;
    address public constant maUSDC =
        address(0x9719d867A500Ef117cC201206B8ab51e794d3F82);

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
     * BET_CREATED (0) - When contract is created but nobody deployed a fee
     * ASSIGNING_BETTORS (1) - Assigning bettor and counter bettor
     * ASSIGNING_JUDGES (2) - Assigning bettor's and counter bettor's judges
     * BET_WAITING (3) - Waiting for time to expire so judges can start voting
     * VOTING_STAGE (4) - Judges are allowed to vote
     * FUNDS_WITHDRAWAL (5) - Participants are able to withdraw funds
     * BET_OVER (6) - Either bettor or counter bettor won
     */

    enum BetState {
        BET_CREATED,
        ASSIGNING_BETTORS,
        ASSIGNING_JUDGES,
        BET_WAITING,
        VOTING_STAGE,
        FUNDS_WITHDRAWAL,
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
        uint256 judgeShare;
        address winner;
        uint256[] shares;
        address[] addresses;
    }

    event CurrentState(BetState _betState);
    event Action(address _sender, bytes32 _roleName, bytes32 _action);
    event Dispute();

    //----------------------------------------
    // State variables
    //----------------------------------------

    Storage private betStorage;

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
     * @notice Constructor replacement
     */
    function init(
        address _admin,
        uint256 _deposit,
        string memory _description,
        uint256 _expirationTime,
        address _mapperAddress,
        address _exchangeAddress
    ) external nonReentrant transitionAfter atState(BetState.BET_CREATED) {
        require(!masterCopy, "Not allowed to make changes on master copy.");

        betStorage.admin = _admin;
        betStorage.description = _description;
        betStorage.deposit = _deposit;
        betStorage.expirationTime = _expirationTime;
        betStorage.betState = BetState.BET_CREATED;

        betMapper = IBetMapper(_mapperAddress);
        exchange = IExchange(_exchangeAddress);

        emit CurrentState(betStorage.betState);
    }

    /**
     * @notice Assigns caller as bettor
     */
    function addBettor() external payable {
        _bet(true, msg.value);
    }

    /**
     * @notice Assigns caller as counter bettor
     */
    function addCounterBettor() external payable {
        _bet(false, msg.value);
    }

    /**
     * @notice Assigns caller as a bettor's judge
     */
    function addBettorJudge() external {
        _addJudge(true);
    }

    /**
     * @notice Assigns caller as a counter bettor's judge
     */
    function addCounterBettorJudge() external {
        _addJudge(false);
    }

    /**
     * @notice Judge or admin can call this function to vote for bettor
     */
    function voteForBettor() external {
        _giveVote(true);
    }

    /**
     * @notice Judge or admin can call this function to vote for counter bettor
     */
    function voteForCounterBettor() external {
        _giveVote(false);
    }

    /**
     * @notice Transfers this contract's balance to caller if he won this bet
     */
    function claimReward()
        public
        nonReentrant
        atState(BetState.FUNDS_WITHDRAWAL)
    {
        splitter.release(payable(msg.sender));
        if (
            address(splitter).balance < betStorage.judgeShare ||
            betStorage.judgeShare == 0
        ) _nextState();
    }

    /**
     * @notice Returns bet description
     */
    function getBet()
        external
        view
        returns (
            address betAddress,
            string memory description,
            BetState betState,
            uint256 expirationTime,
            uint256 deposit
        )
    {
        return (
            address(this),
            betStorage.description,
            betStorage.betState,
            betStorage.expirationTime,
            betStorage.deposit
        );
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
        betMapper.registerBettor(msg.sender);
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
        betMapper.registerJudge(msg.sender);
        if (
            betStorage.roleParticipants[BETTOR_JUDGE] != address(0) &&
            betStorage.roleParticipants[COUNTER_BETTOR_JUDGE] != address(0)
        ) {
            //Exchange ETH(MATIC) for maUSDC here
            exchange.swapMaticForMaUSDC{value: address(this).balance}(MAX_INT);
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
            betStorage.votes[betStorage.roleParticipants[BETTOR_ROLE]] =
                betStorage.votes[betStorage.roleParticipants[BETTOR_ROLE]] +
                1;
        } else {
            betStorage.votes[betStorage.roleParticipants[COUNTER_BETTOR_ROLE]] =
                betStorage.votes[
                    betStorage.roleParticipants[COUNTER_BETTOR_ROLE]
                ] +
                1;
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
            )
                betStorage.winner = betStorage.roleParticipants[
                    COUNTER_BETTOR_ROLE
                ];
            else betStorage.winner = betStorage.roleParticipants[BETTOR_ROLE];

            IERC20(maUSDC).approve(
                address(exchange),
                _getTokenBalance(address(this), maUSDC)
            );
            exchange.swapMaUSDCForMatic(MAX_INT);
            _setUpPaymentSplitter();
            _nextState();
        } else if (
            betStorage.votes[betStorage.roleParticipants[COUNTER_BETTOR_ROLE]] +
                betStorage.votes[betStorage.roleParticipants[BETTOR_ROLE]] ==
            MAX_JUDGES
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
     * if there is positive yield will send third of it to factory, other two thirds will be available to for judges to claim
     * otherwise only winner gets reward
     */
    function _setUpPaymentSplitter() internal {
        uint256 yieldPercentage;

        if (address(this).balance > 2 * betStorage.deposit) {
            yieldPercentage =
                ((address(this).balance - 2 * betStorage.deposit) * 100) /
                address(this).balance;
        }

        if (yieldPercentage > 0) {
            betStorage.judgeShare =
                (yieldPercentage * address(this).balance) /
                300;
            payable(betStorage.admin).transfer(betStorage.judgeShare);
            betStorage.addresses = [
                betStorage.winner,
                betStorage.roleParticipants[COUNTER_BETTOR_JUDGE],
                betStorage.roleParticipants[BETTOR_JUDGE]
            ];
            betStorage.shares = [
                2 * betStorage.deposit,
                betStorage.judgeShare,
                betStorage.judgeShare
            ];
        } else {
            betStorage.addresses = [betStorage.winner];
            betStorage.shares = [1];
        }

        splitter = new PaymentSplitter{value: address(this).balance}(
            betStorage.addresses,
            betStorage.shares
        );
    }
}
