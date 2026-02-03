"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function NotFound() {
    const router = useRouter();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [autoReturn, setAutoReturn] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (typeof window !== "undefined" && window.location.search.includes("return=true")) {
            setAutoReturn(true);
            const timer = setTimeout(() => {
                router.back();
            }, 40000); // 40 seconds to allow full animation loop
            return () => clearTimeout(timer);
        }
    }, [router]);

    // Use resolvedTheme to correctly identify system preference
    const svgSrc = mounted && resolvedTheme === 'dark' ? '/404-dark.svg' : '/404-light.svg';

    return (
        <div className="h-screen w-screen overflow-hidden bg-background flex flex-col items-center justify-start pt-[10vh] md:pt-[15vh] gap-8">
            {/* 
               SVG Animation Container
               - Scaled to 55% width.
               - pointer-events-none ensures it doesn't block the button if they overlap.
            */}
            <div className="relative w-[85%] md:w-[55%] flex items-center justify-center pointer-events-none">
                <object
                    key={svgSrc} // Force re-render on theme change
                    type="image/svg+xml"
                    data={svgSrc}
                    className="w-full h-auto"
                    aria-label="404 Spilled Paint Animation"
                />
            </div>

            {/* Content Button - Placed naturally in flow with z-index to ensure clickability */}
            <div className="z-50 flex flex-col items-center gap-4 pointer-events-auto">
                {autoReturn ? (
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-background/60 backdrop-blur-md rounded-full border border-primary/30 shadow-xl">
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span className="text-foreground/80 font-mono text-sm">
                            Magic restoration in progress...
                        </span>
                    </div>
                ) : (
                    <Button
                        asChild
                        className="bg-[#44c5df] hover:bg-[#3bb0c9] text-white px-8 py-6 rounded-md text-lg font-bold shadow-lg transition-transform transform hover:scale-105 border-none"
                    >
                        <Link href="/">GO BACK HOME</Link>
                    </Button>
                )}
            </div>
        </div>
    );
}
