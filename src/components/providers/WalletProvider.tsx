"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit"
import { WagmiProvider } from "wagmi"
import { config } from "@/lib/wagmi"
import { useSettingsStore } from "@/store"

import "@rainbow-me/rainbowkit/styles.css"

const queryClient = new QueryClient()

interface WalletProviderProps {
  children: React.ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  const darkMode = useSettingsStore((state) => state.darkMode)

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkMode ? darkTheme({
            accentColor: "#10b981",
            accentColorForeground: "white",
            borderRadius: "medium",
            fontStack: "system",
          }) : lightTheme({
            accentColor: "#10b981",
            accentColorForeground: "white",
            borderRadius: "medium",
            fontStack: "system",
          })}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
