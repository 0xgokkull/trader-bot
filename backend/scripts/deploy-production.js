const hre = require("hardhat");

/**
 * Production Deployment Script for Sepolia Testnet
 * Uses REAL testnet contracts (Uniswap V3, Chainlink CCIP, real tokens)
 */

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("🚀 Starting Production Deployment to Sepolia...\n");
    console.log("📍 Deploying with account:", deployer.address);

    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

    // ================================================================
    // REAL SEPOLIA TESTNET ADDRESSES
    // ================================================================

    // Uniswap V3 on Sepolia
    const UNISWAP_V3_ROUTER = "0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E";

    // Chainlink CCIP on Sepolia
    const CCIP_ROUTER_SEPOLIA = "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59";

    // Real Tokens on Sepolia
    const WETH_SEPOLIA = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9";
    const LINK_SEPOLIA = "0x779877A7B0D9E8603169DdbD7836e478b4624789";
    const USDC_SEPOLIA = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"; // Circle USDC on Sepolia

    // Chainlink Price Feeds on Sepolia
    const ETH_USD_FEED = "0x694AA1769357215DE4FAC081bf1f309aDC325306";
    const BTC_USD_FEED = "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43";
    const LINK_USD_FEED = "0xc59E3633BAAC79493d908e63626716e204A45EdF";

    console.log("============================================================\n");
    console.log("📦 Deploying Core Contracts...\n");

    // 1. Deploy SwapRouter (connects to real Uniswap V3)
    console.log("Deploying SwapRouter (using Uniswap V3 Router)...");
    const SwapRouter = await hre.ethers.getContractFactory("SwapRouter");
    const swapRouter = await SwapRouter.deploy(UNISWAP_V3_ROUTER);
    await swapRouter.waitForDeployment();
    console.log("✅ SwapRouter deployed to:", await swapRouter.getAddress());

    // 2. Deploy BridgeRouter (connects to real Chainlink CCIP)
    console.log("\nDeploying BridgeRouter (using Chainlink CCIP)...");
    const BridgeRouter = await hre.ethers.getContractFactory("BridgeRouter");
    const bridgeRouter = await BridgeRouter.deploy(CCIP_ROUTER_SEPOLIA, LINK_SEPOLIA);
    await bridgeRouter.waitForDeployment();
    console.log("✅ BridgeRouter deployed to:", await bridgeRouter.getAddress());

    // 3. Deploy TradingLogic
    console.log("\nDeploying TradingLogic...");
    const TradingLogic = await hre.ethers.getContractFactory("TradingLogic");
    const tradingLogic = await TradingLogic.deploy();
    await tradingLogic.waitForDeployment();
    console.log("✅ TradingLogic deployed to:", await tradingLogic.getAddress());

    // 4. Deploy TradingEngine
    console.log("\nDeploying TradingEngine...");
    const TradingEngine = await hre.ethers.getContractFactory("TradingEngine");
    const tradingEngine = await TradingEngine.deploy();
    await tradingEngine.waitForDeployment();
    console.log("✅ TradingEngine deployed to:", await tradingEngine.getAddress());

    // 5. Deploy PriceOracle
    console.log("\nDeploying PriceOracle...");
    const PriceOracle = await hre.ethers.getContractFactory("PriceOracle");
    const priceOracle = await PriceOracle.deploy();
    await priceOracle.waitForDeployment();
    console.log("✅ PriceOracle deployed to:", await priceOracle.getAddress());

    console.log("\n------------------------------------------------------------\n");
    console.log("⚙️  Configuring Contracts...\n");

    // Initialize TradingEngine modules
    console.log("🔗 Initializing TradingEngine modules...");
    let tx = await tradingEngine.initializeModules(
        await swapRouter.getAddress(),
        await bridgeRouter.getAddress(),
        await tradingLogic.getAddress()
    );
    await tx.wait();
    console.log("✅ TradingEngine modules initialized");

    // Set real Chainlink price feeds in TradingLogic
    console.log("\n🔗 Setting real Chainlink price feeds in TradingLogic...");
    tx = await tradingLogic.setPriceFeed(WETH_SEPOLIA, ETH_USD_FEED);
    await tx.wait();
    console.log("✅ WETH price feed set");

    // Set swap router in TradingLogic
    console.log("\n🔗 Setting SwapRouter in TradingLogic...");
    tx = await tradingLogic.setSwapRouter(await swapRouter.getAddress());
    await tx.wait();
    console.log("✅ SwapRouter set in TradingLogic");

    // Set price feeds in PriceOracle
    console.log("\n🔗 Setting price feeds in PriceOracle...");
    tx = await priceOracle.setPriceFeed("ETH", ETH_USD_FEED);
    await tx.wait();
    console.log("✅ ETH/USD price feed set");

    tx = await priceOracle.setPriceFeed("BTC", BTC_USD_FEED);
    await tx.wait();
    console.log("✅ BTC/USD price feed set");

    tx = await priceOracle.setPriceFeed("LINK", LINK_USD_FEED);
    await tx.wait();
    console.log("✅ LINK/USD price feed set");

    // Configure supported chains for bridging
    console.log("\n🔗 Configuring supported chains for bridging...");
    const POLYGON_AMOY_SELECTOR = 16281711391670634445n;
    const ARBITRUM_SEPOLIA_SELECTOR = 3478487238524512106n;
    const BASE_SEPOLIA_SELECTOR = 10344971235874465080n;

    tx = await bridgeRouter.setSupportedChain(POLYGON_AMOY_SELECTOR, true);
    await tx.wait();
    console.log("✅ Polygon Amoy chain enabled");

    tx = await bridgeRouter.setSupportedChain(ARBITRUM_SEPOLIA_SELECTOR, true);
    await tx.wait();
    console.log("✅ Arbitrum Sepolia chain enabled");

    tx = await bridgeRouter.setSupportedChain(BASE_SEPOLIA_SELECTOR, true);
    await tx.wait();
    console.log("✅ Base Sepolia chain enabled");

    console.log("\n============================================================");
    console.log("🎉 PRODUCTION DEPLOYMENT COMPLETE!");
    console.log("============================================================\n");

    console.log("📋 Deployed Contract Addresses:\n");
    console.log("SwapRouter:     ", await swapRouter.getAddress());
    console.log("BridgeRouter:   ", await bridgeRouter.getAddress());
    console.log("TradingLogic:   ", await tradingLogic.getAddress());
    console.log("TradingEngine:  ", await tradingEngine.getAddress());
    console.log("PriceOracle:    ", await priceOracle.getAddress());

    console.log("\n📋 External Contracts Used:\n");
    console.log("Uniswap V3 Router:", UNISWAP_V3_ROUTER);
    console.log("CCIP Router:      ", CCIP_ROUTER_SEPOLIA);
    console.log("WETH:             ", WETH_SEPOLIA);
    console.log("LINK:             ", LINK_SEPOLIA);
    console.log("USDC:             ", USDC_SEPOLIA);
    console.log("ETH/USD Feed:     ", ETH_USD_FEED);

    console.log("\n============================================================\n");

    // Save deployment addresses to file
    const fs = require("fs");
    const deploymentData = {
        network: "sepolia",
        timestamp: new Date().toISOString(),
        deployer: deployer.address,
        contracts: {
            SwapRouter: await swapRouter.getAddress(),
            BridgeRouter: await bridgeRouter.getAddress(),
            TradingLogic: await tradingLogic.getAddress(),
            TradingEngine: await tradingEngine.getAddress(),
            PriceOracle: await priceOracle.getAddress(),
        },
        external: {
            UniswapV3Router: UNISWAP_V3_ROUTER,
            CCIPRouter: CCIP_ROUTER_SEPOLIA,
            WETH: WETH_SEPOLIA,
            LINK: LINK_SEPOLIA,
            USDC: USDC_SEPOLIA,
            ETH_USD_Feed: ETH_USD_FEED,
        }
    };

    fs.writeFileSync(
        "deployments-sepolia.json",
        JSON.stringify(deploymentData, null, 2)
    );
    console.log("📁 Deployment addresses saved to deployments-sepolia.json");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("\n❌ Deployment failed:", error);
        process.exit(1);
    });
