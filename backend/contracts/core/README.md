# Core Contracts

This directory contains the central logic of the trading bot.

## Contracts

### `TradingEngine.sol`
- **Role**: Master Architect / Orchestrator
- **Responsibility**: 
  - Holds user funds temporarily during execution.
  - Routes calls to Swap, Bridge, and Trading modules.
  - Maintains global state (paused/active) and statistics.
- **Key Functions**:
  - `executeSwap`: Orchestrates single-hop and multi-hop swaps.
  - `bridgeToChain`: Initiates cross-chain transfers via CCIP.

### `SwapRouter.sol`
- **Role**: DEX Integration Layer
- **Responsibility**:
  - Interfaces with Uniswap V3 (and potentially others).
  - Handles token approvals and slippage checks.
- **Key Details**:
  - Uses `forceApprove` to handle tricky ERC20s (like USDT).
  - Configurable slippage tolerance.

### `BridgeRouter.sol`
- **Role**: Cross-Chain Messaging
- **Responsibility**:
  - Wraps Chainlink CCIP Router interactions.
  - manages fee estimation and payment (in LINK or Native).
  - Receives incoming messages (implementing `CCIPReceiver`).

### `DexAggregator.sol`
- **Role**: Flexible Execution Proxy
- **Responsibility**:
  - Allows executing generic calldata on ANY target router.
  - Useful for hot-swapping routing logic or aggregating multiple DEXes without contract upgrades.
  - **Structure**:
    1. User -> Aggregator (Push tokens).
    2. Aggregator -> Approve Target Router.
    3. Aggregator -> Call Target Router (Generic Call).

### `TradingLogic.sol`
- **Role**: Strategy Implementation
- **Responsibility**:
  - Stores and executes Order types:
    - Stop Loss
    - Take Profit
    - DCA (Dollar Cost Averaging)
  - Limit Orders
