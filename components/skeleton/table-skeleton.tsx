import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"

interface DataTableSkeletonProps {
    columns: number
    rows: number
    showHeader?: boolean
    showToolbar?: boolean
    showPagination?: boolean
}

export function DataTableSkeleton({
                                      columns = 5,
                                      rows = 10,
                                      showHeader = true,
                                      showToolbar = true,
                                      showPagination = true,
                                  }: DataTableSkeletonProps) {
    return (
        <Card>
            {showHeader && (
                <CardHeader>
                    <CardTitle>
                        <div className="h-7 w-1/4 animate-pulse rounded-md bg-muted" />
                    </CardTitle>
                </CardHeader>
            )}

            {showToolbar && (
                <CardContent className="pb-4">
                    <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                        <div className="h-9 w-full max-w-[200px] animate-pulse rounded-md bg-muted" />
                        <div className="flex items-center space-x-2">
                            <div className="h-9 w-[120px] animate-pulse rounded-md bg-muted" />
                            <div className="h-9 w-[120px] animate-pulse rounded-md bg-muted" />
                        </div>
                    </div>
                </CardContent>
            )}

            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {Array.from({ length: columns }).map((_, index) => (
                                    <TableHead key={index}>
                                        <div className="h-6 w-full animate-pulse rounded-md bg-muted" />
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.from({ length: rows }).map((_, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {Array.from({ length: columns }).map((_, colIndex) => (
                                        <TableCell key={colIndex}>
                                            <div
                                                className={`h-5 animate-pulse rounded-md bg-muted ${colIndex === 0 ? "w-4/5" : "w-full"}`}
                                            />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {showPagination && (
                    <div className="flex items-center justify-between py-4">
                        <div className="h-8 w-[100px] animate-pulse rounded-md bg-muted" />
                        <div className="flex items-center space-x-2">
                            <div className="size-8 animate-pulse rounded-md bg-muted" />
                            <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
                            <div className="size-8 animate-pulse rounded-md bg-muted" />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
