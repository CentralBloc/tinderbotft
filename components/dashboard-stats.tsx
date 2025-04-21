"use client";

import {StatsCard} from "@/components/cards/stats-card";
import {ArrowLeftRight, Heart, ThumbsUp} from "lucide-react";
import {Card} from "@/components/ui/card";
import {useAllAccountStats, useBotaccounts} from "@/services/bot-account/hooks";
import MapPage from "@/components/pages/map-page";
import StatsSkeletonLoader from "@/components/skeleton/dashboard-loader";
import SwipeActionSchedule from "@/components/pages/schedule-page";
import AccountsOverview from "@/components/cards/account-overview-card";
import MatchRateBarCard from "@/components/cards/match-rate-bar-card";


export default function DashboardStats() {
	const { data, isSuccess, isLoading } = useAllAccountStats();
	const {data: botAccounts} = useBotaccounts();
	const matchPerLikePercentage = data?.total_likes ? ((data.total_matches / data.total_likes) * 100).toFixed(2) : "0.00";

	isSuccess && console.log(data);

	return (
	    <main className="flex-1 overflow-y-auto p-8">
	        {isLoading ? (
	            <StatsSkeletonLoader />
	        ) : (
	            <div className="space-y-8">
	                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
	                    <StatsCard title="Total Swipes Made" value={data?.total_swipes} icon={<ArrowLeftRight color="#201dc9" className="text-success size-4" />} />
	                    <StatsCard
	                        title="Total Likes Made"
	                        value={data?.total_likes}
	                        icon={<ThumbsUp className="size-4 text-blue-500" />}
	                    />
	                    <StatsCard title="Total Matches Made" value={data?.total_matches} icon={<Heart className="size-4 text-pink-500" />} />
	                    <StatsCard title="Match per like %" value={`${matchPerLikePercentage}%`} icon={<Heart className="text-success size-4" />} />
	                </div>

	                <div className="grid gap-4 md:grid-cols-1">
	                    <div className="p-6">
	                        <MapPage />
	                    </div>
	                </div>

					<div className="grid grid-cols-2 gap-4">
						<div className=" p-6">
							<MatchRateBarCard />
						</div>

						<Card className=" p-6">
							<AccountsOverview accounts={botAccounts || []} />
						</Card>
					</div>
					<div className="grid gap-6 md:grid-cols-1">
						<div className="p-6">
							<SwipeActionSchedule />
						</div>
					</div>
	            </div>
	        )}
	    </main>
	);
}
