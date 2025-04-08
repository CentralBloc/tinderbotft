"use client"

import {useEffect, useRef, useState} from "react"
import {Badge} from "@/components/ui/badge"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {ScrollArea} from "@/components/ui/scroll-area"
import {AlertCircle, Download, RefreshCw} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Skeleton} from "@/components/ui/skeleton"

import {LogFilter} from "./log-filter"
import type {ErrorLog, Log, LogType, MatchLog, SwipeLog} from "@/types"
import {LogItem} from "./log-items"

interface SessionLogsProps {
    logsData: { swipes: string[]; matches: string[]; errors: string[] }
    refetch: () => void
    isLoading: boolean
    isError: boolean
    sessionId: string
    session: number
    strategy: string
}

// Helper function to process logs outside of component
function processLogsData(logsData: any): Log[] {
    if (!logsData) return []
    const logs: Log[] = []

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
            }
            logs.push(swipeLog)
        })
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
            }
            logs.push(matchLog)
        })
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
            }
            logs.push(errorLog)
        })
    }

    return logs
}

export default function LogConsole({
                                       logsData,
                                       refetch,
                                       sessionId,
                                       isLoading,
                                       isError,
                                       session,
                                       strategy,
                                   }: Readonly<SessionLogsProps>) {
    const [activeTab, setActiveTab] = useState<string>("all")
    const [activeFilters, setActiveFilters] = useState<LogType[]>(["error", "swipe", "match"])
    const [selectedSession, setSelectedSession] = useState<string | null>(null)
    const [timeRange, setTimeRange] = useState<string>("all")
    const [processedLogs, setProcessedLogs] = useState<Log[]>([])
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const dataProcessedRef = useRef<string | null>(null)

    // Process the logs data into the format expected by the component
    useEffect(() => {
        // Skip processing if data is not available yet
        if (!logsData) {
            console.log("No logs data available yet")
            return
        }

        console.log("Processing logs data:", logsData)

        // Reset logs to avoid showing stale data
        setProcessedLogs([])

        const logs = processLogsData(logsData)
        console.log("Processed logs:", logs)

        setProcessedLogs(logs)

        // Store the stringified data to avoid reprocessing the same data
        dataProcessedRef.current = JSON.stringify(logsData)
    }, [logsData])

    // Fetch logs when component mounts
    useEffect(() => {
        console.log("LogConsole mounted, fetching logs...")
        refetch()
    }, [refetch])

    // Apply all filters
    const filteredLogs = processedLogs.filter((log) => {
        // Filter by type
        const typeMatch = activeTab === "all" ? activeFilters.includes(log.type) : log.type === activeTab

        // Filter by session if selected
        const sessionMatch = selectedSession ? log.session === selectedSession : true

        // Filter by time range
        let timeMatch = true
        const now = new Date()
        if (timeRange === "today") {
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
            timeMatch = new Date(log.created_at) >= today
        } else if (timeRange === "hour") {
            const hourAgo = new Date(now.getTime() - 60 * 60 * 1000)
            timeMatch = new Date(log.created_at) >= hourAgo
        }

        return typeMatch && sessionMatch && timeMatch
    })

    // Sort logs by creation date (newest first)
    const sortedLogs = [...filteredLogs].sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    const errorCount = processedLogs.filter((log) => log.type === "error").length
    const swipeCount = processedLogs.filter((log) => log.type === "swipe").length
    const matchCount = processedLogs.filter((log) => log.type === "match").length

    const handleFilterChange = (type: LogType) => {
        if (activeFilters.includes(type)) {
            setActiveFilters(activeFilters.filter((t) => t !== type))
        } else {
            setActiveFilters([...activeFilters, type])
        }
    }

    const handleRefreshLogs = () => {
        console.log("Refreshing logs...")
        // Reset the data processed flag to force reprocessing
        dataProcessedRef.current = null
        refetch()
    }

    const handleClearLogs = () => {
        // Since we can't actually clear the data from the API,
        // we could implement a local filter to hide all logs temporarily
        setProcessedLogs([])
    }

    const handleExportLogs = () => {
        const exportData = JSON.stringify(sortedLogs, null, 2)
        const blob = new Blob([exportData], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `session-logs-${sessionId}-${new Date().toISOString().split("T")[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    return (
        <Card className="w-full border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">Swipes Log Console</CardTitle>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1 text-xs"
                        onClick={handleRefreshLogs}
                        disabled={isLoading}
                    >
                        <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1 text-xs"
                        onClick={handleExportLogs}
                        disabled={sortedLogs.length === 0}
                    >
                        <Download className="size-3.5" />
                        Export
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={handleClearLogs}
                        disabled={processedLogs.length === 0}
                    >
                        Clear
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                    <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <TabsList>
                            <TabsTrigger value="all">
                                All
                                <Badge variant="outline" className="ml-2">
                                    {filteredLogs.length}
                                </Badge>
                            </TabsTrigger>
                            <TabsTrigger value="error" className="data-[state=active]:bg-red-900/50 data-[state=active]:text-red-50">
                                Errors
                                <Badge variant="outline" className="ml-2 bg-red-900/50 text-red-200">
                                    {errorCount}
                                </Badge>
                            </TabsTrigger>
                            <TabsTrigger
                                value="swipe"
                                className="data-[state=active]:bg-blue-900/50 data-[state=active]:text-blue-50"
                            >
                                Swipes
                                <Badge variant="outline" className="ml-2 bg-blue-900/50 text-blue-200">
                                    {swipeCount}
                                </Badge>
                            </TabsTrigger>
                            <TabsTrigger
                                value="match"
                                className="data-[state=active]:bg-green-900/50 data-[state=active]:text-green-50"
                            >
                                Matches
                                <Badge variant="outline" className="ml-2 bg-green-900/50 text-green-200">
                                    {matchCount}
                                </Badge>
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex flex-wrap gap-2">
                            {activeTab === "all" && <LogFilter activeFilters={activeFilters} onFilterChange={handleFilterChange} />}
                        </div>
                    </div>

                    {isError && (
                        <div className="mb-4 rounded-md border border-red-800 bg-red-900/20 p-3 text-red-400">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="size-4" />
                                <span>{"Failed to load logs"}</span>
                            </div>
                        </div>
                    )}

                    {/*{!isLoading && !isError && logsData && Object.keys(logsData).length > 0 && processedLogs.length === 0 && (*/}
                    {/*    <div className="mb-4 rounded-md border border-yellow-800 bg-yellow-900/20 p-3 text-yellow-400">*/}
                    {/*        <div className="flex items-center gap-2">*/}
                    {/*            <AlertCircle className="size-4" />*/}
                    {/*            <span>Data received but no logs could be processed. Check data format.</span>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*)}*/}

                    <TabsContent value="all" className="m-0">
                        <LogList logs={sortedLogs} isLoading={isLoading} />
                    </TabsContent>
                    <TabsContent value="error" className="m-0">
                        <LogList logs={sortedLogs.filter((log) => log.type === "error")} isLoading={isLoading} />
                    </TabsContent>
                    <TabsContent value="swipe" className="m-0">
                        <LogList logs={sortedLogs.filter((log) => log.type === "swipe")} isLoading={isLoading} />
                    </TabsContent>
                    <TabsContent value="match" className="m-0">
                        <LogList logs={sortedLogs.filter((log) => log.type === "match")} isLoading={isLoading} />
                    </TabsContent>
                </Tabs>
            </CardContent>
            <CardFooter className="pt-2 text-xs text-muted-foreground">
                <div className="flex w-full justify-between">
                    <div>Session Progress: {session}</div>
                    <div>Strategy: {strategy}</div>
                </div>
            </CardFooter>
        </Card>
    )
}

function LogList({ logs, isLoading }: Readonly<{ logs: Log[]; isLoading?: boolean }>) {
    if (isLoading) {
        return (
            <ScrollArea className="h-[60vh] rounded-md border">
                <div className="space-y-3 p-4">
                    {Array(5)
                        .fill(0)
                        .map((_, i) => (
                            <div key={i} className="rounded-md border p-3">
                                <div className="flex items-start gap-2">
                                    <Skeleton className="size-4 rounded-full" />
                                    <div className="flex-1">
                                        <div className="mb-2 flex items-center gap-2">
                                            <Skeleton className="h-4 w-16 rounded" />
                                            <Skeleton className="h-4 w-24 rounded" />
                                        </div>
                                        <Skeleton className="h-4 w-full rounded" />
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </ScrollArea>
        )
    }

    if (logs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <p>No logs to display</p>
            </div>
        )
    }

    return (
        <ScrollArea className="h-[60vh] rounded-md border">
            <div className="space-y-3 p-4">
                {logs.map((log) => (
                    <LogItem key={log.id} log={log} />
                ))}
            </div>
        </ScrollArea>
    )
}
