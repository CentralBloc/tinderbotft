import DashboardHeader from "@/components/layouts/dashboard-header";
import SideBar from "@/components/layouts/sidebar";
import AuthProvider from "@/contexts/auth/provider";

import React from "react";
import {PageTransition} from "@/components/skeleton/page-transition";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<AuthProvider>
			<PageTransition>
			<div className="flex max-h-screen overflow-hidden">
				<SideBar />
				<main className="dashboard-content w-full">
					<div className="h-full overflow-y-auto p-6 lg:p-8 2xl:p-10">
						<DashboardHeader />
						<div className="pb-5 font-sans max-lg:pt-16">{children}</div>
					</div>
				</main>
			</div>
			</PageTransition>
		</AuthProvider>
	);
}
