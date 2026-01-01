"use client"

import { usePortfolioStore } from "@/store"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function PortfolioSummary() {
  const { totalValue, change24h, unrealizedPnl, stablecoinBalance, isLoading, refreshPortfolio } = usePortfolioStore()

  const isPositiveChange = change24h >= 0
  const isPositivePnl = unrealizedPnl >= 0

  const cards = [
    {
      title: "Total Portfolio Value",
      value: formatCurrency(totalValue),
      change: formatPercentage(change24h),
      isPositive: isPositiveChange,
      icon: DollarSign,
      iconBg: "from-emerald-500/20 to-teal-500/20",
      iconColor: "text-emerald-500",
    },
    {
      title: "24h Change",
      value: formatPercentage(change24h),
      change: formatCurrency(totalValue * (change24h / 100)),
      isPositive: isPositiveChange,
      icon: isPositiveChange ? TrendingUp : TrendingDown,
      iconBg: isPositiveChange ? "from-emerald-500/20 to-teal-500/20" : "from-red-500/20 to-orange-500/20",
      iconColor: isPositiveChange ? "text-emerald-500" : "text-red-500",
    },
    {
      title: "Unrealized PnL",
      value: formatCurrency(Math.abs(unrealizedPnl)),
      prefix: isPositivePnl ? "+" : "-",
      change: null,
      isPositive: isPositivePnl,
      icon: isPositivePnl ? ArrowUpRight : ArrowDownRight,
      iconBg: isPositivePnl ? "from-emerald-500/20 to-teal-500/20" : "from-red-500/20 to-orange-500/20",
      iconColor: isPositivePnl ? "text-emerald-500" : "text-red-500",
    },
    {
      title: "Stablecoin Balance",
      value: formatCurrency(stablecoinBalance),
      change: `${((stablecoinBalance / totalValue) * 100).toFixed(1)}% of portfolio`,
      isPositive: true,
      icon: Wallet,
      iconBg: "from-blue-500/20 to-indigo-500/20",
      iconColor: "text-blue-500",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Portfolio Overview</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={refreshPortfolio}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <Card key={index} className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/30 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className={`text-2xl font-bold ${card.isPositive ? "text-foreground" : "text-red-500"}`}>
                    {card.prefix && <span>{card.prefix}</span>}
                    {card.value}
                  </p>
                  {card.change && (
                    <p className={`text-xs ${card.isPositive ? "text-emerald-500" : "text-red-500"}`}>
                      {card.change}
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.iconBg}`}>
                  <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
