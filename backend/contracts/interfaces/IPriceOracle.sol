// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IPriceOracle
 * @notice Interface for the price oracle that integrates with Chainlink Price Feeds
 */
interface IPriceOracle {
    /// @notice Struct for price data
    struct PriceData {
        uint256 price;
        uint8 decimals;
        uint256 timestamp;
        uint80 roundId;
    }

    /// @notice Get the latest price for a token pair
    /// @param priceFeed The Chainlink price feed address
    /// @return priceData The price data struct
    function getLatestPrice(
        address priceFeed
    ) external view returns (PriceData memory priceData);

    /// @notice Get the latest price as a uint256 (normalized to 18 decimals)
    /// @param priceFeed The Chainlink price feed address
    /// @return price The normalized price
    function getLatestPriceNormalized(
        address priceFeed
    ) external view returns (uint256 price);

    /// @notice Check if a price feed is stale
    /// @param priceFeed The Chainlink price feed address
    /// @param maxAge The maximum age in seconds
    /// @return isStale Whether the price is stale
    function isPriceStale(
        address priceFeed,
        uint256 maxAge
    ) external view returns (bool isStale);

    /// @notice Get the price feed decimals
    /// @param priceFeed The Chainlink price feed address
    /// @return decimals The number of decimals
    function getPriceFeedDecimals(
        address priceFeed
    ) external view returns (uint8 decimals);
}
