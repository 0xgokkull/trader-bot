const hre = require("hardhat");
const fs = require("fs");

async function main() {
    console.log("🚀 Starting Live Test on Sepolia...\n");

    const [signer] = await hre.ethers.getSigners();
    console.log("📍 Testing with account:", signer.address);

    // Load deployments
    const deployments = JSON.parse(fs.readFileSync("deployments-sepolia.json", "utf8"));
    const { TradingEngine, SwapRouter, BridgeRouter } = deployments.contracts;
    // Use standard Sepolia WETH
    const WETH = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";
    // Standard Circle USDC on Sepolia (from Faucet)
    const USDC = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

    console.log("📋 Using Contracts:");
    console.log("TradingEngine:", TradingEngine);
    console.log("WETH:", WETH);
    console.log("USDC:", USDC);

    // ABIs
    const IERC20_ABI = [
        "function approve(address spender, uint256 amount) external returns (bool)",
        "function balanceOf(address account) external view returns (uint256)",
        "function allowance(address owner, address spender) external view returns (uint256)",
        "function deposit() external payable",
        "function decimals() external view returns (uint8)"
    ];

    const TRADING_ENGINE_ABI = [
        "function executeSwap(address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOutMin, uint24 fee) external returns (uint256)",
        "function bridgeToChain(uint64 destinationChainSelector, address receiver, address token, uint256 amount, bool payInLink) external payable returns (bytes32)",
        "function getBridgeFeeEstimate(uint64 destinationChainSelector, address receiver, address token, uint256 amount) external view returns (uint256)",
        "function paused() external view returns (bool)",
        "function bridgeRouter() external view returns (address)"
    ];

    // Connect contracts
    const wethContract = await hre.ethers.getContractAt(IERC20_ABI, WETH, signer);
    const usdcContract = await hre.ethers.getContractAt(IERC20_ABI, USDC, signer);
    const tradingEngineContract = await hre.ethers.getContractAt(TRADING_ENGINE_ABI, TradingEngine, signer);

    // Check Initial USDC Balance
    const initialUSDC = await usdcContract.balanceOf(signer.address);
    console.log(`\n💰 Initial USDC Balance: ${hre.ethers.formatUnits(initialUSDC, 6)} USDC`);

    let bridgeAmount = 0n;

    if (initialUSDC > 0n) {
        console.log("✅ Found existing USDC balance! Skipping swap and proceeding to bridge.");
        bridgeAmount = initialUSDC;
    } else {
        console.log("⚠️ No USDC found. Attempting Swap (WETH -> USDC)...");

        // 1. Wrap ETH
        const wrapAmount = hre.ethers.parseEther("0.001");
        console.log(`\n🔄 1. Wrapping ${hre.ethers.formatEther(wrapAmount)} ETH to WETH...`);
        let tx = await wethContract.deposit({ value: wrapAmount });
        await tx.wait();
        console.log("✅ Wrapped ETH");

        // 2. Approve WETH
        console.log("\n🔓 2. Approving WETH...");
        tx = await wethContract.approve(TradingEngine, wrapAmount);
        await tx.wait();
        console.log("✅ Approved WETH");

        // 3. Swap
        console.log("\n💱 3. Executing Swap...");
        const feeTiers = [3000, 500, 10000];
        for (const fee of feeTiers) {
            try {
                tx = await tradingEngineContract.executeSwap(WETH, USDC, wrapAmount, 0, fee);
                await tx.wait();
                console.log(`✅ Swap Executed (Fee: ${fee})`);
                break;
            } catch (e) {
                console.log(`❌ Swap failed (Fee: ${fee})`);
            }
        }

        const afterSwap = await usdcContract.balanceOf(signer.address);
        bridgeAmount = afterSwap;
    }

    // 4. Bridge to Polygon Amoy
    console.log("\n🌉 4. Executing Bridge (USDC -> Polygon Amoy)...");

    // Cap at 1 USDC for testing to save funds
    if (bridgeAmount > 1000000n) bridgeAmount = 1000000n;

    const POLYGON_AMOY_SELECTOR = 16281711391670634445n;

    // Diagnostic Checks
    console.log("🔍 Running Diagnostics...");
    const isPaused = await tradingEngineContract.paused();
    console.log(`- Engine Paused: ${isPaused}`);

    // We need BridgeRouter address to check support
    // We can get it from deployment, but let's check what TradingEngine thinks it is
    const bridgeRouterAddr = await tradingEngineContract.bridgeRouter();
    console.log(`- BridgeRouter (in Engine): ${bridgeRouterAddr}`);

    // Check chain support on BridgeRouter
    const BRIDGE_ROUTER_ABI = ["function supportedChains(uint64) external view returns (bool)"];
    const bridgeRouterContract = await hre.ethers.getContractAt(BRIDGE_ROUTER_ABI, bridgeRouterAddr, signer);

    const isSupported = await bridgeRouterContract.supportedChains(POLYGON_AMOY_SELECTOR);
    console.log(`- Chain ${POLYGON_AMOY_SELECTOR} Supported: ${isSupported}`);

    // Check Allowance
    const allowance = await usdcContract.allowance(signer.address, TradingEngine);
    console.log(`- USDC Allowance: ${hre.ethers.formatUnits(allowance, 6)}`);
    console.log(`- Required: ${hre.ethers.formatUnits(bridgeAmount, 6)}`);

    if (bridgeAmount <= 0n) {
        console.log("❌ No USDC available to bridge.");
        return;
    }

    console.log(`Bridging ${hre.ethers.formatUnits(bridgeAmount, 6)} USDC...`);

    // Approve USDC
    console.log("Approving USDC for Bridge...");
    let tx = await usdcContract.approve(TradingEngine, bridgeAmount);
    await tx.wait();
    console.log("✅ Approved USDC");

    // Start Bridge
    // Estimate fees
    const fee = await tradingEngineContract.getBridgeFeeEstimate(
        POLYGON_AMOY_SELECTOR,
        signer.address,
        USDC,
        bridgeAmount
    );
    console.log("Estimated Bridge Fee (ETH):", hre.ethers.formatEther(fee));

    // Execute Bridge
    let receipt;
    try {
        // Estimate gas manually first to see if we can catch revert reason
        await tradingEngineContract.bridgeToChain.staticCall(
            POLYGON_AMOY_SELECTOR,
            signer.address,
            USDC,
            bridgeAmount,
            false,
            { value: fee }
        );
        console.log("✅ Static call successful (Simulation passed)");

        tx = await tradingEngineContract.bridgeToChain(
            POLYGON_AMOY_SELECTOR,
            signer.address,
            USDC,
            bridgeAmount,
            false, // payInLink = false (pay in native ETH)
            { value: fee }
        );
        console.log("Bridge transaction sent:", tx.hash);
        receipt = await tx.wait();
        console.log("✅ Bridge Initiated!");
    } catch (error) {
        console.error("❌ Bridge Execution Failed Details:", error);
        // Try to decode if possible or just print
    }

    if (receipt && receipt.status === 1) {
        console.log("Transaction Status: SUCCESS");

        // Save results
        const results = `
# Test Results (Sepolia)
Date: ${new Date().toISOString()}

## Bridge (USDC -> Polygon Amoy)
- **Status**: ✅ SUCCESS
- **Bridged Amount**: ${hre.ethers.formatUnits(bridgeAmount, 6)} USDC
- **Destination**: Polygon Amoy (${POLYGON_AMOY_SELECTOR})
- **Fee Paid**: ${hre.ethers.formatEther(fee)} ETH
- **Transaction**: ${tx.hash}
        `;
        fs.writeFileSync("result.md", results);
        console.log("\n📝 Results saved to result.md");
    } else {
        console.error("Transaction Status: FAILED");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("\n❌ Test failed:", error);
        process.exit(1);
    });
