"use client"

import {useMemo} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"
import {useBotaccounts} from "@/services/bot-account/hooks"

interface MatchRateBarCardProps {
  className?: string
}

export default function MatchRateBarCard({ className }: Readonly<MatchRateBarCardProps>) {
  const { data: botAccounts, isLoading } = useBotaccounts()

  // Process data for the bar chart
  const barData = useMemo(() => {
    if (!botAccounts) return []

    return botAccounts.map((account) => {
      return {
        name: account.title || 'Unknown',
        matchRate: account.matches && account.likes && account.likes > 0 
          ? (account.matches / account.likes) * 100 
          : 0,
        swipes: account.swipes || 0,
        matches: account.matches || 0,
        likes: account.likes || 0,
      }
    })
  }, [botAccounts])

  // Custom tooltip to show more details
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="rounded-md border p-2 sm:p-3 shadow-md bg-background text-xs sm:text-sm">
          <p className="font-bold">{data.name}</p>
          <p>Match Rate: {data.matchRate.toFixed(2)}%</p>
          <p>Swipes: {data.swipes}</p>
          <p>Likes: {data.likes}</p>
          <p>Matches: {data.matches}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className={className}>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
          Match Rates by Account
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-4 md:p-6">
        {isLoading ? (
          <div className="flex h-[200px] sm:h-[300px] md:h-[400px] items-center justify-center">
            <p>Loading data...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300} className="sm:h-[300px] md:h-[400px]">
            <BarChart
              data={barData}
              margin={{
                top: 20,
                right: 20,
                bottom: 60,
                left: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
              />
              <YAxis 
                label={{ value: 'Match Rate (%)', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
                tick={{ fontSize: 10 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar 
                dataKey="matchRate" 
                name="Match Rate (%)" 
                fill="#8884d8"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
