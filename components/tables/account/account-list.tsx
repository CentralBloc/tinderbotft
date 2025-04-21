"use client"

import React, {useMemo, useState} from "react"
import {
    type ColumnDef,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    type Row,
    type RowSelectionState,
    type Table,
    useReactTable,
} from "@tanstack/react-table"
import {DataTable} from "@/components/ui/data-table"
import {useBotaccounts} from "@/services/bot-account/hooks"
import {useModels} from "@/services/models/hooks"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Checkbox} from "@/components/ui/checkbox"
import {DataTableSkeleton} from "@/components/skeleton/table-skeleton"

// Placeholder for status options. Replace with actual statuses if available.
const STATUS_OPTIONS = ["Active", "Inactive", "Expired", "Working", "Completed", "Paused", "ShadowBan", "Banned"]

export default function AccountList({
                                        customColumns,
                                        onSelectionChange,
                                        externalFilters,
                                    }: Readonly<{
    customColumns?: ColumnDef<any>[]
    onSelectionChange?: (selectedIds: string[]) => void
    externalFilters?: {
        accountFilter: string
        modelFilter: string | null
        statusFilter: string | null
        setAccountFilter: (value: string) => void
        setModelFilter: (value: string | null) => void
        setStatusFilter: (value: string | null) => void
    }
}>) {
    const { data = [], isPending } = useBotaccounts()
    const { data: models = [] } = useModels()
    const [accountFilter, setAccountFilter] = useState("")
    const [modelFilter, setModelFilter] = useState<string | null>(null)
    const [statusFilter, setStatusFilter] = useState<string | null>(null)
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    // Use external filters if provided, otherwise use local state
    const activeAccountFilter = externalFilters?.accountFilter ?? accountFilter
    const activeModelFilter = externalFilters?.modelFilter ?? modelFilter
    const activeStatusFilter = externalFilters?.statusFilter ?? statusFilter

    const handleAccountFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (externalFilters) {
            externalFilters.setAccountFilter(e.target.value)
        } else {
            setAccountFilter(e.target.value)
        }
    }

    const handleModelFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value === "all" ? null : e.target.value;
        if (externalFilters) {
            externalFilters.setModelFilter(value)
        } else {
            setModelFilter(value)
        }
    }

    const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value === "all" ? null : e.target.value;
        if (externalFilters) {
            externalFilters.setStatusFilter(value)
        } else {
            setStatusFilter(value)
        }
    }

    const filteredData = useMemo(() => {
        return data.filter((account) => {
            const model = models.find((model) => model.id === account.modele)
            const modelName = model ? model.name.toLowerCase() : ""
            return (
                account.title.toLowerCase().includes(activeAccountFilter.toLowerCase()) &&
                (activeModelFilter === null || modelName.includes(activeModelFilter.toLowerCase())) &&
                (activeStatusFilter === null || account.status.toLowerCase() === activeStatusFilter.toLowerCase())
            )
        })
    }, [data, models, activeAccountFilter, activeModelFilter, activeStatusFilter])

    const columns = useMemo<ColumnDef<any>[]>(
        () => [
            {
                id: "select",
                header: ({ table }: { table: Table<any> }) => (
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                ),
                cell: ({ row }: { row: Row<any> }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                ),
                enableSorting: true,
                enableHiding: false,
            },
            ...(customColumns ?? []),
        ],
        [customColumns],
    )

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            rowSelection,
        },
        initialState: {
            pagination: {
                pageSize: 20,
            },
        },
    })

    // Update selectedIds whenever row selection changes
    React.useEffect(() => {
        const selectedRows = table.getFilteredSelectedRowModel().rows
        const ids = selectedRows.map((row) => row.original.id)
        setSelectedIds(ids)

        // Call the callback with selected IDs if provided
        if (onSelectionChange) {
            onSelectionChange(ids)
        }
    }, [table.getFilteredSelectedRowModel().rows, onSelectionChange])

    const { pageSize, pageIndex } = table.getState().pagination
    const totalItems = filteredData.length
    const startItem = totalItems > 0 ? pageIndex * pageSize + 1 : 0
    const endItem = Math.min((pageIndex + 1) * pageSize, totalItems)

    return (
        <div className="flex flex-col gap-4">
            {isPending ? (
                <DataTableSkeleton columns={8} rows={20} />
            ) : (
                <div className="space-y-3">
                    {!externalFilters && (
                        <div className="flex flex-col space-y-2 md:flex-row md:items-end md:space-x-3 md:space-y-0">
                            <Input
                                type="text"
                                placeholder="Search account"
                                value={accountFilter}
                                onChange={handleAccountFilterChange}
                                className="md:w-1/3"
                            />
                            <select
                                value={modelFilter || ""}
                                onChange={handleModelFilterChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:w-1/4"
                            >
                                <option value="">All Models</option>
                                {models.map((model) => (
                                    <option key={model.id} value={model.name.toLowerCase()}>
                                        {model.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={statusFilter || ""}
                                onChange={handleStatusFilterChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:w-1/4"
                            >
                                <option value="">All Statuses</option>
                                {STATUS_OPTIONS.map((status) => (
                                    <option key={status} value={status.toLowerCase()}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <DataTable data={filteredData} columns={columns} table={table} />

                    <div className="flex flex-col items-center justify-between space-y-2 py-4 sm:flex-row sm:space-x-2 sm:space-y-0">
                        <div className="text-sm text-muted-foreground">
                            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
                            selected.
                        </div>
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
                            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
