const hre = require("hardhat");

async function main() {
    console.log("🔍 Checking Uniswap V3 Quote on Sepolia...");
    const [signer] = await hre.ethers.getSigners();

    // Sepolia QuoterV2
    const QUOTER_ADDRESS = "0xEd1f6473345F45b75F8179591dd5bA1888cf2FB3";

    // Tokens
    const WETH = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";
    const LINK = "0x779877A7B0D9E8603169DdbD7836e478b4624789";

    const amountIn = hre.ethers.parseEther("0.0001");
    const fee = 3000;

    const QUOTER_ABI = [
        "function quoteExactInputSingle(tuple(address tokenIn, address tokenOut, uint256 amountIn, uint24 fee, uint160 sqrtPriceLimitX96)) external returns (uint256 amountOut, uint160 sqrtPriceX96After, uint32 initializedTicksCrossed, uint256 gasEstimate)"
    ];

    const quoter = await hre.ethers.getContractAt(QUOTER_ABI, QUOTER_ADDRESS, signer);

    console.log(`Quoting WETH -> LINK (${hre.ethers.formatEther(amountIn)} WETH, Fee ${fee})...`);

    try {
        // staticCall to simulate
        const result = await quoter.quoteExactInputSingle.staticCall({
            tokenIn: WETH,
            tokenOut: LINK,
            amountIn: amountIn,
            fee: fee,
            sqrtPriceLimitX96: 0
        });

        console.log("✅ Quote Successful!");
        console.log(`Amount Out: ${hre.ethers.formatEther(result.amountOut)} LINK`);

    } catch (e) {
        console.error("❌ Quote Failed:", e);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
