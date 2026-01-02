import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { RootLayoutClient } from "./layout-client"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Trader | AI-Powered Crypto Trading",
  description: "Advanced automated trading assistance powered by AI strategies. Portfolio analytics, real-time insights, and transparent execution.",
  keywords: ["crypto trading", "AI trading", "portfolio analytics", "DeFi", "automated trading"],
  authors: [{ name: "Trader" }],
  openGraph: {
    title: "Trader",
    description: "AI-Powered Crypto Trading Assistance",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  )
}
