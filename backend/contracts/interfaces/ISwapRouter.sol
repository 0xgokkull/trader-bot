// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ISwapRouter
 * @notice Interface for the swap router that integrates with Uniswap V3
 */
interface ISwapRouter {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    struct ExactOutputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountOut;
        uint256 amountInMaximum;
        uint160 sqrtPriceLimitX96;
    }

    struct ExactInputParams {
        bytes path;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
    }

    struct ExactOutputParams {
        bytes path;
        address recipient;
        uint256 deadline;
        uint256 amountOut;
        uint256 amountInMaximum;
    }

    /// @notice Swaps `amountIn` of one token for as much as possible of another token
    function exactInputSingle(
        ExactInputSingleParams calldata params
    ) external payable returns (uint256 amountOut);

    /// @notice Swaps as little as possible of one token for `amountOut` of another token
    function exactOutputSingle(
        ExactOutputSingleParams calldata params
    ) external payable returns (uint256 amountIn);

    /// @notice Swaps `amountIn` of one token for as much as possible of another along the specified path
    function exactInput(
        ExactInputParams calldata params
    ) external payable returns (uint256 amountOut);

    /// @notice Swaps as little as possible of one token for `amountOut` of another along the specified path (reversed)
    function exactOutput(
        ExactOutputParams calldata params
    ) external payable returns (uint256 amountIn);
}
