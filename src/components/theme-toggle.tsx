"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
        // @ts-ignore - View Transitions API
        if (!document.startViewTransition) {
            setTheme(theme === "dark" ? "light" : "dark")
            return
        }

        const x = e.clientX
        const y = e.clientY

        const root = document.documentElement
        root.style.setProperty("--x", `${x}px`)
        root.style.setProperty("--y", `${y}px`)

        // @ts-ignore
        document.startViewTransition(() => {
            setTheme(theme === "dark" ? "light" : "dark")
        })
    }

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-secondary data-[simulated-hover]:bg-secondary transition-colors relative"
            aria-label="Toggle theme"
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute top-2 left-2 h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </button>
    )
}
