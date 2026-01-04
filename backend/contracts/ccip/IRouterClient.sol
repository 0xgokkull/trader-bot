// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IRouterClient
 * @notice Local copy of Chainlink CCIP Router interface
 */

import "./Client.sol";

interface IRouterClient {
    error UnsupportedDestinationChain(uint64 destChainSelector);
    error InsufficientFeeTokenAmount();
    error InvalidMsgValue();

    /// @notice Gets the fee for sending a CCIP message
    function getFee(
        uint64 destinationChainSelector,
        Client.EVM2AnyMessage memory message
    ) external view returns (uint256 fee);

    /// @notice Sends a CCIP message and returns the message ID
    function ccipSend(
        uint64 destinationChainSelector,
        Client.EVM2AnyMessage calldata message
    ) external payable returns (bytes32);

    /// @notice Returns true if the given chain is supported
    function isChainSupported(uint64 chainSelector) external view returns (bool);
}
