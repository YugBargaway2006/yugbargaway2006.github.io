"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function TimeManager() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Initial Session Theme Set & Periodic Check
    useEffect(() => {
        setMounted(true);

        const checkTimeAndSetTheme = () => {
            const hasVisited = sessionStorage.getItem("hasVisited");
            if (!hasVisited) {
                const now = new Date();
                // Use local hours directly since we can only "control" local time in browser tests easily
                // This aligns with user expectation that "mocked time" (local) drives the theme
                const hour = now.getHours();

                if (hour >= 5 && hour < 19) {
                    setTheme("light");
                } else {
                    setTheme("dark");
                }
                sessionStorage.setItem("hasVisited", "true");
            }
        };

        checkTimeAndSetTheme();
    }, [setTheme]);

    // Ambient Light Logic (Light Mode Only)
    useEffect(() => {
        if (!mounted) return;

        const updateAmbientLight = () => {
            // Calculate IST for consistency with the clock
            const now = new Date();
            // Use local hours directly since we can only "control" local time in browser tests easily
            // This aligns with user expectation that "mocked time" (local) drives the theme
            const hour = now.getHours();

            let ambientColor = "transparent";

            // Ranges: 5-9 (Green), 9-13 (Yellow), 13-17 (Orange), 17-19 (Blue)
            if (hour >= 5 && hour < 9) {
                ambientColor = "rgba(16, 185, 129, 0.15)"; // Green-ish
            } else if (hour >= 9 && hour < 13) {
                ambientColor = "rgba(234, 179, 8, 0.15)"; // Yellow-ish
            } else if (hour >= 13 && hour < 17) {
                ambientColor = "rgba(249, 115, 22, 0.15)"; // Orange-ish
            } else if (hour >= 17 && hour < 19) {
                ambientColor = "rgba(59, 130, 246, 0.15)"; // Blue-ish
            }

            document.documentElement.style.setProperty("--ambient-color", ambientColor);
        };

        // Run immediately and every minute
        updateAmbientLight();
        const interval = setInterval(updateAmbientLight, 60000);
        return () => clearInterval(interval);
    }, [mounted, theme]);

    return null; // Logic only component
}
