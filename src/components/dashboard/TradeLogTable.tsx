"use client"

import { useState } from "react"
import { useTradeHistoryStore, TradeEntry } from "@/store"
import { formatRelativeTime, formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Filter,
  MoreHorizontal
} from "lucide-react"

export function TradeLogTable() {
  const { trades, page, pageSize, totalTrades, setPage } = useTradeHistoryStore()
  const [filter, setFilter] = useState<"all" | "buy" | "sell" | "bridge">("all")

  const filteredTrades = filter === "all" 
    ? trades 
    : trades.filter((t) => t.action === filter)

  const totalPages = Math.ceil(filteredTrades.length / pageSize)
  const paginatedTrades = filteredTrades.slice((page - 1) * pageSize, page * pageSize)

  const getActionIcon = (action: TradeEntry["action"]) => {
    switch (action) {
      case "buy":
        return <ArrowDownRight className="h-4 w-4 text-emerald-500" />
      case "sell":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />
      case "bridge":
        return <ArrowLeftRight className="h-4 w-4 text-blue-500" />
    }
  }

  const getActionBadge = (action: TradeEntry["action"]) => {
    switch (action) {
      case "buy":
        return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">Buy</Badge>
      case "sell":
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">Sell</Badge>
      case "bridge":
        return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">Bridge</Badge>
    }
  }

  const getStatusBadge = (status: TradeEntry["status"]) => {
    switch (status) {
      case "completed":
        return <Badge variant="outline" className="text-emerald-500 border-emerald-500/30">Completed</Badge>
      case "pending":
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500/30">Pending</Badge>
      case "failed":
        return <Badge variant="outline" className="text-red-500 border-red-500/30">Failed</Badge>
    }
  }

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Trade History</CardTitle>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                {filter === "all" ? "All" : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter("all")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("buy")}>Buy</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("sell")}>Sell</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("bridge")}>Bridge</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="text-xs font-medium">Time</TableHead>
                <TableHead className="text-xs font-medium">Action</TableHead>
                <TableHead className="text-xs font-medium">Asset</TableHead>
                <TableHead className="text-xs font-medium text-right">Amount</TableHead>
                <TableHead className="text-xs font-medium text-right">Price</TableHead>
                <TableHead className="text-xs font-medium text-right">Total</TableHead>
                <TableHead className="text-xs font-medium">Status</TableHead>
                <TableHead className="text-xs font-medium w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTrades.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No trades found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTrades.map((trade) => (
                  <TableRow key={trade.id} className="hover:bg-muted/20">
                    <TableCell className="text-sm text-muted-foreground">
                      {formatRelativeTime(trade.timestamp)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getActionIcon(trade.action)}
                        {getActionBadge(trade.action)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{trade.asset}</TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {trade.amount.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {formatCurrency(trade.price)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-medium">
                      {formatCurrency(trade.total)}
                    </TableCell>
                    <TableCell>{getStatusBadge(trade.status)}</TableCell>
                    <TableCell>
                      {trade.txHash && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <a 
                            href={`https://etherscan.io/tx/${trade.txHash}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </a>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-muted-foreground">
              Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredTrades.length)} of {filteredTrades.length}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
