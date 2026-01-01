"use client"

import { usePortfolioStore } from "@/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

// Chart colors with oklch converted to hex for Recharts
const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4"]

export function AllocationChart() {
  const assets = usePortfolioStore((state) => state.assets)

  // Prepare data for pie chart
  const chartData = assets.map((asset, index) => ({
    name: asset.symbol,
    value: asset.allocation,
    amount: asset.amount,
    valueUsd: asset.value,
    fill: COLORS[index % COLORS.length],
  }))

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3 text-sm">
          <p className="font-semibold">{data.name}</p>
          <p className="text-muted-foreground">
            Allocation: <span className="text-foreground">{data.value}%</span>
          </p>
          <p className="text-muted-foreground">
            Amount: <span className="text-foreground">{data.amount.toLocaleString()}</span>
          </p>
          <p className="text-muted-foreground">
            Value: <span className="text-foreground">${data.valueUsd.toLocaleString()}</span>
          </p>
        </div>
      )
    }
    return null
  }

  // Custom legend
  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-muted-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Portfolio Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Asset list */}
        <div className="mt-4 space-y-2">
          {assets.map((asset, index) => (
            <div 
              key={asset.symbol}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-2 h-8 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <div>
                  <p className="font-medium">{asset.symbol}</p>
                  <p className="text-xs text-muted-foreground">{asset.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{asset.allocation}%</p>
                <p className="text-xs text-muted-foreground">
                  ${asset.value.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
