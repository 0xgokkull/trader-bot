# Trading Bot Backend

Smart contract backend for the trading bot with **swapping**, **bridging**, and **trading logic** functionality, built with Hardhat and Solidity.

> ⚠️ **TESTNET ONLY** - All contracts are configured for testnets. Never use mainnet addresses.

## 📁 Project Structure

```
backend/
├── contracts/
│   ├── core/
│   │   ├── TradingEngine.sol    # Main orchestrator
│   │   ├── SwapRouter.sol       # Uniswap V3 integration
│   │   ├── BridgeRouter.sol     # Chainlink CCIP bridge
│   │   └── TradingLogic.sol     # Trading strategies
│   ├── oracles/
│   │   └── PriceOracle.sol      # Chainlink price feeds
│   ├── interfaces/
│   │   ├── ISwapRouter.sol
│   │   ├── IBridgeRouter.sol
│   │   └── IPriceOracle.sol
│   └── mocks/
│       ├── MockERC20.sol
│       ├── MockPriceOracle.sol
│       └── MockSwapRouter.sol
├── scripts/
│   └── deploy.js
├── test/
│   └── TradingBot.test.js
├── hardhat.config.js
└── .env.example
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Compile Contracts

```bash
npm run compile
```

### 4. Run Tests

```bash
npm test
```

### 5. Deploy Locally

```bash
# Start local node in one terminal
npm run node

# Deploy in another terminal
npm run deploy:local
```

## 🧪 Testing

The test suite covers all functionality:

| Module | Tests |
|--------|-------|
| Contract Deployments | 4 tests |
| Mock Tokens | 3 tests |
| Swap Router | 5 tests |
| Bridge Router | 4 tests |
| Trading Logic | 8 tests |
| Trading Engine | 5 tests |
| Price Oracle | 5 tests |
| Access Control | 5 tests |
| Integration | 3 tests |

Run tests:
```bash
npx hardhat test
```

## 🔧 Core Contracts

### TradingEngine
Main orchestrator that coordinates all modules.

### SwapRouter
Integrates with Uniswap V3 for token swaps:
- `swapExactInputSingle()` - Swap exact amount of input tokens
- `swapExactOutputSingle()` - Swap for exact amount of output tokens
- `swapExactInput()` - Multi-hop swaps

### BridgeRouter
Cross-chain bridging using Chainlink CCIP:
- `bridgeTokens()` - Bridge tokens to another chain
- `getBridgeFee()` - Get fee estimate

### TradingLogic
Implements trading strategies:
- `createStopLoss()` - Stop-loss orders
- `createTakeProfit()` - Take-profit orders
- `createLimitOrder()` - Limit orders
- `createDCAPlan()` - Dollar-cost averaging

## 🌐 Supported Testnets

| Network | Chain ID | RPC |
|---------|----------|-----|
| Ethereum Sepolia | 11155111 | Alchemy/Infura |
| Polygon Amoy | 80002 | Alchemy |
| Arbitrum Sepolia | 421614 | Alchemy |
| Base Sepolia | 84532 | Alchemy |

## 📜 NPM Scripts

```bash
npm run compile        # Compile contracts
npm test               # Run all tests
npm run node           # Start local Hardhat node
npm run deploy:local   # Deploy to localhost
npm run deploy:sepolia # Deploy to Sepolia testnet
npm run clean          # Clean artifacts
```

## 🔐 Security

- All contracts use OpenZeppelin's `Ownable` and `ReentrancyGuard`
- Slippage protection on swaps
- Price staleness checks on oracles
- Emergency token rescue functions

## 📝 License

MIT
