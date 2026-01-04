// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PriceOracle
 * @notice Wrapper for Chainlink Price Feeds
 * @dev Provides price data for trading decisions
 */
contract PriceOracle is Ownable {
    // Mapping of token symbols to their price feeds
    mapping(string => address) public priceFeeds;

    // Default staleness threshold (1 hour)
    uint256 public stalenessThreshold = 3600;

    // Struct for price data
    struct PriceData {
        uint256 price;
        uint8 decimals;
        uint256 timestamp;
        uint80 roundId;
    }

    // Events
    event PriceFeedSet(string symbol, address priceFeed);
    event StalenessThresholdUpdated(uint256 oldThreshold, uint256 newThreshold);

    // Errors
    error PriceFeedNotFound(string symbol);
    error StalePrice(uint256 updatedAt, uint256 stalenessThreshold);
    error InvalidPrice();

    /**
     * @notice Constructor
     */
    constructor() Ownable(msg.sender) {}

    /**
     * @notice Get the latest price for a symbol
     * @param symbol The token symbol (e.g., "ETH", "BTC")
     * @return priceData The price data struct
     */
    function getLatestPrice(
        string calldata symbol
    ) external view returns (PriceData memory priceData) {
        address priceFeed = priceFeeds[symbol];
        if (priceFeed == address(0)) revert PriceFeedNotFound(symbol);

        return _getPriceData(priceFeed);
    }

    /**
     * @notice Get the latest price from a specific feed address
     * @param priceFeed The Chainlink price feed address
     * @return priceData The price data struct
     */
    function getLatestPriceFromFeed(
        address priceFeed
    ) external view returns (PriceData memory priceData) {
        return _getPriceData(priceFeed);
    }

    /**
     * @notice Get normalized price (18 decimals) for a symbol
     * @param symbol The token symbol
     * @return price The normalized price
     */
    function getNormalizedPrice(
        string calldata symbol
    ) external view returns (uint256 price) {
        address priceFeed = priceFeeds[symbol];
        if (priceFeed == address(0)) revert PriceFeedNotFound(symbol);

        PriceData memory data = _getPriceData(priceFeed);
        
        // Normalize to 18 decimals
        if (data.decimals < 18) {
            return data.price * 10 ** (18 - data.decimals);
        } else if (data.decimals > 18) {
            return data.price / 10 ** (data.decimals - 18);
        }
        return data.price;
    }

    /**
     * @notice Internal function to get price data
     */
    function _getPriceData(
        address priceFeed
    ) internal view returns (PriceData memory priceData) {
        AggregatorV3Interface feed = AggregatorV3Interface(priceFeed);

        (
            uint80 roundId,
            int256 answer,
            ,
            uint256 updatedAt,
        ) = feed.latestRoundData();

        // Check for staleness
        if (block.timestamp - updatedAt > stalenessThreshold) {
            revert StalePrice(updatedAt, stalenessThreshold);
        }

        // Check for valid price
        if (answer <= 0) revert InvalidPrice();

        priceData = PriceData({
            price: uint256(answer),
            decimals: feed.decimals(),
            timestamp: updatedAt,
            roundId: roundId
        });

        return priceData;
    }

    /**
     * @notice Check if a price is stale
     * @param symbol The token symbol
     * @return isStale Whether the price is stale
     */
    function isPriceStale(string calldata symbol) external view returns (bool isStale) {
        address priceFeed = priceFeeds[symbol];
        if (priceFeed == address(0)) revert PriceFeedNotFound(symbol);

        AggregatorV3Interface feed = AggregatorV3Interface(priceFeed);
        (, , , uint256 updatedAt, ) = feed.latestRoundData();

        return block.timestamp - updatedAt > stalenessThreshold;
    }

    /**
     * @notice Set a price feed for a symbol
     * @param symbol The token symbol
     * @param priceFeed The Chainlink price feed address
     */
    function setPriceFeed(
        string calldata symbol,
        address priceFeed
    ) external onlyOwner {
        priceFeeds[symbol] = priceFeed;
        emit PriceFeedSet(symbol, priceFeed);
    }

    /**
     * @notice Set multiple price feeds at once
     * @param symbols Array of token symbols
     * @param feeds Array of price feed addresses
     */
    function setPriceFeeds(
        string[] calldata symbols,
        address[] calldata feeds
    ) external onlyOwner {
        require(symbols.length == feeds.length, "Length mismatch");
        
        for (uint256 i = 0; i < symbols.length; i++) {
            priceFeeds[symbols[i]] = feeds[i];
            emit PriceFeedSet(symbols[i], feeds[i]);
        }
    }

    /**
     * @notice Update staleness threshold
     * @param newThreshold The new threshold in seconds
     */
    function setStalenessThreshold(uint256 newThreshold) external onlyOwner {
        uint256 oldThreshold = stalenessThreshold;
        stalenessThreshold = newThreshold;
        emit StalenessThresholdUpdated(oldThreshold, newThreshold);
    }

    /**
     * @notice Get price feed decimals
     * @param symbol The token symbol
     * @return decimals The number of decimals
     */
    function getDecimals(string calldata symbol) external view returns (uint8) {
        address priceFeed = priceFeeds[symbol];
        if (priceFeed == address(0)) revert PriceFeedNotFound(symbol);
        return AggregatorV3Interface(priceFeed).decimals();
    }
}
