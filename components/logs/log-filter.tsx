"use client"

import {CheckIcon} from "lucide-react"
import {Badge} from "@/components/ui/badge"
import type {LogType} from "@/types"

interface LogFilterProps {
    activeFilters: LogType[]
    onFilterChange: (type: LogType) => void
}

export function LogFilter({ activeFilters, onFilterChange }: LogFilterProps) {
    const filters: { type: LogType; label: string; color: string }[] = [
        { type: "error", label: "Errors", color: "bg-red-900/30 border-red-800 text-red-400 hover:bg-red-900/50" },
        { type: "swipe", label: "Swipes", color: "bg-blue-900/30 border-blue-800 text-blue-400 hover:bg-blue-900/50" },
        { type: "match", label: "Matches", color: "bg-green-900/30 border-green-800 text-green-400 hover:bg-green-900/50" },
    ]

    return (
        <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
                <Badge
                    key={filter.type}
                    variant="outline"
                    className={`cursor-pointer ${filter.color} ${
                        !activeFilters.includes(filter.type) ? "opacity-50" : ""
                    } transition-all`}
                    onClick={() => onFilterChange(filter.type)}
                >
                    {activeFilters.includes(filter.type) && <CheckIcon className="mr-1 size-3" />}
                    {filter.label}
                </Badge>
            ))}
        </div>
    )
}
