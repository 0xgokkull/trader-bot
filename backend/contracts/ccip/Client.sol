// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title Client
 * @notice Local copy of Chainlink CCIP Client library for cross-chain messaging
 * @dev Extracted to avoid npm version conflicts
 */
library Client {
    /// @dev RMN depends on this struct, if changing, please notify the RMN maintainers.
    struct EVMTokenAmount {
        address token;
        uint256 amount;
    }

    struct Any2EVMMessage {
        bytes32 messageId;
        uint64 sourceChainSelector;
        bytes sender;
        bytes data;
        EVMTokenAmount[] destTokenAmounts;
    }

    struct EVM2AnyMessage {
        bytes receiver;
        bytes data;
        EVMTokenAmount[] tokenAmounts;
        address feeToken;
        bytes extraArgs;
    }

    struct EVMExtraArgsV1 {
        uint256 gasLimit;
    }

    struct EVMExtraArgsV2 {
        uint256 gasLimit;
        bool allowOutOfOrderExecution;
    }

    bytes4 public constant EVM_EXTRA_ARGS_V1_TAG = 0x97a657c9;
    bytes4 public constant EVM_EXTRA_ARGS_V2_TAG = 0x181dcf10;

    function _argsToBytes(
        EVMExtraArgsV1 memory extraArgs
    ) internal pure returns (bytes memory bts) {
        return abi.encodeWithSelector(EVM_EXTRA_ARGS_V1_TAG, extraArgs);
    }

    function _argsToBytes(
        EVMExtraArgsV2 memory extraArgs
    ) internal pure returns (bytes memory bts) {
        return abi.encodeWithSelector(EVM_EXTRA_ARGS_V2_TAG, extraArgs);
    }
}
