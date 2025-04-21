import { routes } from "@/lib/routes";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

export default function Hero() {
	return (
		<div className="grid items-center gap-8 lg:grid-cols-2 xl:gap-20">
			<div className="space-y-5">
				<h1 className="text-3xl leading-tight text-gray-700 dark:text-foreground/85 max-lg:text-center md:text-[2.6rem] xl:text-4xl">
					Automatisez vos swipe-up sur votre compte tinder
				</h1>
				<p className="text-gray-400 max-lg:text-center xl:text-xl">
					Nous vous aidons à planifier et à automatiser vos swipe sur votre compte.
				</p>
				<div className="flex gap-x-6 max-lg:justify-center">
					<Button asChild>
						<Link href={routes.auth.register}>Découvrir</Link>
					</Button>
					<Button variant="outline">En savoir plus</Button>
				</div>
				<div className="grid gap-4 rounded-xl bg-slate-100/50 p-4 dark:bg-foreground/5 md:grid-cols-2 [&>div:first-of-type]:md:border-r [&>div:first-of-type]:md:border-gray-400">
					<div>
						<h1>85%</h1>
						<p>Gagnez le premier mois</p>
					</div>
					<div>
						<h1>+12k</h1>
						<p>Bénéfice moyen par mois</p>
					</div>
				</div>
			</div>

			<div className="max-lg:order-first">
				<div className="flex h-72 flex-col justify-center overflow-hidden px-2 md:h-[30rem]">
					<div className="-m-1.5 h-full rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/15 dark:bg-foreground/10 dark:ring-foreground/30 lg:rounded-2xl">
						<Image
							src="/images/img-layout.avif"
							alt="auth-layout"
							height={500}
							width={800}
							className="size-full rounded-md	bg-white object-cover shadow-2xl ring-1 ring-gray-900/10 dark:bg-foreground dark:ring-foreground/20"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
