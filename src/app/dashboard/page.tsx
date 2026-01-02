"use client"

import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Header, Footer } from "@/components/layout"
import {
  PortfolioSummary,
  AllocationChart,
  PerformanceGraph,
  AIStrategyPanel,
  TradeLogTable,
} from "@/components/dashboard"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"

export default function DashboardPage() {
  const { isConnected, address } = useAccount()
  const router = useRouter()

  // For demo purposes, show the dashboard regardless of wallet connection
  // In production, you may want to gate this behind wallet connection
  const showDemoMode = !isConnected

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 w-full px-6 md:px-8 py-8">
        <div className="space-y-8">
          {/* Demo Mode Banner */}
          {showDemoMode && (
            <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-3">
                <Wallet className="h-5 w-5 text-primary" />
                <span className="text-sm">
                  <strong>Demo Mode:</strong> Connect your wallet to see your real portfolio data.
                </span>
              </div>
              <ConnectButton />
            </div>
          )}

          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back! Here&apos;s your portfolio overview.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {showDemoMode ? "Sample data" : "Live data"}
            </div>
          </div>

          {/* Portfolio Summary Cards */}
          <PortfolioSummary />


          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Performance Graph - Takes 2 columns */}
            <div className="lg:col-span-2">
              <PerformanceGraph />
            </div>
            
            {/* Allocation Chart */}
            <div className="lg:col-span-1">
              <AllocationChart />
            </div>
          </div>

          {/* AI Strategy and Trade Log */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI Strategy Panel */}
            <div className="lg:col-span-1">
              <AIStrategyPanel />
            </div>
            
            {/* Trade Log - Takes 2 columns */}
            <div className="lg:col-span-2">
              <TradeLogTable />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
