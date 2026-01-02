"use client"

import { useNotificationStore, Notification } from "@/store"
import { formatRelativeTime } from "@/lib/utils"
import { Header, Footer } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Bell, 
  BellOff,
  Check,
  CheckCheck,
  Trash2,
  TrendingUp,
  TrendingDown,
  Zap,
  AlertTriangle,
  Info,
  X
} from "lucide-react"

export default function NotificationsPage() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification,
    clearAll 
  } = useNotificationStore()

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "trade":
        return <TrendingUp className="h-5 w-5 text-emerald-500" />
      case "signal":
        return <Zap className="h-5 w-5 text-blue-500" />
      case "profit":
        return <TrendingUp className="h-5 w-5 text-emerald-500" />
      case "stop":
        return <TrendingDown className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return <Info className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getNotificationBg = (type: Notification["type"]) => {
    switch (type) {
      case "trade":
        return "from-emerald-500/20 to-teal-500/20"
      case "signal":
        return "from-blue-500/20 to-indigo-500/20"
      case "profit":
        return "from-emerald-500/20 to-lime-500/20"
      case "stop":
        return "from-red-500/20 to-orange-500/20"
      case "warning":
        return "from-yellow-500/20 to-orange-500/20"
      default:
        return "from-gray-500/20 to-slate-500/20"
    }
  }

  const getTypeBadge = (type: Notification["type"]) => {
    switch (type) {
      case "trade":
        return <Badge className="bg-emerald-500/10 text-emerald-500">Trade</Badge>
      case "signal":
        return <Badge className="bg-blue-500/10 text-blue-500">Signal</Badge>
      case "profit":
        return <Badge className="bg-emerald-500/10 text-emerald-500">Profit</Badge>
      case "stop":
        return <Badge className="bg-red-500/10 text-red-500">Stop</Badge>
      case "warning":
        return <Badge className="bg-yellow-500/10 text-yellow-500">Warning</Badge>
      default:
        return <Badge variant="outline">Info</Badge>
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 w-full px-6 md:px-8 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <Badge className="bg-primary text-primary-foreground">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead} className="gap-2">
                  <CheckCheck className="h-4 w-4" />
                  Mark all read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearAll} className="gap-2 text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                  Clear all
                </Button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="py-16">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                    <BellOff className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">No Notifications</h3>
                    <p className="text-muted-foreground">
                      You&apos;re all caught up! New notifications will appear here.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`bg-card/50 backdrop-blur border-border/50 transition-all ${
                    !notification.isRead ? "ring-1 ring-primary/30 bg-primary/5" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${getNotificationBg(notification.type)} flex-shrink-0`}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{notification.title}</h4>
                              {getTypeBadge(notification.type)}
                              {!notification.isRead && (
                                <span className="w-2 h-2 rounded-full bg-primary" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {notification.message}
                            </p>
                            
                            {/* Metadata */}
                            {notification.metadata && (
                              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                {notification.metadata.asset && (
                                  <span className="font-mono bg-muted px-2 py-0.5 rounded">
                                    {notification.metadata.asset}
                                  </span>
                                )}
                                {notification.metadata.amount && (
                                  <span>Amount: {notification.metadata.amount}</span>
                                )}
                                {notification.metadata.price && (
                                  <span>Price: ${notification.metadata.price.toLocaleString()}</span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <span className="text-xs text-muted-foreground">
                              {formatRelativeTime(notification.timestamp)}
                            </span>
                            {!notification.isRead && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => removeNotification(notification.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Notification Tips */}
          <Card className="bg-muted/30 border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notification Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <span className="text-muted-foreground">Trade Executed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-500" />
                  <span className="text-muted-foreground">AI Signal</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-muted-foreground">Stop Triggered</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-muted-foreground">Warning</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
