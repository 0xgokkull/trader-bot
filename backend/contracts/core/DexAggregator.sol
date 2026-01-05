// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title DexAggregator
 * @notice A generic aggregator that executes swaps on arbitrary routers.
 * @dev Designed to bypass rigid interface constraints by using low-level calls.
 *      WARNING: This contract allows calling ANY address with provided calldata.
 *      It should be used with strict valid input generation from the client side.
 */
contract DexAggregator is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    event SwapExecuted(address indexed router, address indexed tokenIn, uint256 amountIn);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Execute a swap on a target router
     * @param router The address of the DEX router (e.g. Uniswap V3 SwapRouter)
     * @param data The calldata to send to the router (function selector + params)
     * @param tokenIn The input token to approve
     * @param amountIn The amount of input token
     */
    function executeSwap(
        address router,
        bytes calldata data,
        address tokenIn,
        uint256 amountIn
    ) external payable nonReentrant {
        require(router != address(0), "Invalid router");
        require(tokenIn != address(0), "Invalid token");
        require(amountIn > 0, "Invalid amount");

        // 1. Pull tokens from user
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);

        // 2. Approve router
        // Use forceApprove to handle non-standard tokens or reset allowance
        IERC20(tokenIn).forceApprove(router, amountIn);

        // 3. Execute generic call
        (bool success, bytes memory result) = router.call(data);
        require(success, string(abi.encodePacked("Swap failed: ", result)));

        emit SwapExecuted(router, tokenIn, amountIn);
    }

    /**
     * @notice Rescue generic tokens left in contract
     */
    function rescueTokens(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(msg.sender, amount);
    }
    
    /**
     * @notice Rescue ETH
     */
    function rescueETH() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    receive() external payable {}
}
