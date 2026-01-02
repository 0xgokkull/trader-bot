"use client"

import { useAccount, useBalance, useChainId, useSwitchChain, useDisconnect } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Header, Footer } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Wallet, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertTriangle,
  Shield,
  Coins,
  Network,
  LogOut,
  RefreshCw
} from "lucide-react"
import { useState } from "react"
import { truncateAddress, formatCurrency } from "@/lib/utils"
import { supportedChains } from "@/lib/wagmi"
import { mainnet, polygon, arbitrum, optimism, base } from "wagmi/chains"

// Mock token balances
const mockTokens = [
  { symbol: "ETH", name: "Ethereum", balance: 2.5, valueUsd: 5750, icon: "Ξ" },
  { symbol: "USDC", name: "USD Coin", balance: 10000, valueUsd: 10000, icon: "$" },
  { symbol: "WBTC", name: "Wrapped Bitcoin", balance: 0.15, valueUsd: 6525, icon: "₿" },
  { symbol: "LINK", name: "Chainlink", balance: 150, valueUsd: 2250, icon: "⛓" },
]

export default function WalletPage() {
  const { isConnected, address } = useAccount()
  const chainId = useChainId()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const { disconnect } = useDisconnect()
  const { data: balance, refetch: refetchBalance } = useBalance({ address })
  
  const [copied, setCopied] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Check if on supported chain
  const currentChain = supportedChains.find((c) => c.id === chainId)
  const isUnsupportedChain = chainId && !currentChain

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetchBalance()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const totalBalanceUsd = mockTokens.reduce((acc, token) => acc + token.valueUsd, 0)

  // Not connected state
  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6 p-8">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
              <Wallet className="h-10 w-10 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Connect Your Wallet</h1>
              <p className="text-muted-foreground max-w-md">
                Connect your wallet to view your balances and manage your assets.
              </p>
            </div>
            <ConnectButton />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 w-full px-6 md:px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold">Wallet</h1>
            <p className="text-muted-foreground">
              Manage your connected wallet and view balances.
            </p>
          </div>

          {/* Unsupported Chain Warning */}
          {isUnsupportedChain && (
            <Card className="border-destructive/50 bg-destructive/10">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  <div className="space-y-2">
                    <p className="font-medium text-destructive">Unsupported Network</p>
                    <p className="text-sm text-muted-foreground">
                      Please switch to a supported network to use all features.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {[mainnet, polygon, arbitrum, optimism, base].map((chain) => (
                        <Button
                          key={chain.id}
                          variant="outline"
                          size="sm"
                          onClick={() => switchChain({ chainId: chain.id })}
                          disabled={isSwitching}
                        >
                          {chain.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Connected Wallet Card */}
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
                    <Wallet className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <CardTitle>Connected Wallet</CardTitle>
                    <CardDescription>Your active wallet connection</CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="text-emerald-500 border-emerald-500/30">
                  Connected
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Wallet Address */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Wallet Address</p>
                  <p className="font-mono text-lg">{truncateAddress(address || "", 8)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={copyAddress}>
                    {copied ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <a 
                      href={`https://etherscan.io/address/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Network */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div className="flex items-center gap-3">
                  <Network className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Network</p>
                    <p className="font-medium">
                      {currentChain ? (
                        <>
                          {currentChain.icon} {currentChain.name}
                        </>
                      ) : (
                        `Chain ID: ${chainId}`
                      )}
                    </p>
                  </div>
                </div>
                <ConnectButton.Custom>
                  {({ openChainModal }) => (
                    <Button variant="outline" size="sm" onClick={openChainModal}>
                      Switch
                    </Button>
                  )}
                </ConnectButton.Custom>
              </div>

              {/* Security Info */}
              <div className="flex items-center gap-3 p-4 rounded-xl border border-primary/20 bg-primary/5">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-primary">Non-Custodial</p>
                  <p className="text-xs text-muted-foreground">
                    Your keys never leave your wallet. We only request signatures.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Disconnect Button */}
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => disconnect()} className="gap-2 text-destructive hover:text-destructive">
                  <LogOut className="h-4 w-4" />
                  Disconnect Wallet
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Balances Card */}
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
                    <Coins className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle>Token Balances</CardTitle>
                    <CardDescription>Your wallet token holdings</CardDescription>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Total Balance */}
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                <p className="text-sm text-muted-foreground">Total Balance</p>
                <p className="text-3xl font-bold">{formatCurrency(totalBalanceUsd)}</p>
              </div>

              {/* Token List */}
              <div className="space-y-2">
                {mockTokens.map((token) => (
                  <div 
                    key={token.symbol}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
                        {token.icon}
                      </div>
                      <div>
                        <p className="font-medium">{token.symbol}</p>
                        <p className="text-sm text-muted-foreground">{token.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{token.balance.toLocaleString()} {token.symbol}</p>
                      <p className="text-sm text-muted-foreground">{formatCurrency(token.valueUsd)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Native Balance */}
              {balance && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Native Balance</span>
                    <span className="font-mono">
                      {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Supported Wallets */}
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Supported Wallets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "MetaMask", icon: "🦊" },
                  { name: "WalletConnect", icon: "🔗" },
                  { name: "Coinbase", icon: "🔵" },
                  { name: "Rainbow", icon: "🌈" },
                ].map((wallet) => (
                  <div 
                    key={wallet.name}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-muted/30"
                  >
                    <span className="text-xl">{wallet.icon}</span>
                    <span className="text-sm font-medium">{wallet.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
