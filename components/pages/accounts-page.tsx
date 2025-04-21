"use client"

import {useMemo, useState} from "react"
import {Grid, Table} from 'lucide-react'
import {Button} from "@/components/ui/button"
import {useBotaccounts} from "@/services/bot-account/hooks"
import {useModels} from "@/services/models/hooks"
import {GridAccountCard} from "@/components/cards/grid-account-card"
import AccountTabs from "@/components/tabs/account-tabs"
import {Input} from "@/components/ui/input"
import {getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable} from "@tanstack/react-table"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// Placeholder for status options. Replace with actual statuses if available.
const STATUS_OPTIONS = ["Active", "Inactive", "Expired", "Working", "Completed", "Paused", "ShadowBan", "Banned"]

export default function BotAccountsPage() {
    const [viewType, setViewType] = useState<"grid" | "table">("table")
    const { data: botAccounts = []} = useBotaccounts()
    const { data: models = [] } = useModels()

    // Filters
    const [accountFilter, setAccountFilter] = useState("")
    const [modelFilter, setModelFilter] = useState<string | null>(null)
    const [statusFilter, setStatusFilter] = useState<string | null>(null)

    const handleAccountFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAccountFilter(e.target.value)
    }

    const handleModelFilterChange = (value: string | null) => {
        setModelFilter(value === "all" ? null : value)
    }

    const handleStatusFilterChange = (value: string | null) => {
        setStatusFilter(value === "all" ? null : value)
    }

    const filteredData = useMemo(() => {
        return botAccounts.filter((account) => {
            const model = models.find((model) => model.id === account.modele)
            const modelName = model ? model.name.toLowerCase() : ""
            return (
                account.title.toLowerCase().includes(accountFilter.toLowerCase()) &&
                (modelFilter === null || modelName.includes(modelFilter.toLowerCase())) &&
                (statusFilter === null || account.status.toLowerCase() === statusFilter.toLowerCase())
            )
        })
    }, [botAccounts, models, accountFilter, modelFilter, statusFilter])

    // Pagination for grid view
    const table = useReactTable({
        data: filteredData,
        columns: [],
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        initialState: {
            pagination: {
                pageSize: 20,
            },
        },
    })

    const { pageSize, pageIndex } = table.getState().pagination
    const totalItems = filteredData.length
    const startItem = totalItems > 0 ? pageIndex * pageSize + 1 : 0
    const endItem = Math.min((pageIndex + 1) * pageSize, totalItems)

    // Get current page data for grid view
    const currentPageData = table.getRowModel().rows.map(row => row.original)

    return (
        <div className="container mx-auto space-y-6 p-4">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <h1 className="text-3xl font-bold">Tinder Accounts</h1>
                <div className="flex w-full items-center gap-4 sm:w-auto">
                    <div className="flex gap-1 rounded-lg bg-muted p-1">
                        <Button
                            variant={viewType === "table" ? "secondary" : "ghost"}
                            size="icon"
                            onClick={() => setViewType("table")}
                        >
                            <Table className="size-4" />
                        </Button>
                        <Button
                            variant={viewType === "grid" ? "secondary" : "ghost"}
                            size="icon"
                            onClick={() => setViewType("grid")}
                        >
                            <Grid className="size-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Filters - shown for both views */}
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-3 md:space-y-0">
                <div className="w-full md:w-1/3">
                    <Input
                        type="text"
                        placeholder="Search account"
                        value={accountFilter}
                        onChange={handleAccountFilterChange}
                    />
                </div>

                <div className="w-full md:w-1/3">
                    <Select value={modelFilter ?? "all"} onValueChange={handleModelFilterChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Models</SelectLabel>
                                <SelectItem value="all">All</SelectItem>
                                {models.map((model) => (
                                    <SelectItem key={model.id} value={model.name.toLowerCase()}>
                                        {model.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-full md:w-1/3">
                    <Select value={statusFilter ?? "all"} onValueChange={handleStatusFilterChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Statuses</SelectLabel>
                                <SelectItem value="all">All</SelectItem>
                                {STATUS_OPTIONS.map((status) => (
                                    <SelectItem key={status} value={status.toLowerCase()}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {viewType === "grid" ? (
                <>
                    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                        {currentPageData.map((bot) => (
                            <GridAccountCard key={bot.id} botAccount={bot} />
                        ))}
                    </div>

                    {/* Pagination for grid view */}
                    <div className="flex flex-col items-center justify-between space-y-2 py-4 sm:flex-row sm:space-x-2 sm:space-y-0">
                        {totalItems > 0 && (
                            <div className="text-sm text-muted-foreground">
                                Showing {startItem} to {endItem} of {totalItems} entries
                            </div>
                        )}
                        <div className="space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                Previous
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => table.nextPage()} 
                                disabled={!table.getCanNextPage()}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </>
            ) : (
                <AccountTabs 
                    externalFilters={{
                        accountFilter,
                        modelFilter,
                        statusFilter,
                        setAccountFilter,
                        setModelFilter,
                        setStatusFilter
                    }} 
                />
            )}
        </div>
    )
}
