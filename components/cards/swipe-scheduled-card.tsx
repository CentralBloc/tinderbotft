"use client"

import {Clock} from "lucide-react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Progress} from "@/components/ui/progress"
import {getStatusColor} from "@/lib/utils";
import {SwipeAction} from "@/types";


interface SwipeScheduleCardProps {
    title: string
    status: string
    progress: number
    strategy: {
        name: string
        days_number: number
    }
    swipeAction: SwipeAction,
}

export function SwipeScheduleCard({title, status, progress, strategy, swipeAction}: Readonly<SwipeScheduleCardProps>) {

    // Format time to display in 12-hour format
    const formatTime = (time: string) => {
        if (!time) return "N/A"
        const [hours, minutes] = time.split(":").map(Number)
        const period = hours >= 12 ? "PM" : "AM"
        const formattedHours = hours % 12 || 12
        return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`
    }

    // Calculate random swipe count within the min-max range
    const swipeCount = Math.floor(
        Math.random() * (swipeAction.max_swipe_times - swipeAction.min_swipe_times + 1) + swipeAction.min_swipe_times,
    )

    // Calculate random right swipe percentage within the min-max range
    const rightSwipePercentage = Math.floor(
        Math.random() * (swipeAction.max_right_swipe_percentage - swipeAction.min_right_swipe_percentage + 1) +
        swipeAction.min_right_swipe_percentage,
    )

    return (
        <Card className="w-full max-w-md shadow-md transition-shadow hover:shadow-lg">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold">{title}</CardTitle>
                    <Badge className={`${getStatusColor(status)} `}>{status || "Unknown"}</Badge>
                </div>
                <CardDescription>
                    Strategy: {strategy.name} (Day {swipeAction.related_day}/{strategy.days_number})
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>
              {progress}/{strategy.days_number} days
            </span>
                    </div>
                    <Progress value={(progress / strategy.days_number) * 100} className="h-2" />
                </div>

                <div className="space-y-3 rounded-lg  p-4">
                    <div className="flex items-center gap-2 ">
                        <Clock className="size-4" />
                        <span className="font-medium">Scheduled Times:</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-md border  p-3">
                            <div className="text-sm ">First Session</div>
                            <div className="font-semibold">{formatTime(swipeAction.scheduled_time)}</div>
                        </div>

                        {swipeAction.scheduled_time_2 && (
                            <div className="rounded-md border p-3">
                                <div className="text-sm ">Second Session</div>
                                <div className="font-semibold">{formatTime(swipeAction.scheduled_time_2)}</div>
                            </div>
                        )}
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-2">
                        <div className="rounded-md border  p-3">
                            <div className="text-sm ">Swipes</div>
                            <div className="font-semibold">
                                {swipeAction.min_swipe_times}-{swipeAction.max_swipe_times}
                            </div>
                        </div>

                        <div className="rounded-md border p-3">
                            <div className="text-sm ">Right Swipe %</div>
                            <div className="font-semibold">
                                {swipeAction.min_right_swipe_percentage}%-{swipeAction.max_right_swipe_percentage}%
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
