const hre = require("hardhat");
const fs = require("fs");

async function main() {
    console.log("🚀 Testing SwapRouter and WETH Direct Swap on Sepolia...");

    const [signer] = await hre.ethers.getSigners();
    console.log("📍 Testing with account:", signer.address);

    // Load deployments
    const deployments = JSON.parse(fs.readFileSync("deployments-sepolia.json", "utf8"));
    const { SwapRouter } = deployments.contracts;

    // Use standard Sepolia WETH and LINK
    const WETH = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";
    const LINK = "0x779877A7B0D9E8603169DdbD7836e478b4624789";

    console.log("📋 Using Contracts:");
    console.log("SwapRouter:", SwapRouter);
    console.log("WETH:", WETH);
    console.log("LINK:", LINK);

    const IERC20_ABI = [
        "function approve(address spender, uint256 amount) external returns (bool)",
        "function balanceOf(address account) external view returns (uint256)",
        "function deposit() external payable",
        "function decimals() external view returns (uint8)"
    ];

    const SWAP_ROUTER_ABI = [
        "function swapExactInputSingle(address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOutMin, uint24 fee, address recipient) external returns (uint256)"
    ];

    const wethContract = await hre.ethers.getContractAt(IERC20_ABI, WETH, signer);
    const linkContract = await hre.ethers.getContractAt(IERC20_ABI, LINK, signer);
    const swapRouterContract = await hre.ethers.getContractAt(SWAP_ROUTER_ABI, SwapRouter, signer);

    // 1. Wrap ETH
    const amountIn = hre.ethers.parseEther("0.0001");
    console.log(`\n🔄 1. Wrapping ${hre.ethers.formatEther(amountIn)} ETH to WETH...`);
    let tx = await wethContract.deposit({ value: amountIn });
    await tx.wait();
    console.log("✅ Wrapped ETH");

    // 2. Approve SwapRouter Directly
    console.log("\n🔓 2. Approving SwapRouter directly...");
    tx = await wethContract.approve(SwapRouter, amountIn);
    await tx.wait();
    console.log("✅ Approved SwapRouter");

    // 3. Execute Swap Direct
    console.log("\n💱 3. Executing Direct Swap (WETH -> LINK)...");

    // Fee 3000
    const fee = 3000;

    // Check balance before
    const balBefore = await linkContract.balanceOf(signer.address);

    try {
        console.log(`Attempting swap via SwapRouter at ${SwapRouter}...`);
        // Estimate gas
        await swapRouterContract.swapExactInputSingle.staticCall(
            WETH,
            LINK,
            amountIn,
            0, // Min out 0
            fee,
            signer.address
        );

        tx = await swapRouterContract.swapExactInputSingle(
            WETH,
            LINK,
            amountIn,
            0,
            fee,
            signer.address
        );
        console.log("Transaction sent:", tx.hash);
        await tx.wait();
        console.log("✅ Direct Swap Executed!");

        const balAfter = await linkContract.balanceOf(signer.address);
        console.log(`Gained: ${hre.ethers.formatEther(balAfter - balBefore)} LINK`);

    } catch (e) {
        console.error("❌ Direct Swap Failed:", e);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
