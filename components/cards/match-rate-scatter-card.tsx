"use client"

import {useMemo} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {CartesianGrid, Legend, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis} from "recharts"
import {useBotaccounts} from "@/services/bot-account/hooks"

interface MatchRateScatterCardProps {
  className?: string
}

export default function MatchRateScatterCard({ className }: Readonly<MatchRateScatterCardProps>) {
  const { data: botAccounts, isLoading } = useBotaccounts()

  // Process data for the scatter chart
  const scatterData = useMemo(() => {
    if (!botAccounts) return []

    // Log data structure to help with debugging
    console.log('Bot accounts data:', botAccounts)

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
        <div className="rounded-md border bg-white p-3 shadow-md">
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
      <CardHeader className="pb-2">
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
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid />
              <XAxis 
                type="number" 
                dataKey="swipes" 
                name="Swipes" 
                label={{ value: 'Total Swipes', position: 'insideBottomRight', offset: -10 }}
              />
              <YAxis 
                type="number" 
                dataKey="matchRate" 
                name="Match Rate (%)" 
                label={{ value: 'Match Rate (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Scatter 
                name="Accounts" 
                data={scatterData} 
                fill="#8884d8" 
                shape="circle"
              />
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
