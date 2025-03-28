"use client";

import {routes} from "@/lib/routes";
import {LogOut} from "lucide-react";
import {signOut} from "next-auth/react";

export default function LogoutButton() {
	return (
		<div
			className="flex w-full cursor-pointer items-center py-[2px] font-medium text-destructive dark:text-red-500"
			onClick={() =>
				signOut({
					callbackUrl: routes.auth.login,
				})
			}
		>
			<LogOut className="mr-2 size-4" aria-hidden="true" />
			<span>Logout</span>
		</div>
	);
}
