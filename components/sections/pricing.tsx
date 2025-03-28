import React from "react";
import {Card, CardContent} from "../ui/card";
import {CheckCircle} from "lucide-react";
import {Button} from "@/components/ui/button"

export default function PricingSection() {

	const pricingPlans = [
		{
			name: "Basique",
			price: 0,
			description: "Pour les débutants",
			features: [
				"1 projet",
				"1 utilisateur",
				"Stockage de 1 Go",
				"Support par e-mail"
			]
		},
		{
			name: "Pro",
			price: 9.99,
			description: "Pour les professionnels",
			features: [
				"5 projets",
				"5 utilisateurs",
				"Stockage de 5 Go",
				"Support par e-mail"
			]
		},
		{
			name: "Entreprise",
			price: 19.99,
			description: "Pour les entreprises",
			features: [
				"10 projets",
				"10 utilisateurs",
				"Stockage de 10 Go",
				"Support par e-mail"
			],
			featured: true
		},
	]
	return (
		<section id="pricing" className="bg-gray-50 py-20 dark:bg-gray-900">
			<div className="container px-4 md:px-6">
				<div className="flex flex-col items-center justify-center gap-4 text-center md:gap-6">
					<div className="space-y-2">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Tarification</h2>
						<p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
							Choisissez le plan qui correspond le mieux à vos besoins.
						</p>
					</div>
				</div>
				<div className="mt-12 grid gap-6 md:grid-cols-3 lg:gap-8">
					{pricingPlans.map((plan, index) => (
						<Card
							key={index}
							className={`border-0 ${plan.featured ? "bg-purple-50 ring-2 ring-purple-500 dark:bg-purple-900/20" : "bg-white dark:bg-gray-800"} shadow-md`}
						>
							<CardContent className="p-6">
								{plan.featured && (
									<div className="mb-4 inline-block rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-300">
										Populaire
									</div>
								)}
								<h3 className="text-2xl font-bold">{plan.name}</h3>
								<div className="mt-4 flex items-baseline">
									<span className="text-4xl font-bold">{plan.price}€</span>
									<span className="ml-1 text-muted-foreground">/mois</span>
								</div>
								<p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
								<ul className="mt-6 space-y-3">
									{plan.features.map((feature, featureIndex) => (
										<li key={featureIndex} className="flex items-start gap-2">
											<CheckCircle className="mt-0.5 size-5 text-purple-600" />
											<span>{feature}</span>
										</li>
									))}
								</ul>
								<Button
									className={`mt-8 w-full ${plan.featured ? "bg-purple-600 text-white hover:bg-purple-700" : "border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"}`}
								>
									Commencer
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
