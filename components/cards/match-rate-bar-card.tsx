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
        <div className="rounded-md border  p-3 shadow-md">
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
      <CardHeader className="">
        <CardTitle className="flex items-center gap-2">
          Match Rates by Account
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[400px] items-center justify-center">
            <p>Loading data...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
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
              />
              <YAxis 
                label={{ value: 'Match Rate (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
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