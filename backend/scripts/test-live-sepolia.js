const hre = require("hardhat");
const fs = require("fs");

async function main() {
    console.log("🚀 Starting Live Test on Sepolia (DexAggregator Swap & Bridge)...\n");

    const [signer] = await hre.ethers.getSigners();
    console.log("📍 Testing with account:", signer.address);

    // Load deployments
    const deployments = JSON.parse(fs.readFileSync("deployments-sepolia.json", "utf8"));
    const { TradingEngine } = deployments.contracts;
    const DexAggregatorAddr = deployments.contracts.DexAggregator;
    const UniswapRouter = deployments.external.UniswapV3Router;

    // Use standard Sepolia WETH
    const WETH = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";
    // Target LINK
    const LINK = "0x779877A7B0D9E8603169DdbD7836e478b4624789";

    console.log("📋 Using Contracts:");
    console.log("DexAggregator:", DexAggregatorAddr);
    console.log("UniswapRouter:", UniswapRouter);
    console.log("TradingEngine:", TradingEngine);

    // ABIs
    const IERC20_ABI = [
        "function approve(address spender, uint256 amount) external returns (bool)",
        "function balanceOf(address account) external view returns (uint256)",
        "function allowance(address owner, address spender) external view returns (uint256)",
        "function deposit() external payable",
        "function decimals() external view returns (uint8)"
    ];

    const AGGREGATOR_ABI = [
        "function executeSwap(address router, bytes calldata data, address tokenIn, uint256 amountIn) external payable",
        "function owner() external view returns (address)"
    ];

    const TRADING_ENGINE_ABI = [
        "function getBridgeFeeEstimate(uint64 destinationChainSelector, address receiver, address token, uint256 amount) external view returns (uint256)",
        "function bridgeToChain(uint64 destinationChainSelector, address receiver, address token, uint256 amount, bool payInLink) external payable returns (bytes32)"
    ];

    // Connect contracts
    const wethContract = await hre.ethers.getContractAt(IERC20_ABI, WETH, signer);
    const linkContract = await hre.ethers.getContractAt(IERC20_ABI, LINK, signer);
    const aggregatorContract = await hre.ethers.getContractAt(AGGREGATOR_ABI, DexAggregatorAddr, signer);
    const tradingEngineContract = await hre.ethers.getContractAt(TRADING_ENGINE_ABI, TradingEngine, signer);

    // 1. Wrap ETH
    const wrapAmount = hre.ethers.parseEther("0.0001");
    console.log(`\n🔄 1. Wrapping ${hre.ethers.formatEther(wrapAmount)} ETH to WETH...`);
    let tx = await wethContract.deposit({ value: wrapAmount });
    await tx.wait();
    console.log("✅ Wrapped ETH");

    // 2. Approve Aggregator
    console.log("\n🔓 2. Approving DexAggregator...");
    tx = await wethContract.approve(DexAggregatorAddr, wrapAmount);
    await tx.wait();
    console.log("✅ Approved DexAggregator");

    // 3. Swap (WETH -> LINK) via Aggregator
    console.log("\n💱 3. Executing Swap via DexAggregator (WETH -> LINK)...");

    const balanceBefore = await linkContract.balanceOf(signer.address);
    console.log(`Balance Before: ${hre.ethers.formatEther(balanceBefore)} LINK`);

    const fee = 3000;

    // Construct Uniswap V3 Calldata
    // Interface for SwapRouter02 / ISwapRouter ExactInputSingleParams
    // struct ExactInputSingleParams { address tokenIn; address tokenOut; uint24 fee; address recipient; uint256 deadline; uint256 amountIn; uint256 amountOutMinimum; uint160 sqrtPriceLimitX96; }
    const SWAP_ROUTER_INTERFACE = new hre.ethers.Interface([
        "function exactInputSingle(tuple(address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96) params) external payable returns (uint256 amountOut)"
    ]);

    const params = {
        tokenIn: WETH,
        tokenOut: LINK,
        fee: fee,
        recipient: signer.address, // Send tokens directly to User
        deadline: Math.floor(Date.now() / 1000) + 300,
        amountIn: wrapAmount,
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0
    };

    // Encode call
    const swapData = SWAP_ROUTER_INTERFACE.encodeFunctionData("exactInputSingle", [params]);

    let swapSuccess = false;
    try {
        console.log(`Executing swap on Router ${UniswapRouter}...`);

        // Static Call first
        await aggregatorContract.executeSwap.staticCall(UniswapRouter, swapData, WETH, wrapAmount);

        // Execute
        tx = await aggregatorContract.executeSwap(UniswapRouter, swapData, WETH, wrapAmount);
        console.log("Transaction sent:", tx.hash);
        await tx.wait();
        console.log("✅ Swap Executed via Aggregator!");
        swapSuccess = true;
    } catch (e) {
        console.log("❌ Swap failed");
        console.error(e);
    }

    const balanceAfter = await linkContract.balanceOf(signer.address);
    // Use BigInt 0n comparison to be safe
    const gained = balanceAfter > balanceBefore ? balanceAfter - balanceBefore : 0n;
    console.log(`+ Gained: ${hre.ethers.formatEther(gained)} LINK`);


    // 4. Bridge to Polygon Amoy
    console.log("\n🌉 4. Executing Bridge (Fallback to USDC if LINK missing)...");

    let bridgeToken = LINK;
    let bridgeAmount = gained;
    const USDC = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"; // Sepolia USDC

    if (bridgeAmount === 0n) {
        console.log("⚠️ No LINK obtained. Bridging USDC...");
        const usdcContract = await hre.ethers.getContractAt(IERC20_ABI, USDC, signer);
        const usdcBal = await usdcContract.balanceOf(signer.address);
        if (usdcBal > 0n) {
            console.log("✅ Using USDC for Bridge Test.");
            bridgeToken = USDC;
            const maxBridge = hre.ethers.parseUnits("1.0", 6);
            bridgeAmount = usdcBal > maxBridge ? maxBridge : usdcBal;
        } else {
            console.log("❌ No LINK or USDC to bridge. Aborting.");
            return;
        }
    }

    // TradingEngine requires approval from User -> TradingEngine for bridge
    console.log("Approving TradingEngine for Bridge...");
    const tokenContract = await hre.ethers.getContractAt(IERC20_ABI, bridgeToken, signer);
    tx = await tokenContract.approve(TradingEngine, bridgeAmount);
    await tx.wait();

    // Call TradingEngine to bridge
    const POLYGON_AMOY_SELECTOR = 16281711391670634445n;
    console.log("Estimating Fees...");
    const feeEst = await tradingEngineContract.getBridgeFeeEstimate(POLYGON_AMOY_SELECTOR, signer.address, bridgeToken, bridgeAmount);
    console.log("Estimated Bridge Fee (ETH):", hre.ethers.formatEther(feeEst));

    console.log("Bridging...");
    tx = await tradingEngineContract.bridgeToChain(POLYGON_AMOY_SELECTOR, signer.address, bridgeToken, bridgeAmount, false, { value: feeEst });
    console.log("Tx:", tx.hash);
    await tx.wait();
    console.log("✅ Bridge Initiated!");

    const results = `
# Test Results (Sepolia)
Date: ${new Date().toISOString()}

## Dex Aggregator Swap (WETH -> LINK)
- **Status**: ${swapSuccess ? "✅ SUCCESS" : "❌ FAILED"}
- **Aggregator**: ${DexAggregatorAddr}
- **Output**: ${hre.ethers.formatEther(gained)} LINK

## Bridge (Amoy)
- **Status**: ✅ SUCCESS (Initiated)
- **Tx**: ${tx.hash}
`;
    fs.writeFileSync("result.md", results);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("\n❌ Test failed:", error);
        process.exit(1);
    });
