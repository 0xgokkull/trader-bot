const hre = require("hardhat");

async function main() {
    console.log("🚀 Starting Trading Bot Backend Deployment...\n");

    const [deployer] = await hre.ethers.getSigners();
    console.log("📍 Deploying with account:", deployer.address);
    console.log("💰 Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());
    console.log("\n" + "=".repeat(60) + "\n");

    // Store deployed addresses
    const deployedAddresses = {};

    // ============ DEPLOY MOCK CONTRACTS (for local/testnet) ============

    console.log("📦 Deploying Mock Contracts...\n");

    // Deploy Mock Tokens
    const MockERC20 = await hre.ethers.getContractFactory("MockERC20");

    const mockWETH = await MockERC20.deploy("Wrapped Ether", "WETH", 18);
    await mockWETH.waitForDeployment();
    deployedAddresses.mockWETH = await mockWETH.getAddress();
    console.log("✅ MockWETH deployed to:", deployedAddresses.mockWETH);

    const mockUSDC = await MockERC20.deploy("USD Coin", "USDC", 6);
    await mockUSDC.waitForDeployment();
    deployedAddresses.mockUSDC = await mockUSDC.getAddress();
    console.log("✅ MockUSDC deployed to:", deployedAddresses.mockUSDC);

    const mockLINK = await MockERC20.deploy("Chainlink", "LINK", 18);
    await mockLINK.waitForDeployment();
    deployedAddresses.mockLINK = await mockLINK.getAddress();
    console.log("✅ MockLINK deployed to:", deployedAddresses.mockLINK);

    // Deploy Mock Price Oracle
    const MockPriceOracle = await hre.ethers.getContractFactory("MockPriceOracle");
    const mockPriceOracle = await MockPriceOracle.deploy(
        200000000000, // $2000.00 (8 decimals)
        8,
        "ETH / USD"
    );
    await mockPriceOracle.waitForDeployment();
    deployedAddresses.mockPriceOracle = await mockPriceOracle.getAddress();
    console.log("✅ MockPriceOracle (ETH/USD) deployed to:", deployedAddresses.mockPriceOracle);

    // Deploy Mock Swap Router
    const MockSwapRouter = await hre.ethers.getContractFactory("MockSwapRouter");
    const mockSwapRouter = await MockSwapRouter.deploy();
    await mockSwapRouter.waitForDeployment();
    deployedAddresses.mockSwapRouter = await mockSwapRouter.getAddress();
    console.log("✅ MockSwapRouter deployed to:", deployedAddresses.mockSwapRouter);

    console.log("\n" + "-".repeat(60) + "\n");

    // ============ DEPLOY CORE CONTRACTS ============

    console.log("📦 Deploying Core Contracts...\n");

    // Deploy SwapRouter
    const SwapRouter = await hre.ethers.getContractFactory("SwapRouter");
    const swapRouter = await SwapRouter.deploy(deployedAddresses.mockSwapRouter);
    await swapRouter.waitForDeployment();
    deployedAddresses.swapRouter = await swapRouter.getAddress();
    console.log("✅ SwapRouter deployed to:", deployedAddresses.swapRouter);

    // Deploy BridgeRouter (using mock addresses for CCIP)
    // Note: For testnet, use actual CCIP router addresses from .env
    const ccipRouter = process.env.CHAINLINK_CCIP_ROUTER_SEPOLIA || deployer.address;
    const linkToken = deployedAddresses.mockLINK;

    const BridgeRouter = await hre.ethers.getContractFactory("BridgeRouter");
    const bridgeRouter = await BridgeRouter.deploy(ccipRouter, linkToken);
    await bridgeRouter.waitForDeployment();
    deployedAddresses.bridgeRouter = await bridgeRouter.getAddress();
    console.log("✅ BridgeRouter deployed to:", deployedAddresses.bridgeRouter);

    // Deploy TradingLogic
    const TradingLogic = await hre.ethers.getContractFactory("TradingLogic");
    const tradingLogic = await TradingLogic.deploy();
    await tradingLogic.waitForDeployment();
    deployedAddresses.tradingLogic = await tradingLogic.getAddress();
    console.log("✅ TradingLogic deployed to:", deployedAddresses.tradingLogic);

    // Deploy TradingEngine
    const TradingEngine = await hre.ethers.getContractFactory("TradingEngine");
    const tradingEngine = await TradingEngine.deploy();
    await tradingEngine.waitForDeployment();
    deployedAddresses.tradingEngine = await tradingEngine.getAddress();
    console.log("✅ TradingEngine deployed to:", deployedAddresses.tradingEngine);

    // Deploy PriceOracle
    const PriceOracle = await hre.ethers.getContractFactory("PriceOracle");
    const priceOracle = await PriceOracle.deploy();
    await priceOracle.waitForDeployment();
    deployedAddresses.priceOracle = await priceOracle.getAddress();
    console.log("✅ PriceOracle deployed to:", deployedAddresses.priceOracle);

    console.log("\n" + "-".repeat(60) + "\n");

    // ============ CONFIGURE CONTRACTS ============

    console.log("⚙️  Configuring Contracts...\n");

    // Initialize TradingEngine with modules
    console.log("🔗 Initializing TradingEngine modules...");
    await tradingEngine.initializeModules(
        deployedAddresses.swapRouter,
        deployedAddresses.bridgeRouter,
        deployedAddresses.tradingLogic
    );
    console.log("✅ TradingEngine modules initialized");

    // Set price feeds in TradingLogic
    console.log("🔗 Setting price feeds in TradingLogic...");
    await tradingLogic.setPriceFeed(deployedAddresses.mockWETH, deployedAddresses.mockPriceOracle);
    console.log("✅ Price feed set for WETH");

    // Set swap router in TradingLogic
    await tradingLogic.setSwapRouter(deployedAddresses.swapRouter);
    console.log("✅ SwapRouter set in TradingLogic");

    // Configure supported chains in BridgeRouter (CCIP chain selectors)
    console.log("🔗 Configuring supported chains in BridgeRouter...");
    const chainSelectors = {
        sepolia: BigInt("16015286601757825753"),
        polygonAmoy: BigInt("16281711391670634445"),
        arbitrumSepolia: BigInt("3478487238524512106"),
        baseSepolia: BigInt("10344971235874465080")
    };

    for (const [chain, selector] of Object.entries(chainSelectors)) {
        await bridgeRouter.setSupportedChain(selector, true);
        console.log(`✅ ${chain} enabled (selector: ${selector})`);
    }

    // Configure PriceOracle with mock price feed
    console.log("🔗 Configuring PriceOracle...");
    await priceOracle.setPriceFeed("ETH", deployedAddresses.mockPriceOracle);
    console.log("✅ ETH price feed configured");

    console.log("\n" + "=".repeat(60) + "\n");

    // ============ SUMMARY ============

    console.log("📋 DEPLOYMENT SUMMARY\n");
    console.log("Mock Contracts:");
    console.log("  MockWETH:", deployedAddresses.mockWETH);
    console.log("  MockUSDC:", deployedAddresses.mockUSDC);
    console.log("  MockLINK:", deployedAddresses.mockLINK);
    console.log("  MockPriceOracle:", deployedAddresses.mockPriceOracle);
    console.log("  MockSwapRouter:", deployedAddresses.mockSwapRouter);
    console.log("\nCore Contracts:");
    console.log("  SwapRouter:", deployedAddresses.swapRouter);
    console.log("  BridgeRouter:", deployedAddresses.bridgeRouter);
    console.log("  TradingLogic:", deployedAddresses.tradingLogic);
    console.log("  TradingEngine:", deployedAddresses.tradingEngine);
    console.log("  PriceOracle:", deployedAddresses.priceOracle);

    console.log("\n🎉 Deployment Complete!\n");

    return deployedAddresses;
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });
