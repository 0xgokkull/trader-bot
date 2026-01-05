const hre = require("hardhat");

async function main() {
    console.log("🔍 Scanning for Liquid Uniswap V3 Pools on Sepolia...");

    const signers = await hre.ethers.getSigners();
    const signer = signers[0];

    // Uniswap V3 Router Address (Sepolia)
    const ROUTER_ADDRESS = "0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E";
    const ROUTER_ABI = ["function factory() external view returns (address)"];

    // Connect to Router and get Factory
    const router = await hre.ethers.getContractAt(ROUTER_ABI, ROUTER_ADDRESS, signer);
    let FACTORY_ADDRESS;
    try {
        FACTORY_ADDRESS = await router.factory();
        console.log(`✅ Found Uniswap V3 Factory: ${FACTORY_ADDRESS}`);
    } catch (e) {
        console.error("❌ Failed to get factory from router:", e);
        return;
    }

    // Token Addresses
    const WETH = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";
    const TOKENS = {
        "USDC": "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
        "LINK": "0x779877A7B0D9E8603169DdbD7836e478b4624789",
        "DAI": "0x3e622317f8C93f7328350cF0B56d9eD4C620C5d6",
        "UNI": "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"
    };

    const FEE_TIERS = [500, 3000, 10000]; // 0.05%, 0.3%, 1%

    const FACTORY_ABI = [
        "function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)"
    ];

    const POOL_ABI = [
        "function liquidity() external view returns (uint128)",
        "function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)"
    ];

    const factory = await hre.ethers.getContractAt(FACTORY_ABI, FACTORY_ADDRESS, signer);

    for (const [symbol, address] of Object.entries(TOKENS)) {
        console.log(`\nChecking WETH / ${symbol} pairs:`);

        for (const fee of FEE_TIERS) {
            const poolAddress = await factory.getPool(WETH, address, fee);

            if (poolAddress === "0x0000000000000000000000000000000000000000") {
                console.log(`  - Fee ${fee}: ❌ No Pool Created`);
                continue;
            }

            try {
                const pool = await hre.ethers.getContractAt(POOL_ABI, poolAddress, signer);
                const liquidity = await pool.liquidity();
                const slot0 = await pool.slot0();

                // Calculate roughly price for context (simplified)
                console.log(`  - Fee ${fee}: 🏠 ${poolAddress}`);
                console.log(`    💧 Liquidity: ${liquidity.toString()}`);
                console.log(`    🔓 Unlocked: ${slot0.unlocked}`);
            } catch (e) {
                console.log(`  - Fee ${fee}: ⚠️ Error reading pool ${poolAddress}`);
            }
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
