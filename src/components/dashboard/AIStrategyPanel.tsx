"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertCircle,
  Zap,
  Activity,
  Target
} from "lucide-react"

// Mock AI strategy data
const aiStrategy = {
  marketBias: "bullish" as "bullish" | "bearish" | "neutral",
  dipProbability: 23,
  riskRegime: "low" as "low" | "medium" | "high",
  confidence: 78,
  nextMove: "Accumulate BTC on minor dips",
  signals: [
    { type: "bullish", message: "RSI divergence on 4H chart" },
    { type: "bullish", message: "Whale accumulation detected" },
    { type: "neutral", message: "Funding rates normalizing" },
  ],
  lastUpdated: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
}

export function AIStrategyPanel() {
  const biasConfig = {
    bullish: {
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      label: "Bullish",
    },
    bearish: {
      icon: TrendingDown,
      color: "text-red-500",
      bg: "bg-red-500/10",
      label: "Bearish",
    },
    neutral: {
      icon: Minus,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
      label: "Neutral",
    },
  }

  const riskConfig = {
    low: { color: "text-emerald-500", progress: 25 },
    medium: { color: "text-yellow-500", progress: 50 },
    high: { color: "text-red-500", progress: 85 },
  }

  const bias = biasConfig[aiStrategy.marketBias]
  const BiasIcon = bias.icon
  const risk = riskConfig[aiStrategy.riskRegime]

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Strategy Insights
        </CardTitle>
        <Badge variant="outline" className="text-xs">
          Updated 5m ago
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Market Bias */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${bias.bg}`}>
              <BiasIcon className={`h-5 w-5 ${bias.color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Market Bias</p>
              <p className={`text-lg font-semibold ${bias.color}`}>{bias.label}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Confidence</p>
            <p className="text-lg font-semibold">{aiStrategy.confidence}%</p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Dip Probability */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              Dip Probability
            </div>
            <div className="flex items-center gap-3">
              <Progress value={aiStrategy.dipProbability} className="h-2" />
              <span className="text-sm font-medium">{aiStrategy.dipProbability}%</span>
            </div>
          </div>

          {/* Risk Regime */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4" />
              Risk Regime
            </div>
            <div className="flex items-center gap-3">
              <Progress value={risk.progress} className="h-2" />
              <span className={`text-sm font-medium capitalize ${risk.color}`}>
                {aiStrategy.riskRegime}
              </span>
            </div>
          </div>
        </div>

        {/* Next Move */}
        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-primary">Suggested Action</p>
              <p className="text-sm text-muted-foreground mt-1">
                {aiStrategy.nextMove}
              </p>
            </div>
          </div>
        </div>

        {/* Active Signals */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Active Signals
          </h4>
          <div className="space-y-2">
            {aiStrategy.signals.map((signal, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 text-sm"
              >
                <div className={`w-2 h-2 rounded-full ${
                  signal.type === "bullish" ? "bg-emerald-500" :
                  signal.type === "bearish" ? "bg-red-500" : "bg-yellow-500"
                }`} />
                <span className="text-muted-foreground">{signal.message}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center pt-2 border-t border-border/50">
          AI insights are informational only. Not financial advice.
        </p>
      </CardContent>
    </Card>
  )
}
