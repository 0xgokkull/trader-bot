"use client"

import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { mainnet, polygon, arbitrum, optimism, base } from "wagmi/chains"

// Project ID from WalletConnect - in production, get from environment
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo-project-id"

export const config = getDefaultConfig({
    appName: "Trader",
    projectId,
    chains: [mainnet, polygon, arbitrum, optimism, base],
    ssr: true,
})

// Supported chains for display
export const supportedChains = [
    { id: 1, name: "Ethereum", icon: "🔷" },
    { id: 137, name: "Polygon", icon: "🟣" },
    { id: 42161, name: "Arbitrum", icon: "🔵" },
    { id: 10, name: "Optimism", icon: "🔴" },
    { id: 8453, name: "Base", icon: "🔵" },
]
