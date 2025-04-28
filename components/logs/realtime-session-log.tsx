"use client"

import {useEffect, useRef, useState} from "react"
import {Badge} from "@/components/ui/badge"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Button} from "@/components/ui/button"
import {Skeleton} from "@/components/ui/skeleton"
import {AlertCircle, Download, Pause, Play, RefreshCw, Wifi, WifiOff} from "lucide-react"
import {useToast} from "@/components/ui/use-toast"
import {LogItem} from "@/components/logs/log-items"
import type {ErrorLog, Log, LogType, MatchLog, SwipeLog} from "@/types"
import {useAccountLogsHooks} from "@/services/logs/hooks"

interface RealtimeSessionLogProps {
  accountId: string
}

// Helper function to process logs outside of component
function processLogsData(logsData: any): Log[] {
  if (!logsData) return [];
  const logs: Log[] = [];

  if (logsData.swipes && Array.isArray(logsData.swipes)) {
    logsData.swipes.forEach((swipe: any) => {
      const swipeLog: SwipeLog = {
        id: swipe.id,
        type: "swipe",
        account: swipe.account,
        session: swipe.session,
        swipe_direction: swipe.swipe_direction,
        target_user_id: swipe.target_user_id,
        target_name: swipe.target_name,
        success: swipe.success,
        response_data: swipe.response_data,
        created_at: new Date(swipe.created_at),
      };
      logs.push(swipeLog);
    });
  }

  if (logsData.matches && Array.isArray(logsData.matches)) {
    logsData.matches.forEach((match: any) => {
      const matchLog: MatchLog = {
        id: match.id,
        type: "match",
        account: match.account,
        session: match.session,
        match_id: match.match_id,
        target_name: match.target_name,
        target_bio: match.target_bio,
        target_photos: match.target_photos,
        created_at: new Date(match.created_at),
      };
      logs.push(matchLog);
    });
  }

  if (logsData.errors && Array.isArray(logsData.errors)) {
    logsData.errors.forEach((err: any) => {
      const errorLog: ErrorLog = {
        id: err.id,
        type: "error",
        account: err.account,
        session: err.session,
        error_type: err.error_type,
        error_message: err.error_message,
        stack_trace: err.stack_trace,
        created_at: new Date(err.created_at),
      };
      logs.push(errorLog);
    });
  }

  return logs;
}

// Helper function to process a single log entry from WebSocket
function processWebSocketLog(data: any): Log | null {
  try {
    // Check if this is a grouped format (API format)
    if (data.swipes || data.matches || data.errors) {
      console.log("Received grouped log format from WebSocket, processing...")
      return null // We'll process this in bulk elsewhere
    }

    // Determine the log type based on properties
    if (data.swipe_direction !== undefined) {
      // This is a swipe log
      return {
        id: data.id,
        type: "swipe",
        account: data.account,
        session: data.session,
        swipe_direction: data.swipe_direction,
        target_user_id: data.target_user_id,
        target_name: data.target_name,
        success: data.success,
        response_data: data.response_data,
        created_at: new Date(data.created_at),
      } as SwipeLog
    } else if (data.match_id !== undefined) {
      // This is a match log
      return {
        id: data.id,
        type: "match",
        account: data.account,
        session: data.session,
        match_id: data.match_id,
        target_name: data.target_name,
        target_bio: data.target_bio,
        target_photos: data.target_photos,
        created_at: new Date(data.created_at),
      } as MatchLog
    } else if (data.error_type !== undefined) {
      // This is an error log
      return {
        id: data.id,
        type: "error",
        account: data.account,
        session: data.session,
        error_type: data.error_type,
        error_message: data.error_message,
        stack_trace: data.stack_trace,
        created_at: new Date(data.created_at),
      } as ErrorLog
    }

    console.warn("Unknown log format:", data)
    return null
  } catch (e) {
    console.error("Error processing WebSocket log:", e)
    return null
  }
}

export default function RealtimeSessionLog({accountId}: Readonly<RealtimeSessionLogProps>) {
  const [logs, setLogs] = useState<Log[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeFilters, setActiveFilters] = useState<LogType[]>(["error", "swipe", "match"])
  const wsRef = useRef<WebSocket | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const {toast} = useToast()

  // Fetch logs using the custom hook
  const {data: apiLogs, refetch: fetchLogs, isLoading} = useAccountLogsHooks(accountId)

  // Update logs state when API data changes
  useEffect(() => {
    if (apiLogs) {
      console.log("API logs received:", apiLogs)
      const processedLogs = processLogsData(apiLogs)
      console.log("Processed logs:", processedLogs.length)
      setLogs(processedLogs)
    }
  }, [apiLogs])

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
      const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/ws/swipes/${accountId}/`
      console.log("Connecting to WebSocket:", wsUrl)

      wsRef.current = new WebSocket(wsUrl)

      wsRef.current.onopen = () => {
        console.log("WebSocket connected")
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
          console.log("WebSocket message received:", event.data)
          const data = JSON.parse(event.data)

          // Check if this is a grouped format (like API response)
          if (data.swipes || data.matches || data.errors) {
            // Process as grouped data
            const newLogs = processLogsData(data)
            if (newLogs.length > 0) {
              setLogs((prevLogs) => {
                // Filter out duplicates
                const existingIds = new Set(prevLogs.map((log) => log.id))
                const uniqueNewLogs = newLogs.filter((log) => !existingIds.has(log.id))

                // Add new logs at the beginning
                return [...uniqueNewLogs, ...prevLogs]
              })
            }
          } else {
            // Process as a single log entry
            const logEntry = processWebSocketLog(data)

            if (logEntry) {
              setLogs((prevLogs) => {
                // Check if we already have this log
                if (prevLogs.some((log) => log.id === logEntry.id)) {
                  return prevLogs
                }

                // Add new log at the beginning
                return [logEntry, ...prevLogs]
              })
            }
          }

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

      wsRef.current.onclose = (event) => {
        console.log("WebSocket closed:", event)
        setIsConnected(false)
      }

      wsRef.current.onerror = (e) => {
        console.error("WebSocket error:", e)
        setError("WebSocket connection error")
        setIsConnected(false)
        toast({
          title: "Connection Error",
          description: "Failed to connect to real-time updates",
          variant: "destructive",
        })
      }
    } catch (e) {
      console.error("WebSocket connection error:", e)
      setError("Failed to establish WebSocket connection")
      setIsConnected(false)
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

  // Clear logs
  const handleClearLogs = () => {
    setLogs([])
  }

  // Refresh logs
  const handleRefreshLogs = () => {
    console.log("Refreshing logs...")
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
    const blob = new Blob([exportData], {type: "application/json"})
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
    if (accountId) {
      console.log("Component mounted with accountId:", accountId)
      connectWebSocket()
    }

    // Cleanup on unmount
    return () => {
      disconnectWebSocket()
    }
  }, [accountId])

  return (
    <Card className="w-full border-none shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl font-bold">Live Session Log</CardTitle>
          <Badge
            variant="outline"
            className={`${isConnected ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}
          >
            {isConnected ? (
              <div className="flex items-center gap-1">
                <Wifi className="size-3"/>
                <span>Connected</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <WifiOff className="size-3"/>
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
            className={`h-8 gap-1 text-xs ${
              isPaused ? "bg-green-900/30 text-green-400" : "bg-yellow-900/30 text-yellow-400"
            }`}
            onClick={togglePause}
          >
            {isPaused ? <Play className="size-3.5"/> : <Pause className="size-3.5"/>}
            {isPaused ? "Resume" : "Pause"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 text-xs"
            onClick={isConnected ? disconnectWebSocket : connectWebSocket}
          >
            {isConnected ? <WifiOff className="size-3.5"/> : <Wifi className="size-3.5"/>}
            {isConnected ? "Disconnect" : "Connect"}
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1 text-xs" onClick={handleRefreshLogs}>
            <RefreshCw className="size-3.5"/>
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1 text-xs" onClick={handleExportLogs}>
            <Download className="size-3.5"/>
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
              className={`cursor-pointer ${activeFilters.includes("error") ? "opacity-100" : "opacity-50"}`}
              onClick={() => toggleFilter("error")}
            >
              Errors: {errorCount}
            </Badge>
            <Badge
              variant="outline"
              className={`cursor-pointer ${activeFilters.includes("swipe") ? "opacity-100" : "opacity-50"}`}
              onClick={() => toggleFilter("swipe")}
            >
              Swipes: {swipeCount}
            </Badge>
            <Badge
              variant="outline"
              className={`cursor-pointer ${activeFilters.includes("match") ? "opacity-100" : "opacity-50"}`}
              onClick={() => toggleFilter("match")}
            >
              Matches: {matchCount}
            </Badge>
          </div>
          <Badge variant="outline">Total: {totalCount}</Badge>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-800 bg-red-900/20 p-3 text-red-400">
            <div className="flex items-center gap-2">
              <AlertCircle className="size-4"/>
              <span>{error}</span>
            </div>
          </div>
        )}

        <ScrollArea className="h-[400px] rounded-md border" ref={scrollAreaRef}>
          <div className="space-y-3 p-4">
            {isLoading ? (
              Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="rounded-md border p-3">
                    <div className="flex items-start gap-2">
                      <Skeleton className="size-4 rounded-full"/>
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <Skeleton className="h-4 w-16 rounded"/>
                          <Skeleton className="h-4 w-24 rounded"/>
                        </div>
                        <Skeleton className="h-4 w-full rounded"/>
                      </div>
                    </div>
                  </div>
                ))
            ) : filteredLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <p>No logs to display</p>
              </div>
            ) : (
              filteredLogs.map((log) => <LogItem key={log.id} log={log}/>)
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-2 text-xs text-muted-foreground">
        <div className="flex w-full justify-between">
          <div>Account ID: {accountId}</div>
          <div>Last updated: {new Date().toLocaleTimeString()}</div>
        </div>
      </CardFooter>
    </Card>
  )
}
