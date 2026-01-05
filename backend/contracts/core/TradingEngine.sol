// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./SwapRouter.sol";
import "./BridgeRouter.sol";
import "./TradingLogic.sol";

/**
 * @title TradingEngine
 * @notice Main orchestrator contract that coordinates swapping, bridging, and trading
 * @dev Entry point for all trading operations
 */
contract TradingEngine is Ownable, ReentrancyGuard {
    // Core module references (Immutable-ish, settable by owner)
    SwapRouter public swapRouter;
    BridgeRouter public bridgeRouter;
    TradingLogic public tradingLogic;

    // Engine status
    bool public paused;

    // Statistics
    uint256 public totalSwaps;
    uint256 public totalBridges;
    uint256 public totalTrades;

    // Events
    event ModulesUpdated(
        address swapRouter,
        address bridgeRouter,
        address tradingLogic
    );

    event SwapExecuted(
        address indexed user,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );

    event BridgeInitiated(
        address indexed user,
        uint64 destinationChain,
        address token,
        uint256 amount,
        bytes32 messageId
    );

    event TradePlaced(
        address indexed user,
        uint256 tradeId,
        string strategyType
    );

    event EngineStatusChanged(bool paused);

    // Errors
    error EngineIsPaused();
    error ModuleNotSet();
    error InvalidModule();

    // Modifiers
    modifier whenNotPaused() {
        if (paused) revert EngineIsPaused();
        _;
    }

    /**
     * @notice Constructor
     */
    constructor() Ownable(msg.sender) {}

    /**
     * @notice Initialize all modules
     * @param _swapRouter The SwapRouter address
     * @param _bridgeRouter The BridgeRouter address
     * @param _tradingLogic The TradingLogic address
     */
    function initializeModules(
        address _swapRouter,
        address _bridgeRouter,
        address _tradingLogic
    ) external onlyOwner {
        if (_swapRouter == address(0)) revert InvalidModule();
        if (_bridgeRouter == address(0)) revert InvalidModule();
        if (_tradingLogic == address(0)) revert InvalidModule();

        swapRouter = SwapRouter(payable(_swapRouter));
        bridgeRouter = BridgeRouter(payable(_bridgeRouter));
        tradingLogic = TradingLogic(_tradingLogic);

        emit ModulesUpdated(_swapRouter, _bridgeRouter, _tradingLogic);
    }

    // ============ SWAP FUNCTIONS ============

    /**
     * @notice Execute a token swap
     * @param tokenIn The input token
     * @param tokenOut The output token
     * @param amountIn The input amount
     * @param amountOutMin The minimum output amount
     * @param fee The pool fee tier
     * @return amountOut The output amount
     */
    function executeSwap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMin,
        uint24 fee
    ) external whenNotPaused nonReentrant returns (uint256 amountOut) {
        if (address(swapRouter) == address(0)) revert ModuleNotSet();

        // User must approve this contract first, then we forward to swapRouter
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenIn).approve(address(swapRouter), amountIn);

        amountOut = swapRouter.swapExactInputSingle(
            tokenIn,
            tokenOut,
            amountIn,
            amountOutMin,
            fee,
            msg.sender
        );

        totalSwaps++;

        emit SwapExecuted(msg.sender, tokenIn, tokenOut, amountIn, amountOut);

        return amountOut;
    }

    /**
     * @notice Execute a multi-hop swap
     * @param path The encoded swap path
     * @param amountIn The input amount
     * @param amountOutMin The minimum output amount
     * @return amountOut The output amount
     */
    function executeMultiHopSwap(
        bytes calldata path,
        uint256 amountIn,
        uint256 amountOutMin
    ) external whenNotPaused nonReentrant returns (uint256 amountOut) {
        if (address(swapRouter) == address(0)) revert ModuleNotSet();

        // Extract first token from path
        address tokenIn;
        assembly {
            tokenIn := shr(96, calldataload(path.offset))
        }

        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenIn).approve(address(swapRouter), amountIn);

        amountOut = swapRouter.swapExactInput(
            path,
            amountIn,
            amountOutMin,
            msg.sender
        );

        totalSwaps++;

        return amountOut;
    }

    // ============ BRIDGE FUNCTIONS ============

    /**
     * @notice Bridge tokens to another chain
     * @param destinationChainSelector The destination chain
     * @param receiver The receiver address
     * @param token The token to bridge
     * @param amount The amount to bridge
     * @param payInLink Whether to pay fees in LINK
     * @return messageId The CCIP message ID
     */
    function bridgeToChain(
        uint64 destinationChainSelector,
        address receiver,
        address token,
        uint256 amount,
        bool payInLink
    ) external payable whenNotPaused nonReentrant returns (bytes32 messageId) {
        if (address(bridgeRouter) == address(0)) revert ModuleNotSet();

        IERC20(token).transferFrom(msg.sender, address(this), amount);
        IERC20(token).approve(address(bridgeRouter), amount);

        messageId = bridgeRouter.bridgeTokens{value: msg.value}(
            destinationChainSelector,
            receiver,
            token,
            amount,
            payInLink
        );

        totalBridges++;

        emit BridgeInitiated(
            msg.sender,
            destinationChainSelector,
            token,
            amount,
            messageId
        );

        return messageId;
    }

    /**
     * @notice Get bridge fee estimate
     */
    function getBridgeFeeEstimate(
        uint64 destinationChainSelector,
        address receiver,
        address token,
        uint256 amount
    ) external view returns (uint256 fee) {
        if (address(bridgeRouter) == address(0)) revert ModuleNotSet();
        return bridgeRouter.getBridgeFee(
            destinationChainSelector,
            receiver,
            token,
            amount
        );
    }

    // ============ TRADING FUNCTIONS ============

    /**
     * @notice Create a stop-loss order
     */
    function createStopLossOrder(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 stopPrice,
        uint256 expiresIn
    ) external whenNotPaused nonReentrant returns (uint256 tradeId) {
        if (address(tradingLogic) == address(0)) revert ModuleNotSet();

        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenIn).approve(address(tradingLogic), amountIn);

        tradeId = tradingLogic.createStopLoss(
            tokenIn,
            tokenOut,
            amountIn,
            stopPrice,
            expiresIn
        );

        totalTrades++;

        emit TradePlaced(msg.sender, tradeId, "STOP_LOSS");

        return tradeId;
    }

    /**
     * @notice Create a take-profit order
     */
    function createTakeProfitOrder(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 targetPrice,
        uint256 expiresIn
    ) external whenNotPaused nonReentrant returns (uint256 tradeId) {
        if (address(tradingLogic) == address(0)) revert ModuleNotSet();

        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenIn).approve(address(tradingLogic), amountIn);

        tradeId = tradingLogic.createTakeProfit(
            tokenIn,
            tokenOut,
            amountIn,
            targetPrice,
            expiresIn
        );

        totalTrades++;

        emit TradePlaced(msg.sender, tradeId, "TAKE_PROFIT");

        return tradeId;
    }

    /**
     * @notice Create a DCA plan
     */
    function createDCA(
        address tokenIn,
        address tokenOut,
        uint256 amountPerInterval,
        uint256 interval,
        uint256 totalIntervals
    ) external whenNotPaused nonReentrant returns (uint256 planId) {
        if (address(tradingLogic) == address(0)) revert ModuleNotSet();

        uint256 totalAmount = amountPerInterval * totalIntervals;
        IERC20(tokenIn).transferFrom(msg.sender, address(this), totalAmount);
        IERC20(tokenIn).approve(address(tradingLogic), totalAmount);

        planId = tradingLogic.createDCAPlan(
            tokenIn,
            tokenOut,
            amountPerInterval,
            interval,
            totalIntervals
        );

        totalTrades++;

        emit TradePlaced(msg.sender, planId, "DCA");

        return planId;
    }

    // ============ ADMIN FUNCTIONS ============

    /**
     * @notice Pause/unpause the engine
     */
    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
        emit EngineStatusChanged(_paused);
    }

    /**
     * @notice Update individual module
     */
    function updateSwapRouter(address _swapRouter) external onlyOwner {
        if (_swapRouter == address(0)) revert InvalidModule();
        swapRouter = SwapRouter(payable(_swapRouter));
    }

    function updateBridgeRouter(address _bridgeRouter) external onlyOwner {
        if (_bridgeRouter == address(0)) revert InvalidModule();
        bridgeRouter = BridgeRouter(payable(_bridgeRouter));
    }

    function updateTradingLogic(address _tradingLogic) external onlyOwner {
        if (_tradingLogic == address(0)) revert InvalidModule();
        tradingLogic = TradingLogic(_tradingLogic);
    }

    /**
     * @notice Get engine statistics
     */
    function getStatistics() external view returns (
        uint256 swaps,
        uint256 bridges,
        uint256 trades,
        bool isPaused
    ) {
        return (totalSwaps, totalBridges, totalTrades, paused);
    }

    /**
     * @notice Emergency token rescue
     */
    function rescueTokens(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner(), amount);
    }

    /**
     * @notice Emergency ETH rescue
     */
    function rescueETH() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    receive() external payable {}
}
