import {siteConfig} from "@/config/site";
import ThemeToggle from "@/components/theme-toogle";
import Link from "next/link";

export default function BottomNav() {
	return (
		<div className="flex items-center justify-between border-t pt-4">
			<Link aria-label={siteConfig.name} href="/">
				<h3 className="text-xl font-semibold text-gray-800 dark:text-foreground/80">{siteConfig.name}</h3>
			</Link>
			<ThemeToggle />
		</div>
	);
}
