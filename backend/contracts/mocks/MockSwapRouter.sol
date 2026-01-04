// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../interfaces/ISwapRouter.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title MockSwapRouter
 * @notice Mock Uniswap V3 SwapRouter for testing
 * @dev Simulates swaps with a fixed exchange rate
 */
contract MockSwapRouter is ISwapRouter {
    // Fixed exchange rate for testing (1:1 by default)
    uint256 public exchangeRate = 1e18; // 18 decimals
    uint256 public constant RATE_DECIMALS = 18;

    // Owner
    address public owner;

    // Events
    event SwapExecuted(address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);
    event ExchangeRateUpdated(uint256 oldRate, uint256 newRate);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    /**
     * @notice Swap exact input (single hop)
     */
    function exactInputSingle(
        ExactInputSingleParams calldata params
    ) external payable override returns (uint256 amountOut) {
        // Transfer tokens from sender
        IERC20(params.tokenIn).transferFrom(msg.sender, address(this), params.amountIn);

        // Calculate output based on exchange rate
        amountOut = (params.amountIn * exchangeRate) / 1e18;

        // Check slippage
        require(amountOut >= params.amountOutMinimum, "Slippage exceeded");

        // Transfer output tokens
        IERC20(params.tokenOut).transfer(params.recipient, amountOut);

        emit SwapExecuted(params.tokenIn, params.tokenOut, params.amountIn, amountOut);

        return amountOut;
    }

    /**
     * @notice Swap exact output (single hop)
     */
    function exactOutputSingle(
        ExactOutputSingleParams calldata params
    ) external payable override returns (uint256 amountIn) {
        // Calculate input needed
        amountIn = (params.amountOut * 1e18) / exchangeRate;

        // Check max input
        require(amountIn <= params.amountInMaximum, "Input exceeds max");

        // Transfer input tokens
        IERC20(params.tokenIn).transferFrom(msg.sender, address(this), amountIn);

        // Transfer output tokens
        IERC20(params.tokenOut).transfer(params.recipient, params.amountOut);

        emit SwapExecuted(params.tokenIn, params.tokenOut, amountIn, params.amountOut);

        return amountIn;
    }

    /**
     * @notice Swap exact input (multi-hop)
     */
    function exactInput(
        ExactInputParams calldata params
    ) external payable override returns (uint256 amountOut) {
        // For mock purposes, we skip path parsing and just use a simple exchange
        // In production, the path encodes tokenIn -> fee -> tokenB -> fee -> tokenOut
        
        // Get the first 20 bytes (address) from path
        require(params.path.length >= 20, "Invalid path");
        
        // Decode first token from path (tokenIn is first 20 bytes)
        address tokenIn = address(bytes20(params.path[0:20]));

        // Transfer input tokens
        IERC20(tokenIn).transferFrom(msg.sender, address(this), params.amountIn);

        // Calculate output
        amountOut = (params.amountIn * exchangeRate) / 1e18;

        require(amountOut >= params.amountOutMinimum, "Slippage exceeded");

        // Note: In a real implementation, we'd extract the output token from the path
        // For mock purposes, we just track the swap

        return amountOut;
    }

    /**
     * @notice Swap exact output (multi-hop)
     */
    function exactOutput(
        ExactOutputParams calldata params
    ) external payable override returns (uint256 amountIn) {
        // Calculate input needed
        amountIn = (params.amountOut * 1e18) / exchangeRate;

        require(amountIn <= params.amountInMaximum, "Input exceeds max");

        return amountIn;
    }

    /**
     * @notice Set exchange rate for testing
     * @param newRate New exchange rate (18 decimals)
     */
    function setExchangeRate(uint256 newRate) external onlyOwner {
        uint256 oldRate = exchangeRate;
        exchangeRate = newRate;
        emit ExchangeRateUpdated(oldRate, newRate);
    }

    /**
     * @notice Fund the mock router with tokens for swaps
     */
    function fundRouter(address token, uint256 amount) external {
        IERC20(token).transferFrom(msg.sender, address(this), amount);
    }

    /**
     * @notice Withdraw tokens from router
     */
    function withdrawTokens(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner, amount);
    }

    receive() external payable {}
}
