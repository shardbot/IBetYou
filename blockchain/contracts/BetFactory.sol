// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {IBet} from "./interfaces/IBet.sol";

// Libraries
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract BetFactory is Ownable {
    //----------------------------------------
    // State variables
    //----------------------------------------
    address private betAddress;
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
        bet.init(this.owner(), deposit, description, expirationTime);
        bets.push(bet);

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

    function setBetAddress(address _address) public onlyOwner {
        betAddress = _address;
    }

    /**
     * @notice Returns an array of all deployed bet instances
     */
    function getBets() public view returns (IBet[] memory) {
        return bets;
    }
}
