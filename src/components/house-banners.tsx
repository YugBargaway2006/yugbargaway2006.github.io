"use client";

import { motion } from "framer-motion";
import { Shield, Brain, Hammer, Code } from "lucide-react";
import { useState } from "react";

const houses = [
    {
        id: "gryffindor",
        name: "Gryffindor",
        skill: "Systems",
        color: "#740001", // Official Crimson
        accent: "#D3A625", // Gold
        icon: Shield,
        percent: "26%",
    },
    {
        id: "ravenclaw",
        name: "Ravenclaw",
        skill: "Research",
        color: "#0E1A40", // Official Navy
        accent: "#946B2D", // Bronze
        icon: Brain,
        percent: "27%",
    },
    {
        id: "hufflepuff",
        name: "Hufflepuff",
        skill: "Building",
        color: "#ecb939", // Official Yellow
        accent: "#F0C75E",
        icon: Hammer,
        percent: "25%",
        iconColor: "#372e29"
    },
    {
        id: "slytherin",
        name: "Slytherin",
        skill: "Competitive",
        color: "#1a472a", // Official Green
        accent: "#5D5D5D", // Silver
        icon: Code,
        percent: "22%",
    }
];

export function HouseBanners() {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    return (
        <div className="w-full mb-12 relative pt-6 cursor-default">
            {/* Header Section - HIGHER Z-INDEX to sit on top (z-30) */}
            <div className="relative flex items-center justify-center mb-0 z-30">
                {/* Horizontal Rod */}
                {/* LIGHT MODE: FORCE bg-[#b8860b] (Solid Gold). NO GRADIENTS to avoid transparency issues. */}
                {/* DARK MODE: bg-blue-600 */}
                <div className="absolute w-full h-[3px] bg-[#b8860b] dark:bg-blue-600 shadow-sm dark:shadow-[0_0_15px_rgba(37,99,235,0.9)] opacity-100 dark:opacity-80 rounded-full top-[50%] translate-y-[-50%]"></div>

                {/* Gem/Hexagon Header - Sitting ON TOP of the rod */}
                <div className="relative px-1 bg-transparent">
                    {/* Gem Container */}
                    {/* LIGHT MODE: Border #ffae00, BG #ffc107 (Solid Yellow/Gold). */}
                    {/* DARK MODE: Border Blue, BG Dark Blue */}
                    <div className="relative border-2 border-[#ffae00] dark:border-blue-600 bg-[#ffc107] dark:bg-[#0a0a20] px-8 py-2 rounded-lg shadow-md dark:shadow-[0_0_20px_rgba(37,99,235,0.5)] transform skew-x-[-10deg]">
                        {/* Inner border - Lighter Gold in Light Mode */}
                        <div className="absolute inset-0.5 border border-[#fff8e1] dark:border-blue-400/30 rounded-sm skew-x-[0deg] opacity-60"></div>

                        {/* Title - STRICTLY BLACK in Light Mode */}
                        <h2 className="text-black dark:text-white font-serif tracking-[0.2em] text-sm md:text-base font-bold uppercase transform skew-x-[10deg] whitespace-nowrap drop-shadow-none dark:drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                            Sorted by Skill
                        </h2>
                    </div>
                </div>
            </div>

            {/* Banners Container - LOWER Z-INDEX (z-10) to sit BEHIND header */}
            {/* Flags overlap line upwards (mt-[-2px]) */}
            <div className="flex justify-center items-start gap-4 md:gap-8 px-2 transition-all duration-500 relative z-10 mt-[-2px]">
                {houses.map((house) => {
                    const isHovered = hoveredId === house.id;
                    const isAnyHovered = hoveredId !== null;
                    const isFaded = isAnyHovered && !isHovered;

                    return (
                        <div
                            key={house.id}
                            className="flex flex-col items-center group relative pointer-events-auto"
                            onMouseEnter={() => setHoveredId(house.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            {/* Banner Container */}
                            <div
                                className="relative flex flex-col items-center transition-all duration-300 ease-out"
                                style={{
                                    opacity: isFaded ? 0.4 : 1,
                                    filter: isHovered
                                        ? "contrast(1.1) brightness(1.1) saturate(1.2)"
                                        : (isFaded ? "grayscale(0.6) blur(0.5px)" : "none"),
                                    zIndex: isHovered ? 40 : 10,
                                }}
                            >
                                {/* Banner Shape */}
                                <div
                                    className="w-[58px] md:w-[80px] h-[78px] md:h-[110px] relative shadow-lg flex flex-col items-center justify-center pt-1"
                                    style={{
                                        backgroundColor: house.color,
                                        clipPath: "polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)",
                                        boxShadow: isHovered ? "0 20px 40px -5px rgba(0,0,0,0.5)" : "0 8px 20px -4px rgba(0,0,0,0.4)"
                                    }}
                                >
                                    {/* Inner Shield Outline */}
                                    <div className="absolute w-[75%] h-[75%] top-[8%] border-[1.5px] opacity-70 rounded-b-full rounded-t-sm"
                                        style={{ borderColor: house.accent }}>
                                    </div>

                                    {/* Icon */}
                                    <house.icon
                                        className="w-6 h-6 md:w-9 md:h-9 relative z-10"
                                        style={{ color: house.iconColor || house.accent }}
                                    />
                                </div>
                            </div>

                            {/* Text Below Banner */}
                            <div
                                className="mt-3 text-center transition-opacity duration-300"
                                style={{ opacity: isFaded ? 0.3 : 1 }}
                            >
                                {/* House Name: STRICTLY BLACK in Light Mode */}
                                <h3 className="text-black dark:text-white/90 font-serif text-[12px] md:text-[14px] font-bold tracking-wide">
                                    {house.name}
                                </h3>
                                {/* Percent: STRICTLY BLACK in Light Mode */}
                                <div className="text-lg md:text-2xl font-serif font-black text-black dark:text-white/60 leading-tight">
                                    {house.percent}
                                </div>
                                {/* Skill: Gold in Light */}
                                <div className="text-[10px] uppercase tracking-wider text-[#b8860b] dark:text-primary mt-1 font-mono font-bold opacity-100">
                                    {house.skill}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
