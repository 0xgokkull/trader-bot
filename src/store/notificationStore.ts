import { create } from "zustand"

// Notification type
export interface Notification {
    id: string
    type: "trade" | "signal" | "profit" | "stop" | "info" | "warning"
    title: string
    message: string
    timestamp: Date
    isRead: boolean
    metadata?: {
        asset?: string
        amount?: number
        price?: number
        action?: "buy" | "sell" | "bridge"
    }
}

// Notification state
interface NotificationState {
    notifications: Notification[]
    unreadCount: number

    // Actions
    addNotification: (notification: Omit<Notification, "id" | "timestamp" | "isRead">) => void
    markAsRead: (id: string) => void
    markAllAsRead: () => void
    removeNotification: (id: string) => void
    clearAll: () => void
}

// Generate unique ID
const generateId = () => Math.random().toString(36).substr(2, 9)

// Mock initial notifications
const mockNotifications: Notification[] = [
    {
        id: "1",
        type: "trade",
        title: "Trade Executed",
        message: "Bought 0.05 BTC at $43,500",
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
        isRead: false,
        metadata: { asset: "BTC", amount: 0.05, price: 43500, action: "buy" },
    },
    {
        id: "2",
        type: "signal",
        title: "AI Signal Detected",
        message: "Bullish divergence on ETH/USDC",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        isRead: false,
    },
    {
        id: "3",
        type: "profit",
        title: "Profit Taken",
        message: "Sold 0.1 ETH for +$42.50 profit",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        isRead: true,
        metadata: { asset: "ETH", amount: 0.1, action: "sell" },
    },
    {
        id: "4",
        type: "stop",
        title: "Stop-Loss Triggered",
        message: "LINK position closed at $14.80",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        isRead: true,
        metadata: { asset: "LINK", price: 14.80, action: "sell" },
    },
]

export const useNotificationStore = create<NotificationState>()((set, get) => ({
    notifications: mockNotifications,
    unreadCount: mockNotifications.filter((n) => !n.isRead).length,

    addNotification: (notification) => {
        const newNotification: Notification = {
            ...notification,
            id: generateId(),
            timestamp: new Date(),
            isRead: false,
        }
        set((state) => ({
            notifications: [newNotification, ...state.notifications],
            unreadCount: state.unreadCount + 1,
        }))
    },

    markAsRead: (id) =>
        set((state) => {
            const notifications = state.notifications.map((n) =>
                n.id === id ? { ...n, isRead: true } : n
            )
            return {
                notifications,
                unreadCount: notifications.filter((n) => !n.isRead).length,
            }
        }),

    markAllAsRead: () =>
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
            unreadCount: 0,
        })),

    removeNotification: (id) =>
        set((state) => {
            const notification = state.notifications.find((n) => n.id === id)
            return {
                notifications: state.notifications.filter((n) => n.id !== id),
                unreadCount: notification && !notification.isRead
                    ? state.unreadCount - 1
                    : state.unreadCount,
            }
        }),

    clearAll: () => set({ notifications: [], unreadCount: 0 }),
}))
