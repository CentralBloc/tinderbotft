"use client"

import type React from "react"

import {Card} from "@/components/ui/card"
import {Heart, MapPin, RefreshCw, ThumbsUp} from "lucide-react"

export default function StatsSkeletonLoader() {
    return (
        <div className="w-full space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCardSkeleton icon={<RefreshCw className="size-5 text-blue-500" />} title="Total Swipes Made" />
                <StatCardSkeleton icon={<ThumbsUp className="size-5 text-blue-500" />} title="Total Likes Made" />
                <StatCardSkeleton icon={<Heart className="size-5 text-rose-500" />} title="Total Matches Made" />
                <StatCardSkeleton icon={<Heart className="size-5 text-slate-800" />} title="Match per like %" />
            </div>

            {/* Map and Chart Section */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <MapPin className="size-5 text-slate-500" />
                                <div className="h-4 w-24 animate-pulse rounded bg-slate-200"></div>
                            </div>
                        </div>
                        <div className="mt-4 h-[400px] animate-pulse rounded-md bg-slate-200"></div>
                    </div>
                </Card>

                <Card>
                    <div className="p-6">
                        <div className="flex h-[400px] flex-col items-center justify-center">
                            <div className="relative size-64">
                                <div className="absolute inset-0 rounded-full border-8 border-slate-200"></div>
                                <div className="absolute inset-4 animate-pulse rounded-full border-8 border-slate-100"></div>
                            </div>
                            <div className="mt-6 flex w-full justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="size-3 rounded-full bg-blue-500"></div>
                                    <div className="h-4 w-24 animate-pulse rounded bg-slate-200"></div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="size-3 rounded-full bg-slate-800"></div>
                                    <div className="h-4 w-24 animate-pulse rounded bg-slate-200"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}

function StatCardSkeleton({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
        <Card className="overflow-hidden">
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-500">{title}</span>
                    {icon}
                </div>
                <div className="mt-4 h-8 w-16 animate-pulse rounded bg-slate-200"></div>
            </div>
        </Card>
    )
}

