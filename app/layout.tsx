import {TailwindIndicator} from "@/components/tailwind-indicator";
import {Toaster} from "@/components/ui/toaster";
import {siteConfig} from "@/config/site";
import QueryProvider from "@/lib/providers/query-provider";
import SessionProvider from "@/lib/providers/session-provider";
import {cn} from "@/lib/utils";
import type {Metadata} from "next";
import {Outfit as FontSans} from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import {ThemeProvider} from "@/components/theme-provider";
import {ThemeColorExtractor} from "@/components/theme-color-extractor";

const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });

const fontHeading = localFont({
	src: "../assets/fonts/ClashDisplay-Medium.woff2",
	variable: "--font-heading",
});

export const metadata: Metadata = {
	metadataBase: new URL(process.env.NEXTAUTH_URL!),
	title: {
		default: siteConfig.name,
		template: `%s | ${siteConfig.name}`,
	},
	keywords: ["auto-date-swiper", "auto", "date", "swiper", "auto-date-swiper.com", "tinder", "dating app", "dating", "autoswiperdate"],
	openGraph: {
		type: "website",
		locale: "fr_FR",
		url: siteConfig.url,
		title: siteConfig.name,
		description: siteConfig.description,
		siteName: siteConfig.name,
	},
	description: siteConfig.description,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head />
			<body
				className={cn("bg-background font-heading antialiased min-h-screen", fontSans.variable, fontHeading.variable)}
			>
				<SessionProvider>
					<QueryProvider>
						<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
						<ThemeColorExtractor />
						{children}
						<TailwindIndicator />
						<Toaster />
						</ThemeProvider>
					</QueryProvider>
				</SessionProvider>
			</body>
		</html>
	);
}
