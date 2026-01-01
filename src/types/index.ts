// Common types used throughout the application

// AI Strategy types
export interface AIStrategy {
    marketBias: "bullish" | "bearish" | "neutral"
    dipProbability: number // 0-100
    riskRegime: "low" | "medium" | "high"
    nextMove: string
    confidence: number // 0-100
    lastUpdated: Date
}

// Portfolio performance data
export interface PerformanceDataPoint {
    timestamp: Date
    portfolioValue: number
    btcBenchmark?: number
    ethBenchmark?: number
}

// Wallet info
export interface WalletInfo {
    address: string
    chainId: number
    chainName: string
    isConnected: boolean
    balances: TokenBalance[]
}

export interface TokenBalance {
    symbol: string
    name: string
    balance: number
    valueUsd: number
    decimals: number
    address: string
}

// Chart types
export interface ChartDataPoint {
    name: string
    value: number
    fill?: string
}

// Navigation items
export interface NavItem {
    label: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    badge?: number
}

// Risk levels
export type RiskLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export const RISK_LABELS: Record<RiskLevel, string> = {
    1: "Very Conservative",
    2: "Conservative",
    3: "Moderately Conservative",
    4: "Moderate-Low",
    5: "Moderate",
    6: "Moderate-High",
    7: "Growth",
    8: "Aggressive",
    9: "Very Aggressive",
    10: "Maximum Risk",
}

// Trade action types
export type TradeAction = "buy" | "sell" | "bridge"

// Trade status
export type TradeStatus = "completed" | "pending" | "failed"

// Notification types
export type NotificationType = "trade" | "signal" | "profit" | "stop" | "info" | "warning"
