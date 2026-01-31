"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TimeBombProps {
    onComplete: () => void;
}

export function TimeBomb({ onComplete }: TimeBombProps) {
    const [count, setCount] = useState(10);
    const [exploded, setExploded] = useState(false);
    const [rebooting, setRebooting] = useState(false);

    useEffect(() => {
        if (count > 0) {
            const timer = setTimeout(() => setCount(count - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setExploded(true);
            setTimeout(() => {
                setRebooting(true);
                setTimeout(() => {
                    onComplete();
                }, 4000); // Wait for reboot text
            }, 2000); // Wait for black screen
        }
    }, [count, onComplete]);

    if (rebooting) {
        return (
            <div className="fixed inset-0 z-[100] bg-black font-mono text-white p-8 space-y-2 pointer-events-none">
                <Typewriter text="> SYSTEM FAILURE DETECTED." delay={0} />
                <Typewriter text="> INITIATING RECOVERY PROTOCOL..." delay={1000} />
                <Typewriter text="> RESTORING BACKUP FROM ANTIGRAVITY CLOUD..." delay={2000} />
                <Typewriter text="> REBOOT SUCCESSFUL. WELCOME BACK, YUG." delay={3000} />
            </div>
        )
    }

    return (
        <div className={cn(
            "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none transition-colors duration-100",
            count % 2 === 0 ? "bg-red-900/40" : "bg-transparent" // Red flash
        )}>
            {exploded ? (
                <div className="fixed inset-0 bg-black" />
            ) : (
                <motion.div
                    animate={{
                        x: [-5, 5, -5, 5, 0],
                        y: [-2, 2, -2, 2, 0]
                    }}
                    transition={{ repeat: Infinity, duration: 0.1 }}
                    className="text-center"
                >
                    <h1 className="text-9xl font-black text-red-600 tracking-tighter shadow-red-500 drop-shadow-2xl">
                        {count}
                    </h1>
                    <p className="text-red-500 font-mono text-2xl uppercase mt-4 animate-pulse">
                        Destruction Imminent
                    </p>
                </motion.div>
            )}
        </div>
    );
}

function Typewriter({ text, delay }: { text: string; delay: number }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    if (!visible) return null;
    return <p>{text}</p>;
}
