import { create } from "zustand"
import { persist } from "zustand/middleware"

// Portfolio asset type
export interface PortfolioAsset {
    symbol: string
    name: string
    amount: number
    value: number
    price: number
    change24h: number
    allocation: number
    icon?: string
}

// Portfolio state
interface PortfolioState {
    totalValue: number
    change24h: number
    unrealizedPnl: number
    stablecoinBalance: number
    assets: PortfolioAsset[]
    isLoading: boolean
    lastUpdated: Date | null

    // Actions
    setPortfolio: (data: Partial<PortfolioState>) => void
    setLoading: (loading: boolean) => void
    refreshPortfolio: () => Promise<void>
}

// Mock portfolio data for demo
const mockAssets: PortfolioAsset[] = [
    {
        symbol: "BTC",
        name: "Bitcoin",
        amount: 1.5,
        value: 65250,
        price: 43500,
        change24h: 2.34,
        allocation: 52,
        icon: "₿",
    },
    {
        symbol: "ETH",
        name: "Ethereum",
        amount: 12.5,
        value: 28750,
        price: 2300,
        change24h: 3.12,
        allocation: 23,
        icon: "Ξ",
    },
    {
        symbol: "USDC",
        name: "USD Coin",
        amount: 25000,
        value: 25000,
        price: 1.0,
        change24h: 0.01,
        allocation: 20,
        icon: "$",
    },
    {
        symbol: "LINK",
        name: "Chainlink",
        amount: 350,
        value: 5250,
        price: 15,
        change24h: -1.24,
        allocation: 5,
        icon: "⛓",
    },
]

export const usePortfolioStore = create<PortfolioState>()((set) => ({
    totalValue: 125432.5,
    change24h: 5.32,
    unrealizedPnl: 3245.0,
    stablecoinBalance: 25000,
    assets: mockAssets,
    isLoading: false,
    lastUpdated: new Date(),

    setPortfolio: (data) => set((state) => ({ ...state, ...data })),

    setLoading: (loading) => set({ isLoading: loading }),

    refreshPortfolio: async () => {
        set({ isLoading: true })
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        set({
            isLoading: false,
            lastUpdated: new Date(),
            // In production, fetch real data here
        })
    },
}))
