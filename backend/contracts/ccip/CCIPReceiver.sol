// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./Client.sol";

/**
 * @title CCIPReceiver
 * @notice Local copy of Chainlink CCIP receiver base contract
 * @dev Simplified version to avoid npm dependency conflicts
 */
abstract contract CCIPReceiver {
    address private immutable _router;

    error InvalidRouter(address router);
    error OnlyRouterAllowed();

    constructor(address router) {
        if (router == address(0)) revert InvalidRouter(address(0));
        _router = router;
    }

    /// @notice Returns the address of the CCIP router
    function getRouter() public view returns (address) {
        return _router;
    }

    /// @notice Entry point for CCIP messages (called by router)
    function ccipReceive(
        Client.Any2EVMMessage calldata message
    ) external virtual {
        if (msg.sender != _router) revert OnlyRouterAllowed();
        _ccipReceive(message);
    }

    /// @notice Internal function to be overridden by implementations
    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal virtual;

    /// @notice Check if a selector is supported
    function supportsInterface(bytes4 interfaceId) public pure virtual returns (bool) {
        return interfaceId == type(CCIPReceiver).interfaceId || interfaceId == 0x01ffc9a7;
    }
}
