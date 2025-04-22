"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Sample data for recent activities
const recentActivities = [
  {
    id: "1",
    user: {
      name: "John Doe",
      email: "john@example.com",
      avatar: "/placeholder.svg"
    },
    action: "signed up",
    timestamp: "2 hours ago",
    type: "user"
  },
  {
    id: "2",
    user: {
      name: "Jane Smith",
      email: "jane@example.com",
      avatar: "/placeholder.svg"
    },
    action: "purchased a subscription",
    timestamp: "3 hours ago",
    type: "subscription"
  },
  {
    id: "3",
    user: {
      name: "Robert Johnson",
      email: "robert@example.com",
      avatar: "/placeholder.svg"
    },
    action: "upgraded plan",
    timestamp: "5 hours ago",
    type: "subscription"
  },
  {
    id: "4",
    user: {
      name: "Emily Davis",
      email: "emily@example.com",
      avatar: "/placeholder.svg"
    },
    action: "cancelled subscription",
    timestamp: "1 day ago",
    type: "subscription"
  },
  {
    id: "5",
    user: {
      name: "Michael Wilson",
      email: "michael@example.com",
      avatar: "/placeholder.svg"
    },
    action: "signed up",
    timestamp: "1 day ago",
    type: "user"
  }
]

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {recentActivities.map((activity) => (
        <div key={activity.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
            <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.user.name}</p>
            <p className="text-sm text-muted-foreground">
              {activity.action}
            </p>
          </div>
          <div className="ml-auto flex flex-col items-end">
            <Badge variant={activity.type === "user" ? "default" : "secondary"}>
              {activity.type === "user" ? "User" : "Subscription"}
            </Badge>
            <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
          </div>
        </div>
      ))}
    </div>
  )
}