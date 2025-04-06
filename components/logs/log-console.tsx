"use client"

import {useState} from "react"
import {Badge} from "@/components/ui/badge"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Download, RefreshCw} from "lucide-react"
import {Button} from "@/components/ui/button"

import {LogFilter} from "./log-filter"
import type {Log, LogType} from "@/types"
import {LogItem} from "./log-items"


export default function LogConsole() {
    const [activeTab, setActiveTab] = useState<string>("all")
    const [activeFilters, setActiveFilters] = useState<LogType[]>(["error", "swipe", "match"])
    const [selectedSession, setSelectedSession] = useState<string | null>(null)

    // Get unique sessions for filtering
    const sessions = Array.from(new Set(logs.map((log) => log.session).filter(Boolean)))

    const filteredLogs = logs.filter((log) => {
        // Filter by type
        const typeMatch = activeTab === "all" ? activeFilters.includes(log.type) : log.type === activeTab

        // Filter by session if selected
        const sessionMatch = selectedSession ? log.session === selectedSession : true

        return typeMatch && sessionMatch
    })

    const errorCount = logs.filter((log) => log.type === "error").length
    const swipeCount = logs.filter((log) => log.type === "swipe").length
    const matchCount = logs.filter((log) => log.type === "match").length

    const handleClearLogs = () => {
        setLogs([])
    }


    const handleFilterChange = (type: LogType) => {
        if (activeFilters.includes(type)) {
            setActiveFilters(activeFilters.filter((t) => t !== type))
        } else {
            setActiveFilters([...activeFilters, type])
        }
    }

    const handleSessionChange = (session: string | null) => {
        setSelectedSession(session)
    }

    const handleExportLogs = () => {
        const exportData = JSON.stringify(logs, null, 2)
        const blob = new Blob([exportData], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `dating-app-logs-${new Date().toISOString().split("T")[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    return (
        <Card className="w-full border-none bg-zinc-900 text-white shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Activity Log Console</CardTitle>
    <div className="flex items-center gap-2">
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
    <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
    <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
    <TabsList className="bg-zinc-800">
    <TabsTrigger value="all" className="data-[state=active]:bg-zinc-700">
        All
        <Badge variant="outline" className="ml-2 bg-zinc-700 text-zinc-200">
        {filteredLogs.length}
        </Badge>
        </TabsTrigger>
        <TabsTrigger value="error" className="data-[state=active]:bg-red-900/50">
        Errors
        <Badge variant="outline" className="ml-2 bg-red-900/50 text-red-200">
        {errorCount}
        </Badge>
        </TabsTrigger>
        <TabsTrigger value="swipe" className="data-[state=active]:bg-blue-900/50">
        Swipes
        <Badge variant="outline" className="ml-2 bg-blue-900/50 text-blue-200">
        {swipeCount}
        </Badge>
        </TabsTrigger>
        <TabsTrigger value="match" className="data-[state=active]:bg-green-900/50">
        Matches
        <Badge variant="outline" className="ml-2 bg-green-900/50 text-green-200">
        {matchCount}
        </Badge>
        </TabsTrigger>
        </TabsList>

        <div className="flex flex-wrap gap-2">
    {activeTab === "all" && <LogFilter activeFilters={activeFilters} onFilterChange={handleFilterChange} />}

    {sessions.length > 0 && (
        <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-400">Session:</span>
    <select
        className="rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-200"
        value={selectedSession || ""}
        onChange={(e) => handleSessionChange(e.target.value || null)}
    >
        <option value="">All Sessions</option>
        {sessions.map((session) => (
            <option key={session} value={session}>
            {session}
            </option>
        ))}
        </select>
        </div>
    )}
    </div>
    </div>

    <TabsContent value="all" className="m-0">
    <LogList logs={filteredLogs} />
    </TabsContent>
    <TabsContent value="error" className="m-0">
    <LogList
        logs={logs.filter(
            (log) => log.type === "error" && (selectedSession ? log.session === selectedSession : true),
        )}
    />
    </TabsContent>
    <TabsContent value="swipe" className="m-0">
    <LogList
        logs={logs.filter(
            (log) => log.type === "swipe" && (selectedSession ? log.session === selectedSession : true),
        )}
    />
    </TabsContent>
    <TabsContent value="match" className="m-0">
    <LogList
        logs={logs.filter(
            (log) => log.type === "match" && (selectedSession ? log.session === selectedSession : true),
        )}
    />
    </TabsContent>
    </Tabs>
    </CardContent>
    </Card>
)
}

    function LogList({ logs }: { logs: Log[] }) {
        if (logs.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-10 text-zinc-500">
                    <p>No logs to display</p>
                </div>
            )
        }

        return (
            <ScrollArea className="h-[400px] rounded-md border border-zinc-800">
            <div className="space-y-3 p-4">
                {logs.map((log) => (
                        <LogItem key={log.id} log={log} />
                ))}
            </div>
            </ScrollArea>
        )
    }

