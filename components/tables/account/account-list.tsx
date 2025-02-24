"use client"

import React, {useCallback, useMemo, useState} from "react"
import {
    type ColumnDef,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    type RowSelectionState,
    useReactTable,
} from "@tanstack/react-table"
import {DataTable} from "@/components/ui/data-table"
import {useBotaccounts} from "@/services/bot-account/hooks"
import {useModels} from "@/services/models/hooks"
import {Input} from "@/components/ui/input"
import {accountListColumns} from "@/components/tables/account/account-columns"
import {Button} from "@/components/ui/button"
import {Checkbox} from "@/components/ui/checkbox"

export default function AccountList() {
    const { data = [] } = useBotaccounts()
    const { data: models = [] } = useModels()
    const [accountFilter, setAccountFilter] = useState("")
    const [modelFilter, setModelFilter] = useState("")
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    const handleAccountFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAccountFilter(e.target.value)
    }

    const handleModelFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setModelFilter(e.target.value)
    }

    const filteredData = useMemo(() => {
        return data.filter((account) => {
            const model = models.find((model) => model.id === account.modele)
            const modelName = model ? model.name.toLowerCase() : ""
            return (
                account.title.toLowerCase().includes(accountFilter.toLowerCase()) &&
                modelName.includes(modelFilter.toLowerCase())
            )
        })
    }, [data, models, accountFilter, modelFilter])

    const columns = useMemo<ColumnDef<any>[]>(
        () => [
            {
                id: "select",
                header: ({ table }) => (
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                ),
                enableSorting: false,
                enableHiding: false,
            },
            ...accountListColumns,
        ],
        [],
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
                pageSize: 4,
            },
        },
    })

    const { pageSize, pageIndex } = table.getState().pagination

    const handlePreviousPage = useCallback(() => {
        table.previousPage()
    }, [table])

    const handleNextPage = useCallback(() => {
        table.nextPage()
    }, [table])

    const getSelectedRowIds = useCallback(() => {
        console.log("Row Selection State:", rowSelection)
        console.log("Filtered Selected Rows:", table.getFilteredSelectedRowModel().rows)

        const selectedRows = table.getFilteredSelectedRowModel().rows
        console.log("Selected Rows:", selectedRows)

        const ids = selectedRows.map((row) => {
            console.log("Row Data:", row.original)
            return row.original.id
        })

        console.log("Selected IDs:", ids)
        setSelectedIds(ids)
    }, [table, rowSelection])

    // Log whenever rowSelection changes
    React.useEffect(() => {
        console.log("Row Selection Updated:", rowSelection)
    }, [rowSelection])

    return (
        <div className="space-y-3">
            <h1 className="font-heading">Accounts List</h1>
            <div className="flex w-1/3 space-x-3">
                <Input
                    type="text"
                    placeholder="Search account"
                    value={accountFilter}
                    onChange={handleAccountFilterChange}
                    className="input"
                />
                <Input
                    type="text"
                    placeholder="Search model"
                    value={modelFilter}
                    onChange={handleModelFilterChange}
                    className="input"
                />
            </div>
            <DataTable data={table.getRowModel().rows.map((row) => row.original)} columns={columns} />
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
                    selected.
                </div>
                <div className="text-sm text-muted-foreground">
                    Showing {pageIndex * pageSize + 1} to {Math.min((pageIndex + 1) * pageSize, filteredData.length)} of{" "}
                    {filteredData.length} entries
                </div>
                <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={!table.getCanPreviousPage()}>
                        Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleNextPage} disabled={!table.getCanNextPage()}>
                        Next
                    </Button>
                </div>
            </div>
           
        </div>
    )
}

