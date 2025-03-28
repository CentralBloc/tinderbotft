import React from "react";
import {Card, CardContent} from "@/components/ui/card";

export default function FeaturesSection() {
	const features = [
		{
			title: "Swipes Automatiques",
			description: "Automatisez les swipes selon vos préférences.",
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="size-6 text-purple-500 dark:text-purple-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
			),
		},
		{
			title: "Matchs Automatiques",
			description: "Automatisez les matchs selon vos préférences.",
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="size-6 text-purple-500 dark:text-purple-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
			),
		},
		{
			title: "Messages Automatiques",
			description: "Automatisez les messages selon vos préférences.",
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="size-6 text-purple-500 dark:text-purple-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
			),
		}
		]
	return (
		<section id="features" className="bg-gray-50 py-20 dark:bg-gray-900">
			<div className="container px-4 md:px-6">
				<div className="flex flex-col items-center justify-center gap-4 text-center md:gap-6">
					<div className="space-y-2">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features</h2>
						<p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
							Découvrez comment notre plateforme peut vous aider à optimiser votre expérience de dating.
						</p>
					</div>
				</div>
				<div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
					{features.map((feature, index) => (
						<Card key={index} className="border-0 bg-white shadow-md dark:bg-gray-800">
							<CardContent className="p-6">
								<div className="mb-4 flex size-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
									{feature.icon}
								</div>
								<h3 className="text-xl font-bold">{feature.title}</h3>
								<p className="mt-2 text-muted-foreground">{feature.description}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
