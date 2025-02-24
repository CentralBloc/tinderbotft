import type React from "react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"

export interface StatsCardProps {
	title: string
	value: string | number
	icon: React.ReactNode
}

export function StatsCard({ title, value, icon }: Readonly<StatsCardProps>) {
	return (
		<Card className="bg-accent">
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
				{icon}
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
			</CardContent>
		</Card>
	)
}
