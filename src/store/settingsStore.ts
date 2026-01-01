import { create } from "zustand"
import { persist } from "zustand/middleware"

// Risk level type (1-10)
export type RiskLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

// Settings state
interface SettingsState {
    // Risk preferences
    riskLevel: RiskLevel
    stopLossEnabled: boolean
    stopLossPercentage: number
    stablecoinTarget: number
    maxOpenPositions: number

    // Notifications
    tradeNotifications: boolean
    signalNotifications: boolean
    profitAlerts: boolean

    // UI preferences
    darkMode: boolean

    // Legal
    riskAcknowledged: boolean

    // Actions
    setRiskLevel: (level: RiskLevel) => void
    setStopLoss: (enabled: boolean, percentage?: number) => void
    setStablecoinTarget: (target: number) => void
    setMaxPositions: (max: number) => void
    toggleNotification: (key: "trade" | "signal" | "profit") => void
    toggleDarkMode: () => void
    acknowledgeRisk: () => void
    resetSettings: () => void
}

const defaultSettings = {
    riskLevel: 5 as RiskLevel,
    stopLossEnabled: true,
    stopLossPercentage: 10,
    stablecoinTarget: 20,
    maxOpenPositions: 5,
    tradeNotifications: true,
    signalNotifications: true,
    profitAlerts: true,
    darkMode: true,
    riskAcknowledged: false,
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            ...defaultSettings,

            setRiskLevel: (level) => set({ riskLevel: level }),

            setStopLoss: (enabled, percentage) =>
                set((state) => ({
                    stopLossEnabled: enabled,
                    stopLossPercentage: percentage ?? state.stopLossPercentage,
                })),

            setStablecoinTarget: (target) => set({ stablecoinTarget: target }),

            setMaxPositions: (max) => set({ maxOpenPositions: max }),

            toggleNotification: (key) =>
                set((state) => {
                    switch (key) {
                        case "trade":
                            return { tradeNotifications: !state.tradeNotifications }
                        case "signal":
                            return { signalNotifications: !state.signalNotifications }
                        case "profit":
                            return { profitAlerts: !state.profitAlerts }
                        default:
                            return state
                    }
                }),

            toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

            acknowledgeRisk: () => set({ riskAcknowledged: true }),

            resetSettings: () => set(defaultSettings),
        }),
        {
            name: "medzen-settings",
        }
    )
)
