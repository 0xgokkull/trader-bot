"use client"

import { useSettingsStore, RiskLevel } from "@/store"
import { RISK_LABELS } from "@/types"
import { Header, Footer } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  AlertTriangle,
  Shield,
  Bell,
  Moon,
  Sun,
  RotateCcw,
  Save,
  TrendingDown,
  Target,
  Layers
} from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const {
    riskLevel,
    stopLossEnabled,
    stopLossPercentage,
    stablecoinTarget,
    maxOpenPositions,
    tradeNotifications,
    signalNotifications,
    profitAlerts,
    darkMode,
    riskAcknowledged,
    setRiskLevel,
    setStopLoss,
    setStablecoinTarget,
    setMaxPositions,
    toggleNotification,
    toggleDarkMode,
    acknowledgeRisk,
    resetSettings,
  } = useSettingsStore()

  const handleSave = () => {
    toast.success("Settings saved successfully")
  }

  const handleReset = () => {
    resetSettings()
    toast.info("Settings reset to defaults")
  }

  const getRiskColor = (level: RiskLevel) => {
    if (level <= 3) return "text-emerald-500"
    if (level <= 6) return "text-yellow-500"
    return "text-red-500"
  }

  const getRiskBadge = (level: RiskLevel) => {
    if (level <= 3) return <Badge className="bg-emerald-500/10 text-emerald-500">Conservative</Badge>
    if (level <= 6) return <Badge className="bg-yellow-500/10 text-yellow-500">Moderate</Badge>
    return <Badge className="bg-red-500/10 text-red-500">Aggressive</Badge>
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 w-full px-6 md:px-8 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground">
                Configure your trading preferences and risk parameters.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
            </div>
          </div>

          {/* Risk Disclaimer */}
          {!riskAcknowledged && (
            <Card className="border-destructive/50 bg-destructive/10">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
                  <div className="space-y-3">
                    <h3 className="font-semibold text-destructive">Risk Acknowledgement Required</h3>
                    <p className="text-sm text-muted-foreground">
                      AI execution is not guaranteed to be profitable. You may lose money. 
                      Trading cryptocurrencies involves significant risk including the potential loss of principal.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={acknowledgeRisk}
                      className="border-destructive/30 text-destructive hover:bg-destructive/10"
                    >
                      I Understand and Accept the Risks
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Risk Level Settings */}
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20">
                  <Shield className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <CardTitle>Risk Settings</CardTitle>
                  <CardDescription>Configure your risk tolerance and limits</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Risk Level Slider */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Risk Level</Label>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold ${getRiskColor(riskLevel)}`}>
                      {riskLevel}
                    </span>
                    {getRiskBadge(riskLevel)}
                  </div>
                </div>
                <Slider
                  value={[riskLevel]}
                  onValueChange={([value]) => setRiskLevel(value as RiskLevel)}
                  min={1}
                  max={10}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Conservative</span>
                  <span>Moderate</span>
                  <span>Aggressive</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {RISK_LABELS[riskLevel as RiskLevel]}
                </p>
              </div>

              <Separator />

              {/* Stop Loss */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingDown className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label className="text-base font-medium">Stop-Loss Protection</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically close positions at loss threshold
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={stopLossEnabled}
                    onCheckedChange={(checked) => setStopLoss(checked)}
                  />
                </div>
                {stopLossEnabled && (
                  <div className="pl-8 space-y-2">
                    <Label className="text-sm">Stop-Loss Percentage</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[stopLossPercentage]}
                        onValueChange={([value]) => setStopLoss(true, value)}
                        min={5}
                        max={50}
                        step={5}
                        className="flex-1"
                      />
                      <span className="w-16 text-right font-mono">{stopLossPercentage}%</span>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Stablecoin Target */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label className="text-base font-medium">Stablecoin Target</Label>
                    <p className="text-sm text-muted-foreground">
                      Target percentage of portfolio in stablecoins
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[stablecoinTarget]}
                    onValueChange={([value]) => setStablecoinTarget(value)}
                    min={0}
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                  <span className="w-16 text-right font-mono">{stablecoinTarget}%</span>
                </div>
              </div>

              <Separator />

              {/* Max Open Positions */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Layers className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label className="text-base font-medium">Max Open Positions</Label>
                    <p className="text-sm text-muted-foreground">
                      Maximum number of concurrent positions
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    value={maxOpenPositions}
                    onChange={(e) => setMaxPositions(parseInt(e.target.value) || 1)}
                    min={1}
                    max={20}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">positions</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
                  <Bell className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Choose which alerts you want to receive</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <Label className="text-base font-medium">Trade Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when trades are executed
                  </p>
                </div>
                <Switch
                  checked={tradeNotifications}
                  onCheckedChange={() => toggleNotification("trade")}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between py-2">
                <div>
                  <Label className="text-base font-medium">AI Signal Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts for new AI trading signals
                  </p>
                </div>
                <Switch
                  checked={signalNotifications}
                  onCheckedChange={() => toggleNotification("signal")}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between py-2">
                <div>
                  <Label className="text-base font-medium">Profit/Loss Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified for significant P&L events
                  </p>
                </div>
                <Switch
                  checked={profitAlerts}
                  onCheckedChange={() => toggleNotification("profit")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                  <Settings className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize your visual preferences</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  {darkMode ? (
                    <Moon className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Sun className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <Label className="text-base font-medium">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Use dark color scheme
                    </p>
                  </div>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
            </CardContent>
          </Card>

          {/* Legal Disclaimer */}
          <Card className="bg-muted/30 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Legal Notice</p>
                  <p className="text-xs text-muted-foreground">
                    This platform provides automated execution assistance only. It does not constitute 
                    financial advice, investment advisory, or asset management services. Trading 
                    cryptocurrencies involves significant risk including potential loss of principal. 
                    Past performance does not guarantee future results. By using this platform, you 
                    acknowledge and accept all associated risks.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
