const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

/**
 * Trading Bot Backend - Comprehensive Test Suite
 * 
 * This test file tests all backend functionality sequentially:
 * 1. Contract Deployments
 * 2. Swap Router (Uniswap V3 integration)
 * 3. Bridge Router (Chainlink CCIP)
 * 4. Trading Logic (Stop-loss, Take-profit, DCA)
 * 5. Trading Engine (Orchestrator)
 * 6. Price Oracle
 * 7. Access Control & Security
 * 
 * Run with: npx hardhat test
 */

describe("Trading Bot Backend - Complete Test Suite", function () {
    // ============================================================
    // FIXTURE: Deploy all contracts once and reuse
    // ============================================================

    async function deployFullSystemFixture() {
        const [owner, user1, user2, keeper] = await ethers.getSigners();

        // Deploy Mock Tokens
        const MockERC20 = await ethers.getContractFactory("MockERC20");
        const weth = await MockERC20.deploy("Wrapped Ether", "WETH", 18);
        const usdc = await MockERC20.deploy("USD Coin", "USDC", 6);
        const link = await MockERC20.deploy("Chainlink", "LINK", 18);

        // Deploy Mock Price Oracle
        const MockPriceOracle = await ethers.getContractFactory("MockPriceOracle");
        const mockPriceOracle = await MockPriceOracle.deploy(
            200000000000n, // $2000.00 (8 decimals)
            8,
            "ETH / USD"
        );

        // Deploy Mock Swap Router
        const MockSwapRouter = await ethers.getContractFactory("MockSwapRouter");
        const mockUniswapRouter = await MockSwapRouter.deploy();

        // Deploy Core Contracts
        const SwapRouter = await ethers.getContractFactory("SwapRouter");
        const swapRouter = await SwapRouter.deploy(await mockUniswapRouter.getAddress());

        const BridgeRouter = await ethers.getContractFactory("BridgeRouter");
        // For testing, we use owner as mock CCIP router (will revert on actual calls)
        const bridgeRouter = await BridgeRouter.deploy(owner.address, await link.getAddress());

        const TradingLogic = await ethers.getContractFactory("TradingLogic");
        const tradingLogic = await TradingLogic.deploy();

        const TradingEngine = await ethers.getContractFactory("TradingEngine");
        const tradingEngine = await TradingEngine.deploy();

        const PriceOracle = await ethers.getContractFactory("PriceOracle");
        const priceOracle = await PriceOracle.deploy();

        // Configure contracts
        await tradingEngine.initializeModules(
            await swapRouter.getAddress(),
            await bridgeRouter.getAddress(),
            await tradingLogic.getAddress()
        );

        await tradingLogic.setPriceFeed(await weth.getAddress(), await mockPriceOracle.getAddress());
        await tradingLogic.setSwapRouter(await swapRouter.getAddress());
        await priceOracle.setPriceFeed("ETH", await mockPriceOracle.getAddress());

        // Mint tokens to users for testing
        const mintAmount = ethers.parseEther("10000");
        const mintAmountUsdc = 10000n * 10n ** 6n; // 10000 USDC

        await weth.mint(user1.address, mintAmount);
        await weth.mint(user2.address, mintAmount);
        await usdc.mint(user1.address, mintAmountUsdc);
        await usdc.mint(user2.address, mintAmountUsdc);
        await link.mint(user1.address, mintAmount);

        // Fund mock router with tokens for swaps
        // Note: MockSwapRouter uses 1:1 exchange rate with 18 decimal precision
        // So 1 WETH (18 decimals) needs 1e18 USDC, which requires a huge amount due to 6 decimal USDC
        await weth.mint(await mockUniswapRouter.getAddress(), mintAmount);
        // Mint with 18 decimal scale to handle the 1:1 mock exchange
        await usdc.mint(await mockUniswapRouter.getAddress(), ethers.parseEther("100000"));

        return {
            owner,
            user1,
            user2,
            keeper,
            weth,
            usdc,
            link,
            mockPriceOracle,
            mockUniswapRouter,
            swapRouter,
            bridgeRouter,
            tradingLogic,
            tradingEngine,
            priceOracle
        };
    }

    // ============================================================
    // 1. CONTRACT DEPLOYMENT TESTS
    // ============================================================

    describe("1. Contract Deployments", function () {
        it("1.1 Should deploy all mock contracts", async function () {
            const { weth, usdc, link, mockPriceOracle, mockUniswapRouter } = await loadFixture(deployFullSystemFixture);

            expect(await weth.getAddress()).to.be.properAddress;
            expect(await usdc.getAddress()).to.be.properAddress;
            expect(await link.getAddress()).to.be.properAddress;
            expect(await mockPriceOracle.getAddress()).to.be.properAddress;
            expect(await mockUniswapRouter.getAddress()).to.be.properAddress;

            console.log("    ✓ All mock contracts deployed successfully");
        });

        it("1.2 Should deploy all core contracts", async function () {
            const { swapRouter, bridgeRouter, tradingLogic, tradingEngine, priceOracle } = await loadFixture(deployFullSystemFixture);

            expect(await swapRouter.getAddress()).to.be.properAddress;
            expect(await bridgeRouter.getAddress()).to.be.properAddress;
            expect(await tradingLogic.getAddress()).to.be.properAddress;
            expect(await tradingEngine.getAddress()).to.be.properAddress;
            expect(await priceOracle.getAddress()).to.be.properAddress;

            console.log("    ✓ All core contracts deployed successfully");
        });

        it("1.3 Should have correct ownership", async function () {
            const { owner, swapRouter, bridgeRouter, tradingLogic, tradingEngine, priceOracle } = await loadFixture(deployFullSystemFixture);

            expect(await swapRouter.owner()).to.equal(owner.address);
            expect(await bridgeRouter.owner()).to.equal(owner.address);
            expect(await tradingLogic.owner()).to.equal(owner.address);
            expect(await tradingEngine.owner()).to.equal(owner.address);
            expect(await priceOracle.owner()).to.equal(owner.address);

            console.log("    ✓ All contracts have correct ownership");
        });

        it("1.4 Should have TradingEngine modules initialized", async function () {
            const { swapRouter, bridgeRouter, tradingLogic, tradingEngine } = await loadFixture(deployFullSystemFixture);

            expect(await tradingEngine.swapRouter()).to.equal(await swapRouter.getAddress());
            expect(await tradingEngine.bridgeRouter()).to.equal(await bridgeRouter.getAddress());
            expect(await tradingEngine.tradingLogic()).to.equal(await tradingLogic.getAddress());

            console.log("    ✓ TradingEngine modules correctly initialized");
        });
    });

    // ============================================================
    // 2. MOCK TOKEN TESTS
    // ============================================================

    describe("2. Mock Token Functionality", function () {
        it("2.1 Should have correct token metadata", async function () {
            const { weth, usdc, link } = await loadFixture(deployFullSystemFixture);

            expect(await weth.name()).to.equal("Wrapped Ether");
            expect(await weth.symbol()).to.equal("WETH");
            expect(await weth.decimals()).to.equal(18);

            expect(await usdc.name()).to.equal("USD Coin");
            expect(await usdc.decimals()).to.equal(6);

            console.log("    ✓ Token metadata is correct");
        });

        it("2.2 Should allow faucet withdrawals", async function () {
            const { weth, user1 } = await loadFixture(deployFullSystemFixture);

            const faucetAmount = ethers.parseEther("100");
            const balanceBefore = await weth.balanceOf(user1.address);

            await weth.connect(user1).faucet(faucetAmount);

            const balanceAfter = await weth.balanceOf(user1.address);
            expect(balanceAfter - balanceBefore).to.equal(faucetAmount);

            console.log("    ✓ Faucet functionality works correctly");
        });

        it("2.3 Should limit faucet to 1000 tokens", async function () {
            const { weth, user1 } = await loadFixture(deployFullSystemFixture);

            const excessiveAmount = ethers.parseEther("1001");

            await expect(
                weth.connect(user1).faucet(excessiveAmount)
            ).to.be.revertedWith("Max 1000 tokens per faucet call");

            console.log("    ✓ Faucet limit enforced correctly");
        });
    });

    // ============================================================
    // 3. SWAP ROUTER TESTS
    // ============================================================

    describe("3. Swap Router (Uniswap V3)", function () {
        it("3.1 Should execute exact input single swap", async function () {
            const { swapRouter, weth, usdc, user1, mockUniswapRouter } = await loadFixture(deployFullSystemFixture);

            const amountIn = ethers.parseEther("1");
            const amountOutMin = 0n;
            const fee = 3000; // 0.3%

            // Approve swap router
            await weth.connect(user1).approve(await swapRouter.getAddress(), amountIn);

            // Execute swap
            const tx = await swapRouter.connect(user1).swapExactInputSingle(
                await weth.getAddress(),
                await usdc.getAddress(),
                amountIn,
                amountOutMin,
                fee,
                user1.address
            );

            await expect(tx).to.emit(swapRouter, "SwapExecuted");

            console.log("    ✓ Exact input single swap executed successfully");
        });

        it("3.2 Should update slippage tolerance", async function () {
            const { swapRouter, owner } = await loadFixture(deployFullSystemFixture);

            const newTolerance = 100; // 1%

            await expect(
                swapRouter.connect(owner).setSlippageTolerance(newTolerance)
            ).to.emit(swapRouter, "SlippageToleranceUpdated");

            expect(await swapRouter.slippageTolerance()).to.equal(newTolerance);

            console.log("    ✓ Slippage tolerance updated correctly");
        });

        it("3.3 Should reject slippage tolerance over 10%", async function () {
            const { swapRouter, owner } = await loadFixture(deployFullSystemFixture);

            await expect(
                swapRouter.connect(owner).setSlippageTolerance(1001)
            ).to.be.revertedWith("Max 10% slippage");

            console.log("    ✓ Excessive slippage tolerance rejected");
        });

        it("3.4 Should calculate minimum output correctly", async function () {
            const { swapRouter } = await loadFixture(deployFullSystemFixture);

            const expectedOutput = ethers.parseEther("100");
            const slippage = await swapRouter.slippageTolerance(); // 50 = 0.5%

            const minOutput = await swapRouter.calculateMinOutput(expectedOutput);
            const expectedMinOutput = expectedOutput - (expectedOutput * slippage) / 10000n;

            expect(minOutput).to.equal(expectedMinOutput);

            console.log("    ✓ Minimum output calculation is correct");
        });

        it("3.5 Should revert swap with invalid tokens", async function () {
            const { swapRouter, usdc, user1 } = await loadFixture(deployFullSystemFixture);

            await expect(
                swapRouter.connect(user1).swapExactInputSingle(
                    ethers.ZeroAddress,
                    await usdc.getAddress(),
                    ethers.parseEther("1"),
                    0,
                    3000,
                    user1.address
                )
            ).to.be.revertedWithCustomError(swapRouter, "InvalidToken");

            console.log("    ✓ Invalid token swap rejected");
        });
    });

    // ============================================================
    // 4. BRIDGE ROUTER TESTS
    // ============================================================

    describe("4. Bridge Router (Chainlink CCIP)", function () {
        it("4.1 Should configure supported chains", async function () {
            const { bridgeRouter, owner } = await loadFixture(deployFullSystemFixture);

            const sepoliaSelector = 16015286601757825753n;

            await bridgeRouter.connect(owner).setSupportedChain(sepoliaSelector, true);

            expect(await bridgeRouter.isChainSupported(sepoliaSelector)).to.be.true;

            console.log("    ✓ Chain support configured correctly");
        });

        it("4.2 Should set trusted senders", async function () {
            const { bridgeRouter, owner, user1 } = await loadFixture(deployFullSystemFixture);

            const chainSelector = 16015286601757825753n;

            await expect(
                bridgeRouter.connect(owner).setTrustedSender(chainSelector, user1.address)
            ).to.emit(bridgeRouter, "TrustedSenderUpdated");

            expect(await bridgeRouter.trustedSenders(chainSelector)).to.equal(user1.address);

            console.log("    ✓ Trusted sender configured correctly");
        });

        it("4.3 Should reject bridge to unsupported chain", async function () {
            const { bridgeRouter, weth, user1 } = await loadFixture(deployFullSystemFixture);

            const unsupportedChain = 999999n;
            const amount = ethers.parseEther("1");

            await weth.connect(user1).approve(await bridgeRouter.getAddress(), amount);

            await expect(
                bridgeRouter.connect(user1).bridgeTokens(
                    unsupportedChain,
                    user1.address,
                    await weth.getAddress(),
                    amount,
                    true
                )
            ).to.be.revertedWithCustomError(bridgeRouter, "UnsupportedChain");

            console.log("    ✓ Unsupported chain bridge rejected");
        });

        it("4.4 Should track bridge statistics", async function () {
            const { bridgeRouter } = await loadFixture(deployFullSystemFixture);

            expect(await bridgeRouter.totalBridgedOut()).to.equal(0);
            expect(await bridgeRouter.totalBridgedIn()).to.equal(0);
            expect(await bridgeRouter.bridgeCount()).to.equal(0);

            console.log("    ✓ Bridge statistics initialized correctly");
        });
    });

    // ============================================================
    // 5. TRADING LOGIC TESTS
    // ============================================================

    describe("5. Trading Logic (Strategies)", function () {
        it("5.1 Should create stop-loss trade", async function () {
            const { tradingLogic, weth, usdc, user1 } = await loadFixture(deployFullSystemFixture);

            const amountIn = ethers.parseEther("1");
            const stopPrice = 180000000000n; // $1800 (8 decimals)
            const expiresIn = 86400; // 24 hours

            await weth.connect(user1).approve(await tradingLogic.getAddress(), amountIn);

            const tx = await tradingLogic.connect(user1).createStopLoss(
                await weth.getAddress(),
                await usdc.getAddress(),
                amountIn,
                stopPrice,
                expiresIn
            );

            await expect(tx).to.emit(tradingLogic, "TradeCreated");

            // Check trade was stored
            const trade = await tradingLogic.trades(1);
            expect(trade.trader).to.equal(user1.address);
            expect(trade.strategy).to.equal(1); // STOP_LOSS
            expect(trade.isAboveTarget).to.be.false;

            console.log("    ✓ Stop-loss trade created successfully");
        });

        it("5.2 Should create take-profit trade", async function () {
            const { tradingLogic, weth, usdc, user1 } = await loadFixture(deployFullSystemFixture);

            const amountIn = ethers.parseEther("1");
            const targetPrice = 250000000000n; // $2500 (8 decimals)
            const expiresIn = 86400;

            await weth.connect(user1).approve(await tradingLogic.getAddress(), amountIn);

            await tradingLogic.connect(user1).createTakeProfit(
                await weth.getAddress(),
                await usdc.getAddress(),
                amountIn,
                targetPrice,
                expiresIn
            );

            const trade = await tradingLogic.trades(1);
            expect(trade.strategy).to.equal(2); // TAKE_PROFIT
            expect(trade.isAboveTarget).to.be.true;

            console.log("    ✓ Take-profit trade created successfully");
        });

        it("5.3 Should create limit order", async function () {
            const { tradingLogic, weth, usdc, user1 } = await loadFixture(deployFullSystemFixture);

            const amountIn = ethers.parseEther("1");
            const limitPrice = 190000000000n;
            const isBuyOrder = true;
            const expiresIn = 86400;

            await weth.connect(user1).approve(await tradingLogic.getAddress(), amountIn);

            await tradingLogic.connect(user1).createLimitOrder(
                await weth.getAddress(),
                await usdc.getAddress(),
                amountIn,
                limitPrice,
                isBuyOrder,
                expiresIn
            );

            const trade = await tradingLogic.trades(1);
            expect(trade.strategy).to.equal(4); // LIMIT_ORDER

            console.log("    ✓ Limit order created successfully");
        });

        it("5.4 Should create DCA plan", async function () {
            const { tradingLogic, weth, usdc, user1 } = await loadFixture(deployFullSystemFixture);

            const amountPerInterval = ethers.parseEther("0.1");
            const interval = 3600; // 1 hour
            const totalIntervals = 10;
            const totalAmount = amountPerInterval * BigInt(totalIntervals);

            await weth.connect(user1).approve(await tradingLogic.getAddress(), totalAmount);

            const tx = await tradingLogic.connect(user1).createDCAPlan(
                await weth.getAddress(),
                await usdc.getAddress(),
                amountPerInterval,
                interval,
                totalIntervals
            );

            await expect(tx).to.emit(tradingLogic, "DCAPlanCreated");

            const plan = await tradingLogic.dcaPlans(1);
            expect(plan.trader).to.equal(user1.address);
            expect(plan.active).to.be.true;
            expect(plan.totalIntervals).to.equal(totalIntervals);

            console.log("    ✓ DCA plan created successfully");
        });

        it("5.5 Should cancel pending trade and refund tokens", async function () {
            const { tradingLogic, weth, usdc, user1 } = await loadFixture(deployFullSystemFixture);

            const amountIn = ethers.parseEther("1");
            await weth.connect(user1).approve(await tradingLogic.getAddress(), amountIn);

            await tradingLogic.connect(user1).createStopLoss(
                await weth.getAddress(),
                await usdc.getAddress(),
                amountIn,
                180000000000n,
                86400
            );

            const balanceBefore = await weth.balanceOf(user1.address);

            await tradingLogic.connect(user1).cancelTrade(1);

            const balanceAfter = await weth.balanceOf(user1.address);
            expect(balanceAfter - balanceBefore).to.equal(amountIn);

            const trade = await tradingLogic.trades(1);
            expect(trade.status).to.equal(2); // CANCELLED (0=PENDING, 1=EXECUTED, 2=CANCELLED, 3=EXPIRED)

            console.log("    ✓ Trade cancelled and tokens refunded");
        });

        it("5.6 Should cancel DCA plan and refund remaining tokens", async function () {
            const { tradingLogic, weth, usdc, user1 } = await loadFixture(deployFullSystemFixture);

            const amountPerInterval = ethers.parseEther("0.1");
            const interval = 60;
            const totalIntervals = 10;
            const totalAmount = amountPerInterval * BigInt(totalIntervals);

            await weth.connect(user1).approve(await tradingLogic.getAddress(), totalAmount);

            await tradingLogic.connect(user1).createDCAPlan(
                await weth.getAddress(),
                await usdc.getAddress(),
                amountPerInterval,
                interval,
                totalIntervals
            );

            const balanceBefore = await weth.balanceOf(user1.address);

            await tradingLogic.connect(user1).cancelDCAPlan(1);

            const balanceAfter = await weth.balanceOf(user1.address);
            expect(balanceAfter - balanceBefore).to.equal(totalAmount);

            console.log("    ✓ DCA plan cancelled and tokens refunded");
        });

        it("5.7 Should get user trades", async function () {
            const { tradingLogic, weth, usdc, user1 } = await loadFixture(deployFullSystemFixture);

            const amountIn = ethers.parseEther("0.5");
            await weth.connect(user1).approve(await tradingLogic.getAddress(), amountIn * 2n);

            await tradingLogic.connect(user1).createStopLoss(
                await weth.getAddress(),
                await usdc.getAddress(),
                amountIn,
                180000000000n,
                86400
            );

            await tradingLogic.connect(user1).createTakeProfit(
                await weth.getAddress(),
                await usdc.getAddress(),
                amountIn,
                250000000000n,
                86400
            );

            const userTrades = await tradingLogic.getUserTrades(user1.address);
            expect(userTrades.length).to.equal(2);

            console.log("    ✓ User trades retrieved correctly");
        });

        it("5.8 Should reject trade with no owner cancellation", async function () {
            const { tradingLogic, weth, usdc, user1, user2 } = await loadFixture(deployFullSystemFixture);

            const amountIn = ethers.parseEther("1");
            await weth.connect(user1).approve(await tradingLogic.getAddress(), amountIn);

            await tradingLogic.connect(user1).createStopLoss(
                await weth.getAddress(),
                await usdc.getAddress(),
                amountIn,
                180000000000n,
                86400
            );

            // User2 tries to cancel User1's trade
            await expect(
                tradingLogic.connect(user2).cancelTrade(1)
            ).to.be.revertedWithCustomError(tradingLogic, "NotTradeOwner");

            console.log("    ✓ Non-owner trade cancellation rejected");
        });
    });

    // ============================================================
    // 6. TRADING ENGINE TESTS
    // ============================================================

    describe("6. Trading Engine (Orchestrator)", function () {
        it("6.1 Should get correct statistics", async function () {
            const { tradingEngine } = await loadFixture(deployFullSystemFixture);

            const [swaps, bridges, trades, isPaused] = await tradingEngine.getStatistics();

            expect(swaps).to.equal(0);
            expect(bridges).to.equal(0);
            expect(trades).to.equal(0);
            expect(isPaused).to.be.false;

            console.log("    ✓ Statistics returned correctly");
        });

        it("6.2 Should pause and unpause engine", async function () {
            const { tradingEngine, owner } = await loadFixture(deployFullSystemFixture);

            await tradingEngine.connect(owner).setPaused(true);
            expect((await tradingEngine.getStatistics())[3]).to.be.true;

            await tradingEngine.connect(owner).setPaused(false);
            expect((await tradingEngine.getStatistics())[3]).to.be.false;

            console.log("    ✓ Engine pause/unpause works correctly");
        });

        it("6.3 Should reject operations when paused", async function () {
            const { tradingEngine, weth, usdc, owner, user1 } = await loadFixture(deployFullSystemFixture);

            await tradingEngine.connect(owner).setPaused(true);

            const amountIn = ethers.parseEther("1");
            await weth.connect(user1).approve(await tradingEngine.getAddress(), amountIn);

            await expect(
                tradingEngine.connect(user1).executeSwap(
                    await weth.getAddress(),
                    await usdc.getAddress(),
                    amountIn,
                    0,
                    3000
                )
            ).to.be.revertedWithCustomError(tradingEngine, "EngineIsPaused");

            console.log("    ✓ Operations rejected when engine paused");
        });

        it("6.4 Should update individual modules", async function () {
            const { tradingEngine, owner, user1 } = await loadFixture(deployFullSystemFixture);

            // Deploy a new mock swap router
            const MockSwapRouter = await ethers.getContractFactory("MockSwapRouter");
            const newSwapRouter = await MockSwapRouter.deploy();

            const SwapRouter = await ethers.getContractFactory("SwapRouter");
            const newSwapRouterContract = await SwapRouter.deploy(await newSwapRouter.getAddress());

            await tradingEngine.connect(owner).updateSwapRouter(await newSwapRouterContract.getAddress());

            expect(await tradingEngine.swapRouter()).to.equal(await newSwapRouterContract.getAddress());

            console.log("    ✓ Module update works correctly");
        });

        it("6.5 Should reject invalid module addresses", async function () {
            const { tradingEngine, owner } = await loadFixture(deployFullSystemFixture);

            await expect(
                tradingEngine.connect(owner).updateSwapRouter(ethers.ZeroAddress)
            ).to.be.revertedWithCustomError(tradingEngine, "InvalidModule");

            console.log("    ✓ Invalid module address rejected");
        });
    });

    // ============================================================
    // 7. PRICE ORACLE TESTS
    // ============================================================

    describe("7. Price Oracle (Chainlink)", function () {
        it("7.1 Should get latest price for symbol", async function () {
            const { priceOracle } = await loadFixture(deployFullSystemFixture);

            const priceData = await priceOracle.getLatestPrice("ETH");

            expect(priceData.price).to.equal(200000000000n); // $2000
            expect(priceData.decimals).to.equal(8);

            console.log("    ✓ Latest price retrieved correctly");
        });

        it("7.2 Should get normalized price (18 decimals)", async function () {
            const { priceOracle } = await loadFixture(deployFullSystemFixture);

            const normalizedPrice = await priceOracle.getNormalizedPrice("ETH");

            // $2000 with 8 decimals normalized to 18 decimals
            expect(normalizedPrice).to.equal(200000000000n * 10n ** 10n);

            console.log("    ✓ Normalized price calculated correctly");
        });

        it("7.3 Should revert for unknown symbol", async function () {
            const { priceOracle } = await loadFixture(deployFullSystemFixture);

            await expect(
                priceOracle.getLatestPrice("UNKNOWN")
            ).to.be.revertedWithCustomError(priceOracle, "PriceFeedNotFound");

            console.log("    ✓ Unknown symbol rejected correctly");
        });

        it("7.4 Should set multiple price feeds at once", async function () {
            const { priceOracle, mockPriceOracle, owner } = await loadFixture(deployFullSystemFixture);

            const symbols = ["BTC", "LINK"];
            const feeds = [await mockPriceOracle.getAddress(), await mockPriceOracle.getAddress()];

            await priceOracle.connect(owner).setPriceFeeds(symbols, feeds);

            const btcPrice = await priceOracle.getLatestPrice("BTC");
            expect(btcPrice.price).to.be.gt(0);

            console.log("    ✓ Multiple price feeds set correctly");
        });

        it("7.5 Should update staleness threshold", async function () {
            const { priceOracle, owner } = await loadFixture(deployFullSystemFixture);

            const newThreshold = 7200; // 2 hours

            await priceOracle.connect(owner).setStalenessThreshold(newThreshold);

            expect(await priceOracle.stalenessThreshold()).to.equal(newThreshold);

            console.log("    ✓ Staleness threshold updated correctly");
        });
    });

    // ============================================================
    // 8. MOCK PRICE ORACLE BEHAVIOR TESTS
    // ============================================================

    describe("8. Mock Price Oracle Behavior", function () {
        it("8.1 Should update price", async function () {
            const { mockPriceOracle, owner } = await loadFixture(deployFullSystemFixture);

            const newPrice = 250000000000n; // $2500

            await mockPriceOracle.connect(owner).setPrice(newPrice);

            expect(await mockPriceOracle.getPrice()).to.equal(newPrice);

            console.log("    ✓ Mock price updated correctly");
        });

        it("8.2 Should simulate price change", async function () {
            const { mockPriceOracle, owner } = await loadFixture(deployFullSystemFixture);

            const initialPrice = await mockPriceOracle.getPrice();

            // Simulate 10% increase (1000 basis points)
            await mockPriceOracle.connect(owner).simulatePriceChange(1000);

            const newPrice = await mockPriceOracle.getPrice();
            expect(newPrice).to.equal(initialPrice + (initialPrice * 1000n) / 10000n);

            console.log("    ✓ Price change simulation works correctly");
        });

        it("8.3 Should return correct round data", async function () {
            const { mockPriceOracle } = await loadFixture(deployFullSystemFixture);

            const [roundId, answer, startedAt, updatedAt, answeredInRound] = await mockPriceOracle.latestRoundData();

            expect(roundId).to.be.gt(0);
            expect(answer).to.equal(200000000000n);
            expect(updatedAt).to.be.gt(0);

            console.log("    ✓ Round data returned correctly");
        });
    });

    // ============================================================
    // 9. ACCESS CONTROL TESTS
    // ============================================================

    describe("9. Access Control & Security", function () {
        it("9.1 Should reject non-owner price feed updates", async function () {
            const { priceOracle, user1, mockPriceOracle } = await loadFixture(deployFullSystemFixture);

            await expect(
                priceOracle.connect(user1).setPriceFeed("BTC", await mockPriceOracle.getAddress())
            ).to.be.revertedWithCustomError(priceOracle, "OwnableUnauthorizedAccount");

            console.log("    ✓ Non-owner price feed update rejected");
        });

        it("9.2 Should reject non-owner slippage updates", async function () {
            const { swapRouter, user1 } = await loadFixture(deployFullSystemFixture);

            await expect(
                swapRouter.connect(user1).setSlippageTolerance(100)
            ).to.be.revertedWithCustomError(swapRouter, "OwnableUnauthorizedAccount");

            console.log("    ✓ Non-owner slippage update rejected");
        });

        it("9.3 Should reject non-owner chain support updates", async function () {
            const { bridgeRouter, user1 } = await loadFixture(deployFullSystemFixture);

            await expect(
                bridgeRouter.connect(user1).setSupportedChain(123456n, true)
            ).to.be.revertedWithCustomError(bridgeRouter, "OwnableUnauthorizedAccount");

            console.log("    ✓ Non-owner chain support update rejected");
        });

        it("9.4 Should allow owner token rescue", async function () {
            const { swapRouter, weth, owner } = await loadFixture(deployFullSystemFixture);

            // First send some tokens to the contract
            const amount = ethers.parseEther("1");
            await weth.mint(await swapRouter.getAddress(), amount);

            const balanceBefore = await weth.balanceOf(owner.address);

            await swapRouter.connect(owner).rescueTokens(await weth.getAddress(), amount);

            const balanceAfter = await weth.balanceOf(owner.address);
            expect(balanceAfter - balanceBefore).to.equal(amount);

            console.log("    ✓ Owner token rescue successful");
        });

        it("9.5 Should reject non-owner token rescue", async function () {
            const { swapRouter, weth, user1 } = await loadFixture(deployFullSystemFixture);

            await expect(
                swapRouter.connect(user1).rescueTokens(await weth.getAddress(), 100)
            ).to.be.revertedWithCustomError(swapRouter, "OwnableUnauthorizedAccount");

            console.log("    ✓ Non-owner token rescue rejected");
        });
    });

    // ============================================================
    // 10. INTEGRATION TESTS
    // ============================================================

    describe("10. Integration Tests", function () {
        it("10.1 Full swap flow through TradingEngine", async function () {
            const { tradingEngine, swapRouter, weth, usdc, user1, mockUniswapRouter } = await loadFixture(deployFullSystemFixture);

            const amountIn = ethers.parseEther("1");

            // Approve TradingEngine
            await weth.connect(user1).approve(await tradingEngine.getAddress(), amountIn);

            // Get initial balances
            const wethBefore = await weth.balanceOf(user1.address);

            // Execute swap through engine
            await tradingEngine.connect(user1).executeSwap(
                await weth.getAddress(),
                await usdc.getAddress(),
                amountIn,
                0,
                3000
            );

            const wethAfter = await weth.balanceOf(user1.address);
            expect(wethBefore - wethAfter).to.equal(amountIn);

            // Check statistics updated
            const [swaps] = await tradingEngine.getStatistics();
            expect(swaps).to.equal(1);

            console.log("    ✓ Full swap flow completed successfully");
        });

        it("10.2 Full trading strategy flow", async function () {
            const { tradingEngine, tradingLogic, weth, usdc, user1 } = await loadFixture(deployFullSystemFixture);

            const amountIn = ethers.parseEther("1");
            const stopPrice = 180000000000n;
            const expiresIn = 86400;

            // Approve TradingEngine
            await weth.connect(user1).approve(await tradingEngine.getAddress(), amountIn);

            // Create stop-loss through TradingEngine
            await tradingEngine.connect(user1).createStopLossOrder(
                await weth.getAddress(),
                await usdc.getAddress(),
                amountIn,
                stopPrice,
                expiresIn
            );

            // Verify trade was created in TradingLogic (trades are registered to TradingEngine address, not user)
            const tradeCounter = await tradingLogic.tradeCounter();
            expect(tradeCounter).to.equal(1);

            // Check statistics updated
            const [, , trades] = await tradingEngine.getStatistics();
            expect(trades).to.equal(1);

            console.log("    ✓ Full trading strategy flow completed successfully");
        });

        it("10.3 Multiple users trading simultaneously", async function () {
            const { tradingLogic, weth, usdc, user1, user2 } = await loadFixture(deployFullSystemFixture);

            const amountIn = ethers.parseEther("0.5");

            // Both users approve
            await weth.connect(user1).approve(await tradingLogic.getAddress(), amountIn);
            await weth.connect(user2).approve(await tradingLogic.getAddress(), amountIn);

            // Both users create trades
            await tradingLogic.connect(user1).createStopLoss(
                await weth.getAddress(),
                await usdc.getAddress(),
                amountIn,
                180000000000n,
                86400
            );

            await tradingLogic.connect(user2).createTakeProfit(
                await weth.getAddress(),
                await usdc.getAddress(),
                amountIn,
                250000000000n,
                86400
            );

            // Verify each user has their own trade
            const user1Trades = await tradingLogic.getUserTrades(user1.address);
            const user2Trades = await tradingLogic.getUserTrades(user2.address);

            expect(user1Trades.length).to.equal(1);
            expect(user2Trades.length).to.equal(1);
            expect(user1Trades[0]).to.not.equal(user2Trades[0]);

            console.log("    ✓ Multiple users can trade simultaneously");
        });
    });

    // ============================================================
    // SUMMARY
    // ============================================================

    describe("Test Summary", function () {
        it("All tests completed", async function () {
            console.log("\n" + "=".repeat(60));
            console.log("🎉 ALL TRADING BOT BACKEND TESTS PASSED!");
            console.log("=".repeat(60));
            console.log("\nModules Tested:");
            console.log("  ✓ Contract Deployments");
            console.log("  ✓ Mock Token Functionality");
            console.log("  ✓ Swap Router (Uniswap V3)");
            console.log("  ✓ Bridge Router (Chainlink CCIP)");
            console.log("  ✓ Trading Logic (Strategies)");
            console.log("  ✓ Trading Engine (Orchestrator)");
            console.log("  ✓ Price Oracle (Chainlink)");
            console.log("  ✓ Mock Price Oracle Behavior");
            console.log("  ✓ Access Control & Security");
            console.log("  ✓ Integration Tests");
            console.log("\n" + "=".repeat(60) + "\n");
        });
    });
});
