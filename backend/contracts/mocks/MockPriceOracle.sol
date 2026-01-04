// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockPriceOracle
 * @notice Mock price oracle for testing
 * @dev Simulates Chainlink AggregatorV3Interface
 */
contract MockPriceOracle is Ownable {
    int256 private _price;
    uint8 private _decimals;
    uint256 private _updatedAt;
    uint80 private _roundId;

    string public description;

    /**
     * @notice Constructor
     * @param initialPrice Initial price (in feed decimals)
     * @param decimals_ Number of decimals
     * @param description_ Description of the price feed
     */
    constructor(
        int256 initialPrice,
        uint8 decimals_,
        string memory description_
    ) Ownable(msg.sender) {
        _price = initialPrice;
        _decimals = decimals_;
        _updatedAt = block.timestamp;
        _roundId = 1;
        description = description_;
    }

    /**
     * @notice Get decimals
     */
    function decimals() external view returns (uint8) {
        return _decimals;
    }

    /**
     * @notice Get latest round data (Chainlink interface)
     */
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (
            _roundId,
            _price,
            _updatedAt,
            _updatedAt,
            _roundId
        );
    }

    /**
     * @notice Get round data for a specific round
     */
    function getRoundData(uint80 roundId_)
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        require(roundId_ <= _roundId, "Round not available");
        return (
            roundId_,
            _price,
            _updatedAt,
            _updatedAt,
            roundId_
        );
    }

    /**
     * @notice Update the price (for testing)
     * @param newPrice The new price
     */
    function setPrice(int256 newPrice) external onlyOwner {
        _price = newPrice;
        _updatedAt = block.timestamp;
        _roundId++;
    }

    /**
     * @notice Update the timestamp (for staleness testing)
     * @param newTimestamp The new timestamp
     */
    function setUpdatedAt(uint256 newTimestamp) external onlyOwner {
        _updatedAt = newTimestamp;
    }

    /**
     * @notice Simulate price movement
     * @param percentChange Percentage change (positive or negative, in basis points)
     */
    function simulatePriceChange(int256 percentChange) external onlyOwner {
        int256 change = (_price * percentChange) / 10000;
        _price = _price + change;
        _updatedAt = block.timestamp;
        _roundId++;
    }

    /**
     * @notice Get current price
     */
    function getPrice() external view returns (int256) {
        return _price;
    }
}
