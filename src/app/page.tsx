"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import {
  TrendingUp,
  Shield,
  Zap,
  BarChart3,
  Brain,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Wallet,
  LineChart,
  Bot,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Footer } from "@/components/layout"

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// Features data
const features = [
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Monitor your portfolio performance with live updates and comprehensive analytics.",
  },
  {
    icon: Brain,
    title: "AI Strategy Insights",
    description: "Get intelligent market analysis and strategy recommendations powered by advanced AI.",
  },
  {
    icon: Shield,
    title: "Non-Custodial",
    description: "Your keys, your crypto. We never hold your funds or private keys.",
  },
  {
    icon: Zap,
    title: "Fast Execution",
    description: "Lightning-fast trade execution across multiple chains and protocols.",
  },
  {
    icon: Lock,
    title: "Secure & Transparent",
    description: "Full transparency on all trades with detailed logs and execution history.",
  },
  {
    icon: LineChart,
    title: "Risk Management",
    description: "Configurable risk preferences with stop-loss and position sizing controls.",
  },
]

// Stats data
const stats = [
  { value: "$250M+", label: "Trading Volume" },
  { value: "15K+", label: "Active Users" },
  { value: "99.9%", label: "Uptime" },
  { value: "5+", label: "Chains Supported" },
]

export default function LandingPage() {
  const { isConnected } = useAccount()
  const router = useRouter()

  // Redirect to dashboard if connected
  useEffect(() => {
    if (isConnected) {
      router.push("/dashboard")
    }
  }, [isConnected, router])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full px-6 md:px-8 flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold shadow-lg shadow-emerald-500/25">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              Trader
            </span>
          </Link>
          <ConnectButton />
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          {/* Background gradient */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl opacity-30" />
          </div>

          <div className="w-full px-6 md:px-8">
            <div className="flex flex-col items-center text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-medium"
              >
                <Bot className="h-4 w-4" />
                AI-Powered Trading Assistance
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl"
              >
                Trade Smarter with{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                  AI-Driven
                </span>{" "}
                Insights
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-muted-foreground max-w-2xl"
              >
                Advanced automated trading assistance with real-time portfolio analytics, 
                AI strategy insights, and full transparency. Connect your wallet to get started.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <ConnectButton.Custom>
                  {({ openConnectModal }) => (
                    <Button
                      size="lg"
                      onClick={openConnectModal}
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 gap-2"
                    >
                      <Wallet className="h-5 w-5" />
                      Connect Wallet
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </ConnectButton.Custom>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#features">
                    Learn More
                  </Link>
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-32 bg-muted/30">
          <div className="w-full px-6 md:px-8">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center space-y-4 mb-16"
            >
              <motion.h2 
                variants={fadeInUp}
                className="text-3xl md:text-4xl font-bold"
              >
                Powerful Features for Smart Trading
              </motion.h2>
              <motion.p 
                variants={fadeInUp}
                className="text-muted-foreground max-w-2xl mx-auto"
              >
                Everything you need to manage your crypto portfolio with confidence and transparency.
              </motion.p>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {features.map((feature, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="h-full bg-card/50 backdrop-blur border-border/50 hover:border-emerald-500/30 transition-colors">
                    <CardContent className="p-6 space-y-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                        <feature.icon className="h-6 w-6 text-emerald-500" />
                      </div>
                      <h3 className="text-xl font-semibold">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center space-y-4 mb-16"
            >
              <motion.h2 
                variants={fadeInUp}
                className="text-3xl md:text-4xl font-bold"
              >
                How It Works
              </motion.h2>
              <motion.p 
                variants={fadeInUp}
                className="text-muted-foreground max-w-2xl mx-auto"
              >
                Get started in minutes with our simple and secure process.
              </motion.p>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                {
                  step: "01",
                  title: "Connect Wallet",
                  description: "Connect your wallet securely. We support MetaMask, WalletConnect, and more.",
                },
                {
                  step: "02",
                  title: "Configure Preferences",
                  description: "Set your risk level, position sizes, and notification preferences.",
                },
                {
                  step: "03",
                  title: "Monitor & Trade",
                  description: "View real-time analytics and let AI assist your trading decisions.",
                },
              ].map((item, index) => (
                <motion.div key={index} variants={fadeInUp} className="relative">
                  <div className="text-center space-y-4">
                    <div className="text-6xl font-bold text-emerald-500/20">{item.step}</div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-emerald-500/20" />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Safety & Disclaimers */}
        <section className="py-20 md:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="max-w-4xl mx-auto space-y-8"
            >
              <motion.div variants={fadeInUp} className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">Safety & Transparency</h2>
                <p className="text-muted-foreground">
                  We prioritize your security and provide full transparency in all operations.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-6 md:p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        "Non-custodial: We never hold your private keys",
                        "Full trade history and execution logs",
                        "Open-source smart contracts (coming soon)",
                        "No hidden fees or unexpected costs",
                        "Real-time slippage and gas estimation",
                        "24/7 system monitoring and alerts",
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Risk Disclaimer */}
              <motion.div variants={fadeInUp}>
                <Card className="bg-destructive/10 border-destructive/30">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex items-start gap-4">
                      <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-destructive">Important Risk Disclosure</h3>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <p>
                            <strong>AI execution is not guaranteed to be profitable. You may lose money.</strong>
                          </p>
                          <p>
                            Trading cryptocurrencies involves significant risk and can result in the loss of your invested capital. 
                            The high volatility of crypto markets means prices can move against you rapidly.
                          </p>
                          <p>
                            This platform provides automated execution assistance only. It is not financial advice, investment 
                            advisory, or asset management. You are solely responsible for your trading decisions.
                          </p>
                          <p>
                            Past performance is not indicative of future results. Only invest what you can afford to lose.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-emerald-500/20 border border-emerald-500/20 p-8 md:p-16 text-center"
            >
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-full blur-3xl opacity-50" />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Trading Smarter?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Connect your wallet now and experience the future of automated trading assistance.
              </p>
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <Button
                    size="lg"
                    onClick={openConnectModal}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 gap-2"
                  >
                    <Wallet className="h-5 w-5" />
                    Connect Wallet
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </ConnectButton.Custom>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
