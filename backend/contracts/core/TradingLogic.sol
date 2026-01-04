// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

/**
 * @title TradingLogic
 * @notice Implements trading strategies including stop-loss, take-profit, and DCA
 * @dev Uses Chainlink price feeds for price data
 */
contract TradingLogic is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Strategy types
    enum StrategyType {
        NONE,
        STOP_LOSS,
        TAKE_PROFIT,
        DCA,
        LIMIT_ORDER
    }

    // Trade status
    enum TradeStatus {
        PENDING,
        EXECUTED,
        CANCELLED,
        EXPIRED
    }

    // Trade struct
    struct Trade {
        uint256 id;
        address trader;
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        uint256 targetPrice; // Price in 8 decimals (Chainlink format)
        StrategyType strategy;
        TradeStatus status;
        uint256 createdAt;
        uint256 expiresAt;
        bool isAboveTarget; // true = execute when price >= target, false = execute when price <= target
    }

    // DCA Plan struct
    struct DCAPlan {
        uint256 id;
        address trader;
        address tokenIn;
        address tokenOut;
        uint256 amountPerInterval;
        uint256 interval; // in seconds
        uint256 totalIntervals;
        uint256 executedIntervals;
        uint256 lastExecutedAt;
        bool active;
    }

    // Price feed mappings (token => price feed address)
    mapping(address => address) public priceFeeds;

    // Trade storage
    mapping(uint256 => Trade) public trades;
    uint256 public tradeCounter;

    // DCA storage
    mapping(uint256 => DCAPlan) public dcaPlans;
    uint256 public dcaCounter;

    // User trade mappings
    mapping(address => uint256[]) public userTrades;
    mapping(address => uint256[]) public userDCAPlans;

    // Swap router reference (for executing trades)
    address public swapRouter;

    // Price staleness threshold (1 hour)
    uint256 public constant PRICE_STALENESS_THRESHOLD = 3600;

    // Events
    event TradeCreated(
        uint256 indexed tradeId,
        address indexed trader,
        StrategyType strategy,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 targetPrice
    );

    event TradeExecuted(
        uint256 indexed tradeId,
        address indexed trader,
        uint256 executionPrice,
        uint256 amountOut
    );

    event TradeCancelled(uint256 indexed tradeId, address indexed trader);

    event DCAPlanCreated(
        uint256 indexed planId,
        address indexed trader,
        address tokenIn,
        address tokenOut,
        uint256 amountPerInterval,
        uint256 totalIntervals
    );

    event DCAExecuted(
        uint256 indexed planId,
        uint256 intervalNumber,
        uint256 amountOut
    );

    event DCAPlanCancelled(uint256 indexed planId, address indexed trader);

    event PriceFeedUpdated(address token, address priceFeed);
    event SwapRouterUpdated(address oldRouter, address newRouter);

    // Errors
    error InvalidToken();
    error InvalidAmount();
    error InvalidPrice();
    error InvalidInterval();
    error TradeNotFound();
    error TradeNotPending();
    error NotTradeOwner();
    error PriceFeedNotSet();
    error PriceStale();
    error ConditionNotMet();
    error PlanNotActive();
    error IntervalNotReached();
    error SwapRouterNotSet();

    /**
     * @notice Constructor
     */
    constructor() Ownable(msg.sender) {}

    /**
     * @notice Create a stop-loss trade
     * @param tokenIn The token to sell
     * @param tokenOut The token to receive
     * @param amountIn The amount to sell
     * @param stopPrice The stop-loss price (sell when price drops to this)
     * @param expiresIn How long until the trade expires (in seconds)
     * @return tradeId The trade ID
     */
    function createStopLoss(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 stopPrice,
        uint256 expiresIn
    ) external nonReentrant returns (uint256 tradeId) {
        return _createTrade(
            tokenIn,
            tokenOut,
            amountIn,
            stopPrice,
            StrategyType.STOP_LOSS,
            expiresIn,
            false // Execute when price <= target
        );
    }

    /**
     * @notice Create a take-profit trade
     * @param tokenIn The token to sell
     * @param tokenOut The token to receive
     * @param amountIn The amount to sell
     * @param targetPrice The take-profit price (sell when price rises to this)
     * @param expiresIn How long until the trade expires (in seconds)
     * @return tradeId The trade ID
     */
    function createTakeProfit(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 targetPrice,
        uint256 expiresIn
    ) external nonReentrant returns (uint256 tradeId) {
        return _createTrade(
            tokenIn,
            tokenOut,
            amountIn,
            targetPrice,
            StrategyType.TAKE_PROFIT,
            expiresIn,
            true // Execute when price >= target
        );
    }

    /**
     * @notice Create a limit order
     * @param tokenIn The token to sell
     * @param tokenOut The token to receive
     * @param amountIn The amount to sell
     * @param limitPrice The limit price
     * @param isBuyOrder If true, execute when price <= limit; if false, when price >= limit
     * @param expiresIn How long until the order expires
     * @return tradeId The trade ID
     */
    function createLimitOrder(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 limitPrice,
        bool isBuyOrder,
        uint256 expiresIn
    ) external nonReentrant returns (uint256 tradeId) {
        return _createTrade(
            tokenIn,
            tokenOut,
            amountIn,
            limitPrice,
            StrategyType.LIMIT_ORDER,
            expiresIn,
            !isBuyOrder // Buy order executes when price <= target
        );
    }

    /**
     * @notice Internal function to create a trade
     */
    function _createTrade(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 targetPrice,
        StrategyType strategy,
        uint256 expiresIn,
        bool isAboveTarget
    ) internal returns (uint256 tradeId) {
        if (tokenIn == address(0) || tokenOut == address(0)) revert InvalidToken();
        if (amountIn == 0) revert InvalidAmount();
        if (targetPrice == 0) revert InvalidPrice();

        // Transfer tokens from user
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);

        tradeId = ++tradeCounter;

        trades[tradeId] = Trade({
            id: tradeId,
            trader: msg.sender,
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            amountIn: amountIn,
            targetPrice: targetPrice,
            strategy: strategy,
            status: TradeStatus.PENDING,
            createdAt: block.timestamp,
            expiresAt: block.timestamp + expiresIn,
            isAboveTarget: isAboveTarget
        });

        userTrades[msg.sender].push(tradeId);

        emit TradeCreated(
            tradeId,
            msg.sender,
            strategy,
            tokenIn,
            tokenOut,
            amountIn,
            targetPrice
        );

        return tradeId;
    }

    /**
     * @notice Create a DCA (Dollar Cost Averaging) plan
     * @param tokenIn The token to spend
     * @param tokenOut The token to accumulate
     * @param amountPerInterval The amount to spend per interval
     * @param interval The time between executions (in seconds)
     * @param totalIntervals The total number of intervals
     * @return planId The DCA plan ID
     */
    function createDCAPlan(
        address tokenIn,
        address tokenOut,
        uint256 amountPerInterval,
        uint256 interval,
        uint256 totalIntervals
    ) external nonReentrant returns (uint256 planId) {
        if (tokenIn == address(0) || tokenOut == address(0)) revert InvalidToken();
        if (amountPerInterval == 0) revert InvalidAmount();
        if (interval < 60) revert InvalidInterval(); // Min 1 minute
        if (totalIntervals == 0) revert InvalidInterval();

        // Transfer total amount upfront
        uint256 totalAmount = amountPerInterval * totalIntervals;
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), totalAmount);

        planId = ++dcaCounter;

        dcaPlans[planId] = DCAPlan({
            id: planId,
            trader: msg.sender,
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            amountPerInterval: amountPerInterval,
            interval: interval,
            totalIntervals: totalIntervals,
            executedIntervals: 0,
            lastExecutedAt: block.timestamp,
            active: true
        });

        userDCAPlans[msg.sender].push(planId);

        emit DCAPlanCreated(
            planId,
            msg.sender,
            tokenIn,
            tokenOut,
            amountPerInterval,
            totalIntervals
        );

        return planId;
    }

    /**
     * @notice Check if a trade condition is met
     * @param tradeId The trade ID
     * @return met Whether the condition is met
     * @return currentPrice The current price
     */
    function checkTradeCondition(
        uint256 tradeId
    ) public view returns (bool met, uint256 currentPrice) {
        Trade storage trade = trades[tradeId];
        
        if (trade.status != TradeStatus.PENDING) {
            return (false, 0);
        }

        if (block.timestamp >= trade.expiresAt) {
            return (false, 0);
        }

        address priceFeed = priceFeeds[trade.tokenIn];
        if (priceFeed == address(0)) revert PriceFeedNotSet();

        currentPrice = _getLatestPrice(priceFeed);

        if (trade.isAboveTarget) {
            met = currentPrice >= trade.targetPrice;
        } else {
            met = currentPrice <= trade.targetPrice;
        }

        return (met, currentPrice);
    }

    /**
     * @notice Execute a trade if conditions are met
     * @param tradeId The trade ID
     * @dev This would be called by a keeper/bot
     */
    function executeTrade(uint256 tradeId) external nonReentrant {
        Trade storage trade = trades[tradeId];
        
        if (trade.status != TradeStatus.PENDING) revert TradeNotPending();
        
        (bool conditionMet, uint256 currentPrice) = checkTradeCondition(tradeId);
        if (!conditionMet) revert ConditionNotMet();

        trade.status = TradeStatus.EXECUTED;

        // In production, this would call the swap router
        // For now, we just transfer tokens back (simulating trade)
        // The actual swap integration would use the SwapRouter contract
        
        emit TradeExecuted(tradeId, trade.trader, currentPrice, trade.amountIn);
    }

    /**
     * @notice Execute DCA interval
     * @param planId The DCA plan ID
     */
    function executeDCAInterval(uint256 planId) external nonReentrant {
        DCAPlan storage plan = dcaPlans[planId];
        
        if (!plan.active) revert PlanNotActive();
        if (plan.executedIntervals >= plan.totalIntervals) revert PlanNotActive();
        if (block.timestamp < plan.lastExecutedAt + plan.interval) {
            revert IntervalNotReached();
        }

        plan.executedIntervals++;
        plan.lastExecutedAt = block.timestamp;

        if (plan.executedIntervals >= plan.totalIntervals) {
            plan.active = false;
        }

        // In production, this would execute the swap
        emit DCAExecuted(planId, plan.executedIntervals, plan.amountPerInterval);
    }

    /**
     * @notice Cancel a pending trade
     * @param tradeId The trade ID
     */
    function cancelTrade(uint256 tradeId) external nonReentrant {
        Trade storage trade = trades[tradeId];
        
        if (trade.trader != msg.sender) revert NotTradeOwner();
        if (trade.status != TradeStatus.PENDING) revert TradeNotPending();

        trade.status = TradeStatus.CANCELLED;

        // Return tokens to trader
        IERC20(trade.tokenIn).safeTransfer(trade.trader, trade.amountIn);

        emit TradeCancelled(tradeId, msg.sender);
    }

    /**
     * @notice Cancel a DCA plan
     * @param planId The DCA plan ID
     */
    function cancelDCAPlan(uint256 planId) external nonReentrant {
        DCAPlan storage plan = dcaPlans[planId];
        
        if (plan.trader != msg.sender) revert NotTradeOwner();
        if (!plan.active) revert PlanNotActive();

        plan.active = false;

        // Return remaining tokens
        uint256 remainingIntervals = plan.totalIntervals - plan.executedIntervals;
        uint256 refundAmount = remainingIntervals * plan.amountPerInterval;
        
        IERC20(plan.tokenIn).safeTransfer(plan.trader, refundAmount);

        emit DCAPlanCancelled(planId, msg.sender);
    }

    /**
     * @notice Get latest price from Chainlink
     * @param priceFeed The price feed address
     * @return price The latest price
     */
    function _getLatestPrice(
        address priceFeed
    ) internal view returns (uint256 price) {
        (
            ,
            int256 answer,
            ,
            uint256 updatedAt,
        ) = AggregatorV3Interface(priceFeed).latestRoundData();

        if (block.timestamp - updatedAt > PRICE_STALENESS_THRESHOLD) {
            revert PriceStale();
        }

        return uint256(answer);
    }

    /**
     * @notice Get user's trades
     * @param user The user address
     * @return Array of trade IDs
     */
    function getUserTrades(address user) external view returns (uint256[] memory) {
        return userTrades[user];
    }

    /**
     * @notice Get user's DCA plans
     * @param user The user address
     * @return Array of DCA plan IDs
     */
    function getUserDCAPlans(address user) external view returns (uint256[] memory) {
        return userDCAPlans[user];
    }

    /**
     * @notice Set price feed for a token
     * @param token The token address
     * @param priceFeed The Chainlink price feed address
     */
    function setPriceFeed(address token, address priceFeed) external onlyOwner {
        priceFeeds[token] = priceFeed;
        emit PriceFeedUpdated(token, priceFeed);
    }

    /**
     * @notice Set swap router
     * @param _swapRouter The swap router address
     */
    function setSwapRouter(address _swapRouter) external onlyOwner {
        address oldRouter = swapRouter;
        swapRouter = _swapRouter;
        emit SwapRouterUpdated(oldRouter, _swapRouter);
    }

    /**
     * @notice Emergency token rescue
     */
    function rescueTokens(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(owner(), amount);
    }
}
