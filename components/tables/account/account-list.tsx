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

// Placeholder for status options. Replace with actual statuses if available.
const STATUS_OPTIONS = ["Active", "Inactive", "Expired", "Working", "Completed", "Paused"]

export default function AccountList({ customColumns }: Readonly<{ customColumns?: ColumnDef<any>[] }>) {
    const { data = [] } = useBotaccounts()
    const { data: models = [] } = useModels()
    const [accountFilter, setAccountFilter] = useState("")
    const [modelFilter, setModelFilter] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    const handleAccountFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAccountFilter(e.target.value)
    }

    const handleModelFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setModelFilter(e.target.value)
    }

    const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value)
    }

    const filteredData = useMemo(() => {
        return data.filter((account) => {
            const model = models.find((model) => model.id === account.modele)
            const modelName = model ? model.name.toLowerCase() : ""
            return (
                account.title.toLowerCase().includes(accountFilter.toLowerCase()) &&
                (modelFilter === "" || modelName.includes(modelFilter.toLowerCase())) &&
                (statusFilter === "" || account.status.toLowerCase() === statusFilter.toLowerCase())
            )
        })
    }, [data, models, accountFilter, modelFilter, statusFilter])

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
    }, [table])

    const { pageSize, pageIndex } = table.getState().pagination
    const totalItems = filteredData.length
    const startItem = totalItems > 0 ? pageIndex * pageSize + 1 : 0
    const endItem = Math.min((pageIndex + 1) * pageSize, totalItems)

    return (
        <div className="space-y-3">
            <div className="flex flex-col space-y-2 md:flex-row md:items-end md:space-x-3 md:space-y-0">
                <Input
                    type="text"
                    placeholder="Search account"
                    value={accountFilter}
                    onChange={handleAccountFilterChange}
                    className="input md:w-1/3"
                />
                <select
                    value={modelFilter}
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
                    value={statusFilter}
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

            <DataTable data={filteredData} columns={columns} />

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
    )
}

