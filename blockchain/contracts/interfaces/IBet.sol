// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

interface IBet {
    enum BetState {
        BET_CREATED,
        ASSIGNING_BETTORS,
        ASSIGNING_JUDGES,
        BET_WAITING,
        VOTING_STAGE,
        BET_OVER
    }

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
    ) external;

    /**
     * @notice Assigns caller as bettor
     */
    function addBettor() external payable;

    /**
     * @notice Assigns caller as counter bettor
     */
    function addCounterBettor() external payable;

    /**
     * @notice Assigns caller as a bettor's judge
     */
    function addBettorJudge() external;

    /**
     * @notice Assigns caller as a counter bettor's judge
     */
    function addCounterBettorJudge() external;

    /**
     * @notice Judge or admin can call this function to vote for bettor
     */
    function voteForBettor() external;

    /**
     * @notice Judge or admin can call this function to vote for counter bettor
     */
    function voteForCounterBettor() external;

    /**
     * @notice Transfers this contract's balance to caller if he won this bet
     */
    function claimReward() external;

    /**
     * @notice Returns if _address voted
     * @param _address address to be checked
     */
    function didVote(address _address) external view returns (bool);

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
        );
}
