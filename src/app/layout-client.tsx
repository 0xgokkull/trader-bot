"use client"

import { WalletProvider, ThemeProvider } from "@/components/providers"
import { Toaster } from "@/components/ui/sonner"

interface RootLayoutClientProps {
  children: React.ReactNode
}

export function RootLayoutClient({ children }: RootLayoutClientProps) {
  return (
    <ThemeProvider>
      <WalletProvider>
        {children}
        <Toaster position="top-right" richColors />
      </WalletProvider>
    </ThemeProvider>
  )
}
