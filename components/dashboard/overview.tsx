"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Sample data for the chart
const data = [
  { name: "Jan", users: 400, subscriptions: 240 },
  { name: "Feb", users: 300, subscriptions: 139 },
  { name: "Mar", users: 200, subscriptions: 980 },
  { name: "Apr", users: 278, subscriptions: 390 },
  { name: "May", users: 189, subscriptions: 480 },
  { name: "Jun", users: 239, subscriptions: 380 },
  { name: "Jul", users: 349, subscriptions: 430 },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <Bar
          dataKey="users"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
        <Bar
          dataKey="subscriptions"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary/70"
        />
        <Tooltip
          cursor={{ fill: "transparent" }}
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "0.375rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "none",
          }}
        />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  )
}