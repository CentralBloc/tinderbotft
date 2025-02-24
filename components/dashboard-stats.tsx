"use client";

import {StatsCard} from "@/components/cards/stats-card";
import {useStats} from "@/services/users/hooks";
import {Heart, ThumbsDown, ThumbsUp} from "lucide-react";
import {Card} from "@/components/ui/card";


export default function DashboardStats() {
	const { data, isSuccess } = useStats();

	isSuccess && console.log(data);

	return (
		<main className="flex-1 overflow-y-auto p-8">
			<div className="space-y-8">
				<div>
					<p className="text-muted-foreground">Welcome back to your dashboard</p>
				</div>

				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<StatsCard title="Total Likes Made" value="10,869" icon={<ThumbsUp className="text-success size-4" />} />
					<StatsCard
						title="Total Dislikes Made"
						value="1,767"
						icon={<ThumbsDown className="size-4 text-red-500" />}
					/>
					<StatsCard title="Total Matches Made" value="7,552" icon={<Heart className="size-4 text-pink-500" />} />
					<StatsCard title="Match per like %" value="69.4%" icon={<Heart className="text-success size-4" />} />
				</div>

				<div className="grid gap-4 md:grid-cols-2">
					<Card className="p-6">
						<h3 className="mb-4 font-semibold">Accounts Locations</h3>
						<div className="aspect-[16/9] rounded-lg bg-muted"></div>
					</Card>

					<Card className="p-6">
						<h3 className="mb-4 font-semibold">Matches Per Day</h3>
						<div className="aspect-[16/9] rounded-lg bg-muted"></div>
					</Card>
				</div>
			</div>
		</main>
	);
}
