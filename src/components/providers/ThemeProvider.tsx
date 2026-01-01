"use client"

import { useEffect } from "react"
import { useSettingsStore } from "@/store"

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const darkMode = useSettingsStore((state) => state.darkMode)

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  return <>{children}</>
}
