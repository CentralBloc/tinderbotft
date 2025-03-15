"use client"

import {Button} from "@/components/ui/button"
import {cn} from "@/lib/utils"
import {LaptopIcon, MoonIcon, SunIcon} from "lucide-react"
import {useTheme} from "next-themes"

interface HorizontalThemeToggleProps {
    className?: string
}

export function HorizontalThemeToggle({ className }: Readonly<HorizontalThemeToggleProps>) {
    const { theme, setTheme } = useTheme()

    return (
        <div className={cn("flex items-center rounded-lg border p-1", className)}>
            <Button
                variant="ghost"
                size="sm"
                className={cn(
                    "flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                    theme === "light" ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
                onClick={() => setTheme("light")}
                aria-label="Mode clair"
            >
                <SunIcon className="mr-2 size-3.5" />
                Clair
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className={cn(
                    "flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                    theme === "dark" ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
                onClick={() => setTheme("dark")}
                aria-label="Mode sombre"
            >
                <MoonIcon className="mr-2 size-3.5" />
                Sombre
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className={cn(
                    "flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                    theme === "system" ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
                onClick={() => setTheme("system")}
                aria-label="Mode système"
            >
                <LaptopIcon className="mr-2 size-3.5" />
                Système
            </Button>
        </div>
    )
}

