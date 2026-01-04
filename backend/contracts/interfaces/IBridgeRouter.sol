// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IBridgeRouter
 * @notice Interface for the bridge router that integrates with Chainlink CCIP
 */
interface IBridgeRouter {
    /// @notice Struct for bridge request parameters
    struct BridgeParams {
        uint64 destinationChainSelector;
        address receiver;
        address token;
        uint256 amount;
        bool payInLink;
    }

    /// @notice Struct for received bridge message
    struct BridgeMessage {
        bytes32 messageId;
        uint64 sourceChainSelector;
        address sender;
        address token;
        uint256 amount;
    }

    /// @notice Emitted when tokens are sent to another chain
    event TokensBridged(
        bytes32 indexed messageId,
        uint64 indexed destinationChainSelector,
        address receiver,
        address token,
        uint256 amount,
        uint256 fees
    );

    /// @notice Emitted when tokens are received from another chain
    event TokensReceived(
        bytes32 indexed messageId,
        uint64 indexed sourceChainSelector,
        address sender,
        address token,
        uint256 amount
    );

    /// @notice Bridge tokens to another chain
    /// @param params Bridge parameters
    /// @return messageId The unique ID of the CCIP message
    function bridgeTokens(
        BridgeParams calldata params
    ) external payable returns (bytes32 messageId);

    /// @notice Get the fee required to bridge tokens
    /// @param destinationChainSelector The destination chain selector
    /// @param receiver The receiver address on destination
    /// @param token The token to bridge
    /// @param amount The amount to bridge
    /// @param payInLink Whether to pay fees in LINK
    /// @return fee The fee amount
    function getBridgeFee(
        uint64 destinationChainSelector,
        address receiver,
        address token,
        uint256 amount,
        bool payInLink
    ) external view returns (uint256 fee);

    /// @notice Check if a chain is supported
    /// @param chainSelector The chain selector to check
    /// @return supported Whether the chain is supported
    function isChainSupported(
        uint64 chainSelector
    ) external view returns (bool supported);
}
