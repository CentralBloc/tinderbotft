import {Breadcrumbs} from "@/components/pagers/breadcrumbs";
import DashboardStats from "@/components/dashboard-stats";
import {Metadata} from "next";

export const metadata: Metadata = {
	title: "Dashboard - Accueil",
	description: "Dashboard Accueil",
};

export default function DashboardHomePage() {
	return (
		<div className="space-y-5">
			<Breadcrumbs segments={[{ title: "Dashboard" }]} />

			<DashboardStats />
		</div>
	);
}
