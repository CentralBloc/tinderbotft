"use client"

import {useMemo} from "react"
import {BotAccountInterface} from "@/types";
import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from "recharts";


interface AccountsOverviewProps {
    accounts: BotAccountInterface[]
}

export default function AccountsOverview({ accounts }: Readonly<AccountsOverviewProps>) {
    // Calculate status counts
    const statusData = useMemo(() => {
        const statusCounts: Record<string, number> = {}

        accounts.forEach((account) => {
            if (statusCounts[account.status]) {
                statusCounts[account.status]++
            } else {
                statusCounts[account.status] = 1
            }
        })

        return Object.entries(statusCounts).map(([name, value]) => ({
            name,
            value,
        }))
    }, [accounts])

    // Define colors for each status
    const COLORS = {
        active: "#166534", // green
        inactive: "#0a010a", // black
        expired: "#1f2937", // gray
        working : "#1e40af", // blue
        banned: "#991b1b", // red
        shadowban: "#9a3412", // orange
        paused: "#6b21a8", // purple
        completed: "#f59e0b", // yellow
        standby: "#0284c7", // sky blue
    }

    return (
        <div className="size-full">

            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || "#9ca3af"} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number) => [`${value} accounts`, "Count"]}
                        contentStyle={{
                            backgroundColor: "white",
                            borderRadius: "0.375rem",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                            border: "none",
                        }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value) => {
                            const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)
                            return <span className="text-sm font-medium">{capitalizedValue}</span>
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

