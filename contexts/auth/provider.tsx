"use client";

import {useMe} from "@/services/users/hooks";
import {useQueryClient} from "@tanstack/react-query";
import {useSession} from "next-auth/react";
import React from "react";
import {AuthContext} from "./context";
import AdvancedLoader from "@/components/skeleton/page-loader";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
	const { data: session } = useSession();
	const { data: userData, isLoading } = useMe(!!session?.accessToken);

	const queryClient = useQueryClient();

	const refetch = () => {
		queryClient.invalidateQueries({ queryKey: ["getMe"] });
	};

	return <AuthContext.Provider value={{ user: userData, refetch, isLoading }}>
		{isLoading ? (
			<div className="flex h-screen flex-col justify-center">
				<AdvancedLoader />
			</div>
		) : (
			children
		)}

	</AuthContext.Provider>;
}
