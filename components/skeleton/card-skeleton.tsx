import {Skeleton} from "@/components/ui/skeleton"

export default function ProfileCardSkeleton() {
    return (
        <div className="flex w-full max-w-4xl flex-col overflow-hidden rounded-lg border bg-background md:flex-row">
            {/* Left side - Profile Image */}
            <div className="relative aspect-[3/4] w-full md:w-2/5">
                <Skeleton className="absolute inset-0 size-full" />

                {/* Status badge */}
                <div className="absolute left-4 top-4">
                    <Skeleton className="h-8 w-24 rounded-md" />
                </div>

                {/* Name and location at bottom */}
                <div className="absolute bottom-4 left-4 space-y-2">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-6 w-24" />
                </div>
            </div>

            {/* Right side - Profile Details */}
            <div className="w-full space-y-4 p-4 md:w-3/5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="size-6 rounded-full" />
                        <Skeleton className="h-6 w-16" />
                    </div>
                </div>

                {/* Bio text */}
                <Skeleton className="h-16 w-full" />

                {/* Interaction stats */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center justify-center rounded-lg bg-gray-100 p-4">
                        <Skeleton className="mb-1 size-6 rounded-full" />
                        <Skeleton className="mb-1 size-8 rounded-full" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-lg bg-blue-50 p-4">
                        <Skeleton className="mb-1 size-6 rounded-full" />
                        <Skeleton className="mb-1 size-8 rounded-full" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-lg bg-red-50 p-4">
                        <Skeleton className="mb-1 size-6 rounded-full" />
                        <Skeleton className="mb-1 size-8 rounded-full" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b">
                    <div className="flex-1 pb-2 text-center">
                        <Skeleton className="mx-auto h-6 w-32" />
                    </div>
                    <div className="flex-1 pb-2 text-center">
                        <Skeleton className="mx-auto h-6 w-16" />
                    </div>
                </div>

                {/* Profile details */}
                <div className="space-y-4">
                    {/* Gender */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Skeleton className="size-5 rounded-full" />
                            <Skeleton className="h-5 w-20" />
                        </div>
                        <Skeleton className="h-5 w-24" />
                    </div>

                    {/* Zodiac */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Skeleton className="size-5 rounded-full" />
                            <Skeleton className="h-5 w-20" />
                        </div>
                        <Skeleton className="h-5 w-40" />
                    </div>

                    {/* Schools */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Skeleton className="size-5 rounded-full" />
                            <Skeleton className="h-5 w-20" />
                        </div>
                        <Skeleton className="h-5 w-24" />
                    </div>

                    {/* Interest */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Skeleton className="size-5 rounded-full" />
                            <Skeleton className="h-5 w-20" />
                        </div>
                        <Skeleton className="h-5 w-24" />
                    </div>

                    {/* Education */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Skeleton className="size-5 rounded-full" />
                            <Skeleton className="h-5 w-20" />
                        </div>
                        <Skeleton className="h-5 w-24" />
                    </div>

                    {/* Looking for */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Skeleton className="size-5 rounded-full" />
                            <Skeleton className="h-5 w-20" />
                        </div>
                        <Skeleton className="h-5 w-24" />
                    </div>

                    {/* No interests */}
                    <Skeleton className="h-5 w-40" />

                    {/* Age Range */}
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-24" />
                    </div>

                    {/* Communication */}
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-5 w-24" />
                    </div>

                    {/* Strategy Days */}
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-28" />
                        <Skeleton className="h-5 w-16" />
                    </div>

                    {/* Email */}
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-0" />
                    </div>

                    {/* Phone Number */}
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-5 w-0" />
                    </div>

                    {/* Strategy Progress */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Skeleton className="size-5 rounded-full" />
                            <Skeleton className="h-5 w-32" />
                        </div>
                        <Skeleton className="h-5 w-16" />
                    </div>

                    {/* Progress bar */}
                    <Skeleton className="h-2 w-full rounded-full" />
                </div>
            </div>
        </div>
    )
}
