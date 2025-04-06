"use client"

import {useEffect, useRef, useState} from "react"
import {Badge} from "@/components/ui/badge"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Button} from "@/components/ui/button"
import {Skeleton} from "@/components/ui/skeleton"

import type {Log, LogType} from "@/types"
import {AlertCircle, Download, Pause, Play, RefreshCw, Wifi, WifiOff} from "lucide-react"
import {useToast} from "@/components/ui/use-toast";
import {LogItem} from "@/components/logs/log-items";
import {useAccountLogsHooks} from "@/services/logs/hooks";


interface RealtimeSessionLogProps {
    accountId: string
}

export default function RealtimeSessionLog({accountId}: Readonly<RealtimeSessionLogProps>) {
    const [logs, setLogs] = useState<Log[]>([])
    const [isConnected, setIsConnected] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [activeFilters, setActiveFilters] = useState<LogType[]>(["error", "swipe", "match"])
    const wsRef = useRef<WebSocket | null>(null)
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const { toast } = useToast()

    // Stats
    const errorCount = logs.filter((log) => log.type === "error").length
    const swipeCount = logs.filter((log) => log.type === "swipe").length
    const matchCount = logs.filter((log) => log.type === "match").length
    const totalCount = logs.length

    // Filtered logs
    const filteredLogs = logs.filter((log) => activeFilters.includes(log.type))

    // Connect to WebSocket
    const connectWebSocket = () => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            return
        }

        try {
            const wsUrl = `${process.env.NEXT_PUBLIC_URL}/ws/swipes/${accountId}/`
            wsRef.current = new WebSocket(wsUrl)

            wsRef.current.onopen = () => {
                setIsConnected(true)
                setError(null)
                toast({
                    title: "Connected",
                    description: "Real-time log updates are now active",
                })
            }

            wsRef.current.onmessage = (event) => {
                if (isPaused) return

                try {
                    const data = JSON.parse(event.data)

                    // Add the new log to the state
                    setLogs((prevLogs) => {
                        // Check if we already have this log (by id)
                        if (prevLogs.some((log) => log.id === data.id)) {
                            return prevLogs
                        }

                        // Add new log at the beginning
                        return [data, ...prevLogs]
                    })

                    // Scroll to top if we're already at the top
                    if (scrollAreaRef.current && scrollAreaRef.current.scrollTop < 10) {
                        setTimeout(() => {
                            if (scrollAreaRef.current) {
                                scrollAreaRef.current.scrollTop = 0
                            }
                        }, 100)
                    }
                } catch (e) {
                    console.error("Failed to parse WebSocket message:", e)
                }
            }

            wsRef.current.onclose = () => {
                setIsConnected(false)
            }

            wsRef.current.onerror = (e) => {
                setError("WebSocket connection error")
                setIsConnected(false)
                console.error("WebSocket error:", e)
                toast({
                    title: "Connection Error",
                    description: "Failed to connect to real-time updates",
                    variant: "destructive",
                })
            }
        } catch (e) {
            setError("Failed to establish WebSocket connection")
            setIsConnected(false)
            console.error("WebSocket connection error:", e)
        }
    }

    // Disconnect WebSocket
    const disconnectWebSocket = () => {
        if (wsRef.current) {
            wsRef.current.close()
            wsRef.current = null
            setIsConnected(false)
        }
    }

    // Toggle pause
    const togglePause = () => {
        setIsPaused(!isPaused)
    }

    // Fetch initial logs
   const { refetch: fetchLogs, isLoading } = useAccountLogsHooks(accountId);

   // Clear logs
   const handleClearLogs = () => {
       setLogs([])
   }

   // Refresh logs
   const handleRefreshLogs = () => {
       fetchLogs()
   }

    // Toggle filter
    const toggleFilter = (type: LogType) => {
        if (activeFilters.includes(type)) {
            setActiveFilters(activeFilters.filter((t) => t !== type))
        } else {
            setActiveFilters([...activeFilters, type])
        }
    }

    // Export logs
    const handleExportLogs = () => {
        const exportData = JSON.stringify(logs, null, 2)
        const blob = new Blob([exportData], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `swipe-session-logs-${accountId}-${new Date().toISOString().split("T")[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    // Connect WebSocket and fetch logs on mount
    useEffect(() => {
        fetchLogs()
        connectWebSocket()

        // Cleanup on unmount
        return () => {
            disconnectWebSocket()
        }
    }, [accountId])

    return (
        <Card className="w-full border-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-xl font-bold">Live Session Log</CardTitle>
                    <Badge
                        variant="outline"
                        className={`${isConnected ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}
                    >
                        {isConnected ? (
                            <div className="flex items-center gap-1">
                                <Wifi className="size-3" />
                                <span>Connected</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1">
                                <WifiOff className="size-3" />
                                <span>Disconnected</span>
                            </div>
                        )}
                    </Badge>
                    {isPaused && (
                        <Badge variant="outline" className="bg-yellow-900/30 text-yellow-400">
                            Paused
                        </Badge>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className={`h-8 gap-1 text-xs ${isPaused ? "bg-green-900/30 text-green-400" : "bg-yellow-900/30 text-yellow-400"}`}
                        onClick={togglePause}
                    >
                        {isPaused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
                        {isPaused ? "Resume" : "Pause"}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1 bg-zinc-800 text-xs text-zinc-200 hover:bg-zinc-700"
                        onClick={isConnected ? disconnectWebSocket : connectWebSocket}
                    >
                        {isConnected ? <WifiOff className="size-3.5" /> : <Wifi className="size-3.5" />}
                        {isConnected ? "Disconnect" : "Connect"}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1 bg-zinc-800 text-xs text-zinc-200 hover:bg-zinc-700"
                        onClick={handleRefreshLogs}
                    >
                        <RefreshCw className="size-3.5" />
                        Refresh
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1 bg-zinc-800 text-xs text-zinc-200 hover:bg-zinc-700"
                        onClick={handleExportLogs}
                    >
                        <Download className="size-3.5" />
                        Export
                    </Button>
                    <Button variant="destructive" size="sm" className="h-8 text-xs" onClick={handleClearLogs}>
                        Clear
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex gap-2">
                        <Badge
                            variant="outline"
                            className={`cursor-pointer bg-zinc-800 text-zinc-200 ${activeFilters.includes("error") ? "opacity-100" : "opacity-50"}`}
                            onClick={() => toggleFilter("error")}
                        >
                            Errors: {errorCount}
                        </Badge>
                        <Badge
                            variant="outline"
                            className={`cursor-pointer bg-zinc-800 text-zinc-200 ${activeFilters.includes("swipe") ? "opacity-100" : "opacity-50"}`}
                            onClick={() => toggleFilter("swipe")}
                        >
                            Swipes: {swipeCount}
                        </Badge>
                        <Badge
                            variant="outline"
                            className={`cursor-pointer bg-zinc-800 text-zinc-200 ${activeFilters.includes("match") ? "opacity-100" : "opacity-50"}`}
                            onClick={() => toggleFilter("match")}
                        >
                            Matches: {matchCount}
                        </Badge>
                    </div>
                    <Badge variant="outline" className="bg-zinc-800 text-zinc-200">
                        Total: {totalCount}
                    </Badge>
                </div>

                {error && (
                    <div className="mb-4 rounded-md border border-red-800 bg-red-900/20 p-3 text-red-400">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="size-4" />
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                <ScrollArea className="h-[400px] rounded-md border border-zinc-800" ref={scrollAreaRef}>
                    <div className="space-y-3 p-4">
                        {isLoading ? (
                            Array(5)
                                .fill(0)
                                .map((_, i) => (
                                    <div key={i} className="rounded-md border border-zinc-800 bg-zinc-800/20 p-3">
                                        <div className="flex items-start gap-2">
                                            <Skeleton className="size-4 rounded-full bg-zinc-700" />
                                            <div className="flex-1">
                                                <div className="mb-2 flex items-center gap-2">
                                                    <Skeleton className="h-4 w-16 rounded bg-zinc-700" />
                                                    <Skeleton className="h-4 w-24 rounded bg-zinc-700" />
                                                </div>
                                                <Skeleton className="h-4 w-full rounded bg-zinc-700" />
                                            </div>
                                        </div>
                                    </div>
                                ))
                        ) : filteredLogs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-zinc-500">
                                <p>No logs to display</p>
                            </div>
                        ) : (
                            filteredLogs.map((log) => <LogItem key={log.id} log={log} />)
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="pt-2 text-xs text-zinc-500">
                <div className="flex w-full justify-between">
                    <div>Account ID: {accountId}</div>
                    <div>Last updated: {new Date().toLocaleTimeString()}</div>
                </div>
            </CardFooter>
        </Card>
    )
}

