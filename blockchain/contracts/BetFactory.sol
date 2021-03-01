// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {IBet} from "./interfaces/IBet.sol";

// Libraries
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract BetFactory is Ownable {
    //----------------------------------------
    // State variables
    //----------------------------------------
    mapping(address => bool) private deployed;
    address private betAddress;
    address private mapperAddress;
    address private exchangeAddress;
    IBet[] private bets;

    //----------------------------------------
    // Constructor
    //----------------------------------------
    constructor() {}

    event BetDeployed(address _deployedBet);

    //----------------------------------------
    // External functions
    //----------------------------------------
    /**
     * @notice Creates a new Bet
     * @param description Description of the bet
     * @param expirationTime Timestamp when the bet expires/can be judged upon
     */
    function createBet(
        uint256 deposit,
        string memory description,
        uint256 expirationTime
    ) external returns (IBet) {
        address betClone = createClone(betAddress);
        IBet bet = IBet(betClone);
        bet.init(
            this.owner(),
            deposit,
            description,
            expirationTime,
            mapperAddress,
            exchangeAddress
        );
        bets.push(bet);
        deployed[betClone] = true;

        emit BetDeployed(betClone);

        return bet;
    }

    function createClone(address target) internal returns (address result) {
        bytes20 targetBytes = bytes20(target);
        assembly {
            let clone := mload(0x40)
            mstore(
                clone,
                0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000
            )
            mstore(add(clone, 0x14), targetBytes)
            mstore(
                add(clone, 0x28),
                0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000
            )
            result := create(0, clone, 0x37)
        }
    }

    function setBetAddress(address _address) external onlyOwner {
        betAddress = _address;
    }

    function setMapperAddress(address _address) external onlyOwner {
        mapperAddress = _address;
    }

    function setExchangeAddress(address _address) external onlyOwner {
        exchangeAddress = _address;
    }

    /**
     * @notice Returns an array of all deployed bet instances
     */
    function getBets() external view returns (IBet[] memory) {
        return bets;
    }

    /**
     * @param _address bet address to check
     * @notice verifies if a bet is deployed
     */
    function isBetDeployed(address _address) external view returns (bool) {
        return deployed[_address];
    }
}
