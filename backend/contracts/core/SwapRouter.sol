// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../interfaces/ISwapRouter.sol";

/**
 * @title SwapRouter
 * @notice Handles token swaps using Uniswap V3 on testnets
 * @dev Integrates with Uniswap V3 SwapRouter on Sepolia testnet
 */
contract SwapRouter is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Uniswap V3 SwapRouter address
    ISwapRouter public immutable uniswapRouter;

    // Pool fee tiers (in hundredths of a bip, i.e., 1e-6)
    uint24 public constant FEE_LOW = 500;       // 0.05%
    uint24 public constant FEE_MEDIUM = 3000;   // 0.30%
    uint24 public constant FEE_HIGH = 10000;    // 1.00%

    // Default slippage tolerance (0.5% = 50)
    uint256 public slippageTolerance = 50; // in basis points (1 bp = 0.01%)

    // Events
    event SwapExecuted(
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        address indexed recipient
    );

    event SlippageToleranceUpdated(uint256 oldTolerance, uint256 newTolerance);

    // Errors
    error InvalidRouter();
    error InvalidToken();
    error InsufficientAmount();
    error SlippageExceeded();
    error SwapFailed();

    /**
     * @notice Constructor
     * @param _uniswapRouter The Uniswap V3 SwapRouter address
     */
    constructor(address _uniswapRouter) Ownable(msg.sender) {
        if (_uniswapRouter == address(0)) revert InvalidRouter();
        uniswapRouter = ISwapRouter(_uniswapRouter);
    }

    /**
     * @notice Swap exact amount of input tokens for output tokens
     * @param tokenIn The input token address
     * @param tokenOut The output token address
     * @param amountIn The exact amount of input tokens
     * @param amountOutMin The minimum amount of output tokens (slippage protection)
     * @param fee The pool fee tier
     * @param recipient The recipient of output tokens
     * @return amountOut The amount of output tokens received
     */
    function swapExactInputSingle(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMin,
        uint24 fee,
        address recipient
    ) external nonReentrant returns (uint256 amountOut) {
        if (tokenIn == address(0) || tokenOut == address(0)) revert InvalidToken();
        if (amountIn == 0) revert InsufficientAmount();

        // Transfer tokens from sender to this contract
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);

        // Approve Uniswap router to spend tokens
        IERC20(tokenIn).forceApprove(address(uniswapRouter), amountIn);

        // Build swap params
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: fee,
                recipient: recipient,
                deadline: block.timestamp + 300, // 5 minutes
                amountIn: amountIn,
                amountOutMinimum: amountOutMin,
                sqrtPriceLimitX96: 0 // No price limit
            });

        // Execute swap
        amountOut = uniswapRouter.exactInputSingle(params);

        if (amountOut < amountOutMin) revert SlippageExceeded();

        emit SwapExecuted(tokenIn, tokenOut, amountIn, amountOut, recipient);

        return amountOut;
    }

    /**
     * @notice Swap tokens for exact amount of output tokens
     * @param tokenIn The input token address
     * @param tokenOut The output token address  
     * @param amountOut The exact amount of output tokens desired
     * @param amountInMax The maximum amount of input tokens to spend
     * @param fee The pool fee tier
     * @param recipient The recipient of output tokens
     * @return amountIn The amount of input tokens spent
     */
    function swapExactOutputSingle(
        address tokenIn,
        address tokenOut,
        uint256 amountOut,
        uint256 amountInMax,
        uint24 fee,
        address recipient
    ) external nonReentrant returns (uint256 amountIn) {
        if (tokenIn == address(0) || tokenOut == address(0)) revert InvalidToken();
        if (amountOut == 0) revert InsufficientAmount();

        // Transfer max tokens from sender
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountInMax);

        // Approve router
        IERC20(tokenIn).forceApprove(address(uniswapRouter), amountInMax);

        // Build swap params
        ISwapRouter.ExactOutputSingleParams memory params = ISwapRouter
            .ExactOutputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: fee,
                recipient: recipient,
                deadline: block.timestamp + 300,
                amountOut: amountOut,
                amountInMaximum: amountInMax,
                sqrtPriceLimitX96: 0
            });

        // Execute swap
        amountIn = uniswapRouter.exactOutputSingle(params);

        // Refund excess tokens
        if (amountIn < amountInMax) {
            uint256 refund = amountInMax - amountIn;
            IERC20(tokenIn).safeTransfer(msg.sender, refund);
        }

        emit SwapExecuted(tokenIn, tokenOut, amountIn, amountOut, recipient);

        return amountIn;
    }

    /**
     * @notice Multi-hop swap with exact input
     * @param path The encoded swap path (tokenA, fee, tokenB, fee, tokenC)
     * @param amountIn The exact amount of input tokens
     * @param amountOutMin The minimum amount of output tokens
     * @param recipient The recipient of output tokens
     * @return amountOut The amount of output tokens received
     */
    function swapExactInput(
        bytes calldata path,
        uint256 amountIn,
        uint256 amountOutMin,
        address recipient
    ) external nonReentrant returns (uint256 amountOut) {
        if (amountIn == 0) revert InsufficientAmount();

        // Extract first token from path
        address tokenIn;
        assembly {
            tokenIn := shr(96, calldataload(path.offset))
        }

        // Transfer tokens
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenIn).forceApprove(address(uniswapRouter), amountIn);

        // Build params
        ISwapRouter.ExactInputParams memory params = ISwapRouter
            .ExactInputParams({
                path: path,
                recipient: recipient,
                deadline: block.timestamp + 300,
                amountIn: amountIn,
                amountOutMinimum: amountOutMin
            });

        amountOut = uniswapRouter.exactInput(params);

        return amountOut;
    }

    /**
     * @notice Update slippage tolerance
     * @param newTolerance The new slippage tolerance in basis points
     */
    function setSlippageTolerance(uint256 newTolerance) external onlyOwner {
        require(newTolerance <= 1000, "Max 10% slippage");
        uint256 oldTolerance = slippageTolerance;
        slippageTolerance = newTolerance;
        emit SlippageToleranceUpdated(oldTolerance, newTolerance);
    }

    /**
     * @notice Calculate minimum output with slippage
     * @param expectedOutput The expected output amount
     * @return minOutput The minimum output after slippage
     */
    function calculateMinOutput(
        uint256 expectedOutput
    ) public view returns (uint256 minOutput) {
        return expectedOutput - (expectedOutput * slippageTolerance) / 10000;
    }

    /**
     * @notice Emergency token rescue
     * @param token The token to rescue
     * @param amount The amount to rescue
     */
    function rescueTokens(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(owner(), amount);
    }

    /**
     * @notice Emergency ETH rescue
     */
    function rescueETH() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    receive() external payable {}
}
