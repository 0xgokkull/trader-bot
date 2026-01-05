const hre = require("hardhat");
const fs = require("fs");

async function main() {
    console.log("🔍 Debugging Swap Revert...");
    const [signer] = await hre.ethers.getSigners();

    // Load deployments
    const deployments = JSON.parse(fs.readFileSync("deployments-sepolia.json", "utf8"));
    const { TradingEngine, SwapRouter, BridgeRouter } = deployments.contracts;
    const { UniswapV3Router, WETH } = deployments.external;

    const TRADING_ENGINE_ABI = [
        "function swapRouter() external view returns (address)",
        "function tradingLogic() external view returns (address)"
    ];
    const SWAP_ROUTER_ABI = [
        "function uniswapRouter() external view returns (address)"
    ];
    const IERC20_ABI = [
        "function allowance(address owner, address spender) external view returns (uint256)"
    ];

    const engineContract = await hre.ethers.getContractAt(TRADING_ENGINE_ABI, TradingEngine, signer);
    const swapRouterContract = await hre.ethers.getContractAt(SWAP_ROUTER_ABI, SwapRouter, signer);
    const wethContract = await hre.ethers.getContractAt(IERC20_ABI, WETH, signer);

    console.log("--- Address Verification ---");
    const engineSwapRouter = await engineContract.swapRouter();
    console.log(`TradingEngine.swapRouter: ${engineSwapRouter}`);
    console.log(`Expected:                 ${SwapRouter}`);
    console.log(`Match:                    ${engineSwapRouter === SwapRouter ? "✅" : "❌"}`);

    const routerUniswap = await swapRouterContract.uniswapRouter();
    console.log(`SwapRouter.uniswapRouter: ${routerUniswap}`);
    console.log(`Expected:                 ${UniswapV3Router}`);
    console.log(`Match:                    ${routerUniswap === UniswapV3Router ? "✅" : "❌"}`);

    console.log("--- Allowance Checks (Before Failed Swap) ---");
    // User -> Engine
    const userToEngine = await wethContract.allowance(signer.address, TradingEngine);
    console.log(`User -> Engine Allowance: ${userToEngine}`);

    // Engine -> SwapRouter
    const engineToSwapRouter = await wethContract.allowance(TradingEngine, SwapRouter);
    console.log(`Engine -> SwapRouter Allowance: ${engineToSwapRouter}`);

    // SwapRouter -> Uniswap
    const swapRouterToUniswap = await wethContract.allowance(SwapRouter, UniswapV3Router);
    console.log(`SwapRouter -> Uniswap Allowance: ${swapRouterToUniswap}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
