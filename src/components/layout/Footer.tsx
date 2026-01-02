import Link from "next/link"
import { TrendingUp, Shield, AlertTriangle, ExternalLink } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="w-full px-6 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                MedZen
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Advanced automated trading assistance powered by AI strategies.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link href="/wallet" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Wallet
              </Link>
              <Link href="/settings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Settings
              </Link>
            </nav>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Resources</h4>
            <nav className="flex flex-col gap-2">
              <Link href="#" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Documentation
                <ExternalLink className="h-3 w-3" />
              </Link>
              <Link href="#" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                API Reference
                <ExternalLink className="h-3 w-3" />
              </Link>
              <Link href="#" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Support
                <ExternalLink className="h-3 w-3" />
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Legal</h4>
            <nav className="flex flex-col gap-2">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Risk Disclosure
              </Link>
            </nav>
          </div>
        </div>

        {/* Risk Warning */}
        <div className="mt-8 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-destructive">Risk Warning</p>
              <p className="text-xs text-muted-foreground">
                Trading cryptocurrencies involves significant risk and can result in the loss of your invested capital. 
                AI execution is not guaranteed to be profitable. You should carefully consider whether trading is appropriate 
                for you in light of your experience, objectives, financial resources, and other relevant circumstances. 
                Past performance is not indicative of future results.
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} MedZen Trading Bot. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Shield className="h-3 w-3" />
              <span>Non-custodial</span>
            </div>
            <div className="h-3 w-px bg-border" />
            <p className="text-xs text-muted-foreground">
              Powered by AI
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
