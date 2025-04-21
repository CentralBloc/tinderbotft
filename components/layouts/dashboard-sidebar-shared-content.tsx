"use client";

import Logo from "@/components/logo";
import {routes} from "@/lib/routes";
import {cn} from "@/lib/utils";
import {MainNavItem} from "@/types";
import Link from "next/link";

type DashboardSidebarSharedContentProps = {
	sidebarNavItems: MainNavItem[];
	pathname: string;
	setIsOpen?: (value: boolean) => void;
};

export default function DashboardSidebarSharedContent({
	sidebarNavItems,
	pathname,
	setIsOpen,
}: Readonly<DashboardSidebarSharedContentProps>) {
	return (
		<div className="space-y-12">
			<Logo href={routes.dashboard.home} onClick={() => setIsOpen?.(false)} />

			<ul className="flex flex-col gap-y-2">
				{sidebarNavItems.map(({ icon: Icon, ...item }) => {
					const isActive = (pathname.includes(item.href) && item.href.length > 1) || pathname === item.href;
					const hasSubmenu = item.items && item.items.length > 0;

					return (
						<li key={`${item.href}`} className="flex flex-col">
							<Link
								aria-label={item.title}
								href={item.href}
								onClick={() => setIsOpen?.(false)}
								className={cn(
									"text-foreground flex items-center gap-x-2 py-[14px] px-4 rounded-md relative",
									isActive
										? "font-medium bg-primary/10 border border-primary/30 text-primary"
										: "hover:bg-foreground/5 hover:text-primary"
								)}
							>
								{Icon && <Icon className="size-5" />}
								<span className="text-xs lg:text-base">{item.title}</span>
							</Link>

							{hasSubmenu && (
								<ul className="ml-6 mt-1 flex flex-col gap-y-1 border-l border-primary/20 pl-2">
									{item.items?.map((subItem) => {
										const isSubItemActive = (pathname.includes(subItem.href) && subItem.href.length > 1) || pathname === subItem.href;

										return (
											<Link
												key={subItem.href}
												aria-label={subItem.title}
												href={subItem.href}
												onClick={() => setIsOpen?.(false)}
												className={cn(
													"text-foreground flex items-center gap-x-2 py-2 px-3 rounded-md text-sm",
													isSubItemActive
														? "font-medium bg-primary/5 text-primary"
														: "hover:bg-foreground/5 hover:text-primary"
												)}
											>
												{subItem.icon && <subItem.icon className="size-4" />}
												<span>{subItem.title}</span>
											</Link>
										);
									})}
								</ul>
							)}
						</li>
					);
				})}
			</ul>
		</div>
	);
}
