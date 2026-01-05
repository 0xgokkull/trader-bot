const hre = require("hardhat");
const fs = require("fs");

async function main() {
    console.log("🛠️ Fixing SwapRouter logic (Redeploying SwapRouter + Updating Engine)...");

    const [deployer] = await hre.ethers.getSigners();
    console.log("📍 Deploying with account:", deployer.address);

    // Load existing deployments
    const deploymentsPath = "deployments-sepolia.json";
    const deployments = JSON.parse(fs.readFileSync(deploymentsPath, "utf8"));
    const { TradingEngine, TradingLogic } = deployments.contracts;
    const { UniswapV3Router } = deployments.external;

    // 1. Deploy new SwapRouter
    console.log("📦 Deploying new SwapRouter...");
    const SwapRouterFactory = await hre.ethers.getContractFactory("SwapRouter");
    const swapRouter = await SwapRouterFactory.deploy(UniswapV3Router);
    await swapRouter.waitForDeployment();
    const newSwapRouterAddress = await swapRouter.getAddress();
    console.log(`✅ New SwapRouter deployed to: ${newSwapRouterAddress}`);

    // 2. Update TradingEngine
    console.log("🔗 Updating TradingEngine configuration...");
    const TRADING_ENGINE_ABI = [
        "function updateSwapRouter(address _swapRouter) external",
        "function swapRouter() external view returns (address)"
    ];
    const tradingEngine = await hre.ethers.getContractAt(TRADING_ENGINE_ABI, TradingEngine, deployer);

    const oldRouter = await tradingEngine.swapRouter();
    console.log(`Old Router in Engine: ${oldRouter}`);

    const tx = await tradingEngine.updateSwapRouter(newSwapRouterAddress);
    console.log("Transaction sent:", tx.hash);
    await tx.wait();
    console.log("✅ TradingEngine updated with new SwapRouter");

    const newRouterInEngine = await tradingEngine.swapRouter();
    console.log(`New Router in Engine: ${newRouterInEngine}`);

    // 3. Update deployments file
    deployments.contracts.SwapRouter = newSwapRouterAddress;
    fs.writeFileSync(deploymentsPath, JSON.stringify(deployments, null, 2));
    console.log("📝 Updated deployments-sepolia.json");

    // Also update TradingLogic if it references SwapRouter (it does)
    console.log("🔗 Updating TradingLogic configuration...");
    const TRADING_LOGIC_ABI = [
        "function setSwapRouter(address _swapRouter) external"
    ];
    const tradingLogic = await hre.ethers.getContractAt(TRADING_LOGIC_ABI, TradingLogic, deployer);
    const tx2 = await tradingLogic.setSwapRouter(newSwapRouterAddress);
    await tx2.wait();
    console.log("✅ TradingLogic updated with new SwapRouter");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
