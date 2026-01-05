const hre = require("hardhat");
const fs = require("fs");

async function main() {
    console.log("🚀 Deploying DexAggregator...");

    const [deployer] = await hre.ethers.getSigners();
    console.log("📍 Deploying with account:", deployer.address);

    const DexAggregator = await hre.ethers.getContractFactory("DexAggregator");
    const aggregator = await DexAggregator.deploy();

    await aggregator.waitForDeployment();
    const address = await aggregator.getAddress();

    console.log(`✅ DexAggregator deployed to: ${address}`);

    // Update deployments.json
    const deploymentsPath = "deployments-sepolia.json";
    const deployments = JSON.parse(fs.readFileSync(deploymentsPath, "utf8"));
    deployments.contracts.DexAggregator = address;
    fs.writeFileSync(deploymentsPath, JSON.stringify(deployments, null, 2));
    console.log("📝 Updated deployments-sepolia.json");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
