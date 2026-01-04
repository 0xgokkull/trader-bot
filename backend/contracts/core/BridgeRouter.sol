// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IRouterClient} from "../ccip/IRouterClient.sol";
import {Client} from "../ccip/Client.sol";
import {CCIPReceiver} from "../ccip/CCIPReceiver.sol";

/**
 * @title BridgeRouter
 * @notice Handles cross-chain token bridging using Chainlink CCIP
 * @dev Supports bridging tokens across multiple testnets
 */
contract BridgeRouter is CCIPReceiver, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // LINK token for paying CCIP fees
    IERC20 public immutable linkToken;

    // Mapping of supported destination chains
    mapping(uint64 => bool) public supportedChains;

    // Mapping of trusted senders per chain (for receiving)
    mapping(uint64 => address) public trustedSenders;

    // Bridge statistics
    uint256 public totalBridgedOut;
    uint256 public totalBridgedIn;
    uint256 public bridgeCount;

    // Events
    event TokensBridged(
        bytes32 indexed messageId,
        uint64 indexed destinationChainSelector,
        address receiver,
        address token,
        uint256 amount,
        uint256 fees,
        bool paidInLink
    );

    event TokensReceived(
        bytes32 indexed messageId,
        uint64 indexed sourceChainSelector,
        address sender,
        address token,
        uint256 amount
    );

    event ChainSupportUpdated(uint64 chainSelector, bool supported);
    event TrustedSenderUpdated(uint64 chainSelector, address sender);

    // Errors
    error UnsupportedChain(uint64 chainSelector);
    error InvalidReceiver();
    error InvalidToken();
    error InsufficientAmount();
    error InsufficientFees();
    error UntrustedSender(uint64 chainSelector, address sender);
    error BridgeFailed();

    /**
     * @notice Constructor
     * @param _ccipRouter The CCIP router address
     * @param _linkToken The LINK token address
     */
    constructor(
        address _ccipRouter,
        address _linkToken
    ) CCIPReceiver(_ccipRouter) Ownable(msg.sender) {
        linkToken = IERC20(_linkToken);
    }

    /**
     * @notice Bridge tokens to another chain
     * @param destinationChainSelector The destination chain selector
     * @param receiver The receiver address on destination chain
     * @param token The token to bridge
     * @param amount The amount to bridge
     * @param payInLink Whether to pay fees in LINK (true) or native (false)
     * @return messageId The CCIP message ID
     */
    function bridgeTokens(
        uint64 destinationChainSelector,
        address receiver,
        address token,
        uint256 amount,
        bool payInLink
    ) external payable nonReentrant returns (bytes32 messageId) {
        if (!supportedChains[destinationChainSelector]) {
            revert UnsupportedChain(destinationChainSelector);
        }
        if (receiver == address(0)) revert InvalidReceiver();
        if (token == address(0)) revert InvalidToken();
        if (amount == 0) revert InsufficientAmount();

        // Transfer tokens from sender
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        // Determine fee token
        address feeToken = payInLink ? address(linkToken) : address(0);

        // Build CCIP message
        Client.EVM2AnyMessage memory message = _buildCCIPMessage(
            receiver,
            token,
            amount,
            feeToken
        );

        // Get fee
        uint256 fees = IRouterClient(getRouter()).getFee(
            destinationChainSelector,
            message
        );

        // Approve Router to spend tokens to be bridged
        IERC20(token).forceApprove(getRouter(), amount);
        
        if (payInLink) {
            // Pay in LINK
            if (linkToken.balanceOf(msg.sender) < fees) {
                revert InsufficientFees();
            }
            linkToken.safeTransferFrom(msg.sender, address(this), fees);
            linkToken.safeIncreaseAllowance(getRouter(), fees);

            messageId = IRouterClient(getRouter()).ccipSend(
                destinationChainSelector,
                message
            );
        } else {
            // Pay in native token
            if (msg.value < fees) revert InsufficientFees();

            messageId = IRouterClient(getRouter()).ccipSend{value: fees}(
                destinationChainSelector,
                message
            );

            // Refund excess
            if (msg.value > fees) {
                payable(msg.sender).transfer(msg.value - fees);
            }
        }

        totalBridgedOut += amount;
        bridgeCount++;

        emit TokensBridged(
            messageId,
            destinationChainSelector,
            receiver,
            token,
            amount,
            fees,
            payInLink
        );

        return messageId;
    }

    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override {
        uint64 sourceChainSelector = message.sourceChainSelector;
        address sender = abi.decode(message.sender, (address));

        // Verify trusted sender
        if (trustedSenders[sourceChainSelector] != sender) {
            revert UntrustedSender(sourceChainSelector, sender);
        }

        // Process received tokens
        if (message.destTokenAmounts.length > 0) {
            Client.EVMTokenAmount memory tokenAmount = message.destTokenAmounts[0];
            
            totalBridgedIn += tokenAmount.amount;

            emit TokensReceived(
                message.messageId,
                sourceChainSelector,
                sender,
                tokenAmount.token,
                tokenAmount.amount
            );
        }
    }

    /**
     * @notice Build CCIP message
     * @param receiver The receiver address
     * @param token The token address
     * @param amount The amount
     * @param feeToken The fee token address
     * @return message The CCIP message
     */
    function _buildCCIPMessage(
        address receiver,
        address token,
        uint256 amount,
        address feeToken
    ) internal pure returns (Client.EVM2AnyMessage memory message) {
        // Build token amounts array
        Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](1);
        tokenAmounts[0] = Client.EVMTokenAmount({
            token: token,
            amount: amount
        });

        message = Client.EVM2AnyMessage({
            receiver: abi.encode(receiver),
            data: "",
            tokenAmounts: tokenAmounts,
            extraArgs: Client._argsToBytes(
                Client.EVMExtraArgsV1({gasLimit: 0}) // Standard transfer uses 0 gas limit usually, or small amount?
            ),
            feeToken: feeToken
        });

        return message;
    }

    /**
     * @notice Get bridge fee
     * @param destinationChainSelector The destination chain
     * @param receiver The receiver address
     * @param token The token to bridge
     * @param amount The amount to bridge
     * @return fees The fee amount
     */
    function getBridgeFee(
        uint64 destinationChainSelector,
        address receiver,
        address token,
        uint256 amount
    ) external view returns (uint256 fees) {
        // Default to Paying in Native for estimation if not specified? 
        // Or assume LINK? The interface doesn't specify payment method.
        // Let's assume Native (address(0)) as that's what we usually want to estimate for users without LINK.
        // Wait, checking original code... `feeToken: address(linkToken)` was hardcoded.
        // Usage in TradingEngine.getBridgeFeeEstimate currently calls this.
        // If I change this to address(0), the estimate will be in Native ETH.
        
        Client.EVM2AnyMessage memory message = _buildCCIPMessage(
            receiver,
            token,
            amount,
            address(0) // Default to Native ETH for fee estimation via this helper
        );

        return IRouterClient(getRouter()).getFee(
            destinationChainSelector,
            message
        );
    }

    /**
     * @notice Add or remove supported chain
     * @param chainSelector The chain selector
     * @param supported Whether the chain is supported
     */
    function setSupportedChain(
        uint64 chainSelector,
        bool supported
    ) external onlyOwner {
        supportedChains[chainSelector] = supported;
        emit ChainSupportUpdated(chainSelector, supported);
    }

    /**
     * @notice Set trusted sender for a chain
     * @param chainSelector The chain selector
     * @param sender The trusted sender address
     */
    function setTrustedSender(
        uint64 chainSelector,
        address sender
    ) external onlyOwner {
        trustedSenders[chainSelector] = sender;
        emit TrustedSenderUpdated(chainSelector, sender);
    }

    /**
     * @notice Check if chain is supported
     * @param chainSelector The chain selector
     * @return Whether the chain is supported
     */
    function isChainSupported(
        uint64 chainSelector
    ) external view returns (bool) {
        return supportedChains[chainSelector];
    }

    /**
     * @notice Emergency token rescue
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
