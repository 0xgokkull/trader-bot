import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Format currency with proper locale
export function formatCurrency(value: number, currency = "USD"): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value)
}

// Format percentage
export function formatPercentage(value: number): string {
    const sign = value >= 0 ? "+" : ""
    return `${sign}${value.toFixed(2)}%`
}

// Truncate wallet address
export function truncateAddress(address: string, chars = 4): string {
    if (!address) return ""
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

// Format large numbers with abbreviations
export function formatCompactNumber(value: number): string {
    if (value >= 1_000_000_000) {
        return `${(value / 1_000_000_000).toFixed(2)}B`
    }
    if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(2)}M`
    }
    if (value >= 1_000) {
        return `${(value / 1_000).toFixed(2)}K`
    }
    return value.toFixed(2)
}

// Format timestamp to relative time
export function formatRelativeTime(date: Date | string): string {
    const now = new Date()
    const then = new Date(date)
    const diffMs = now.getTime() - then.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffSecs < 60) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return then.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    })
}
