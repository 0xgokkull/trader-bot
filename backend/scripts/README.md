# Trading Bot Scripts

This directory contains utility scripts for deployment, testing, and debugging.

## Core Scripts
- `deploy-sepolia.js`: Deploys the main trading engine stack to Sepolia.
- `deploy-aggregator.js`: Deploys the DexAggregator.
- `test-live-sepolia.js`: Main integration test for Swap and Bridge.

## Diagnostic Tools
- `check-liquidity.js`: Scans Uniswap V3 pools for liquidity.
- `check-quote.js`: Verifies swap pricing via Quoter.
- `debug-swap.js`: Checks contract allowance and address links.
- `fix-swap-router.js`: Hotfix script for redeploying SwapRouter.
- `test-swap-direct.js`: Tests direct interactions with SwapRouter.
