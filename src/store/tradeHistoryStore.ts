import { create } from "zustand"

// Trade history entry
export interface TradeEntry {
    id: string
    timestamp: Date
    action: "buy" | "sell" | "bridge"
    asset: string
    amount: number
    price: number
    total: number
    status: "completed" | "pending" | "failed"
    txHash?: string
}

// Trade history state
interface TradeHistoryState {
    trades: TradeEntry[]
    isLoading: boolean
    page: number
    pageSize: number
    totalTrades: number

    // Actions
    setTrades: (trades: TradeEntry[]) => void
    addTrade: (trade: Omit<TradeEntry, "id">) => void
    setPage: (page: number) => void
    setLoading: (loading: boolean) => void
    fetchTrades: (page?: number) => Promise<void>
}

// Generate unique ID
const generateId = () => Math.random().toString(36).substr(2, 9)

// Mock trade data
const mockTrades: TradeEntry[] = [
    {
        id: "t1",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        action: "buy",
        asset: "BTC",
        amount: 0.05,
        price: 43500,
        total: 2175,
        status: "completed",
        txHash: "0x1234...abcd",
    },
    {
        id: "t2",
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        action: "sell",
        asset: "ETH",
        amount: 0.5,
        price: 2320,
        total: 1160,
        status: "completed",
        txHash: "0x5678...efgh",
    },
    {
        id: "t3",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
        action: "buy",
        asset: "LINK",
        amount: 50,
        price: 15.2,
        total: 760,
        status: "completed",
        txHash: "0x9abc...ijkl",
    },
    {
        id: "t4",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
        action: "bridge",
        asset: "USDC",
        amount: 5000,
        price: 1,
        total: 5000,
        status: "completed",
        txHash: "0xdef0...mnop",
    },
    {
        id: "t5",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
        action: "sell",
        asset: "BTC",
        amount: 0.1,
        price: 42800,
        total: 4280,
        status: "completed",
        txHash: "0x1111...qrst",
    },
    {
        id: "t6",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        action: "buy",
        asset: "ETH",
        amount: 2,
        price: 2250,
        total: 4500,
        status: "completed",
        txHash: "0x2222...uvwx",
    },
    {
        id: "t7",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
        action: "sell",
        asset: "LINK",
        amount: 100,
        price: 14.5,
        total: 1450,
        status: "completed",
        txHash: "0x3333...yzab",
    },
    {
        id: "t8",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
        action: "buy",
        asset: "BTC",
        amount: 0.25,
        price: 41200,
        total: 10300,
        status: "completed",
        txHash: "0x4444...cdef",
    },
]

export const useTradeHistoryStore = create<TradeHistoryState>()((set, get) => ({
    trades: mockTrades,
    isLoading: false,
    page: 1,
    pageSize: 10,
    totalTrades: mockTrades.length,

    setTrades: (trades) => set({ trades }),

    addTrade: (trade) => {
        const newTrade: TradeEntry = {
            ...trade,
            id: generateId(),
        }
        set((state) => ({
            trades: [newTrade, ...state.trades],
            totalTrades: state.totalTrades + 1,
        }))
    },

    setPage: (page) => set({ page }),

    setLoading: (loading) => set({ isLoading: loading }),

    fetchTrades: async (page = 1) => {
        set({ isLoading: true })
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))
        set({
            isLoading: false,
            page,
            // In production, fetch paginated data
        })
    },
}))
