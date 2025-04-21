"use client"

import {Button} from "@/components/ui/button"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {LaptopIcon, MoonIcon, SunIcon} from "lucide-react"
import {useTheme} from "next-themes"
import {useEffect, useState} from "react"

export default function ThemeToggle() {
	const { setTheme, theme } = useTheme()
	const [mounted, setMounted] = useState(false)

	// useEffect only runs on the client, so now we can safely show the UI
	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return null
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
				>
					<SunIcon className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<MoonIcon className="absolute size-5 rotate-90 scale-0 transition-all dark:static dark:rotate-0 dark:scale-100" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme("light")}>
					<SunIcon className="mr-2 size-4" />
					<span>Clair</span>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>
					<MoonIcon className="mr-2 size-4" />
					<span>Sombre</span>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>
					<LaptopIcon className="mr-2 size-4" />
					<span>Système</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
