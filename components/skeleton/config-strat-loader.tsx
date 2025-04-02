import {Card, CardContent, CardHeader} from "@/components/ui/card"
import {Skeleton} from "@/components/ui/skeleton"

interface SkeletonLoaderProps {
    count?: number
}

export function ConfigStratSkeletonLoader({ count = 2 }: SkeletonLoaderProps) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, index) => (
                <Card key={index} className="overflow-hidden border shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-muted/30 pb-2">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-5 w-16" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="size-8 rounded-md" />
                            <Skeleton className="size-8 rounded-md" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
            <div className="flex flex-col justify-between gap-4 pt-2 sm:flex-row">
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-40" />
            </div>
        </div>
    )
}
