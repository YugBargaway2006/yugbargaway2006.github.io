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
        <div className="w-full mb-10 relative pt-0 mt-[-10px] cursor-default">
            {/* Header Section - HIGHER Z-INDEX to sit on top (z-30) */}
            <div className="relative flex items-center justify-center mb-0 z-30">
                {/* Horizontal Rod */}
                {/* Visual Fix: Use [.dark_&]: instead of dark: to enforce Class Strategy */}
                <div
                    className="absolute w-[80%] md:w-[60%] h-[3px] opacity-100 [.dark_&]:opacity-80 rounded-full top-[50%] translate-y-[-50%]"
                    style={{
                        backgroundColor: "var(--rod-color, #D4AF37)",
                    }}
                >
                    {/* Dark Mode Override using Arbitrary Variant */}
                    <div className="w-full h-full bg-[#D4AF37] [.dark_&]:bg-blue-600"></div>
                </div>

                {/* Gem/Hexagon Header - Sitting ON TOP of the rod */}
                <div className="relative px-1 bg-transparent group/header">
                    {/* Gem Container */}
                    <div className="relative border-2 border-[#D4AF37] [.dark_&]:border-blue-600 bg-[#FFC107] [.dark_&]:bg-[#0a0a20] px-8 py-2 rounded-lg shadow-[0_4px_14px_rgba(212,175,55,0.4)] [.dark_&]:shadow-[0_0_20px_rgba(37,99,235,0.6)] transform skew-x-[-10deg] overflow-hidden transition-all duration-300 hover:scale-105">

                        {/* Shimmer Effect */}
                        <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[20deg] animate-[shimmer_3s_infinite]" />

                        {/* Inner border */}
                        <div className="absolute inset-0.5 border border-[#fff8e1] [.dark_&]:border-blue-400/30 rounded-sm skew-x-[0deg] opacity-60"></div>

                        {/* Title */}
                        <h2 className="text-black [.dark_&]:text-white font-serif tracking-[0.2em] text-sm md:text-base font-bold uppercase transform skew-x-[10deg] whitespace-nowrap drop-shadow-none [.dark_&]:drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] relative z-10">
                            Sorted by Skill
                        </h2>
                    </div>
                </div>
            </div>

            {/* Banners Container - LOWER Z-INDEX (z-10) to sit BEHIND header */}
            <div className="flex justify-center items-start gap-4 md:gap-8 px-2 transition-all duration-500 relative z-10 mt-[-22px]">
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
                            {/* Banner Container - Fixed Height to prevent layout shift */}
                            <div
                                className="relative flex flex-col items-center justify-start h-[100px] md:h-[135px] transition-all duration-300 ease-out"
                                style={{
                                    opacity: isFaded ? 0.4 : 1,
                                    transform: "none",
                                    filter: isHovered
                                        ? "contrast(1.1) brightness(1.1) saturate(1.2)"
                                        : (isFaded ? "grayscale(0.6) blur(0.5px)" : "none"),
                                    zIndex: isHovered ? 40 : 10,
                                }}
                            >
                                {/* Banner Shape */}
                                <div
                                    className={`
                                        w-[58px] md:w-[80px] 
                                        relative shadow-lg flex flex-col items-center justify-start pt-4
                                        transition-all duration-300 ease-out
                                        ${isHovered ? "h-[95px] md:h-[135px]" : (isFaded ? "h-[70px] md:h-[100px]" : "h-[78px] md:h-[110px]")}
                                    `}
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
                                className="mt-2 text-center transition-opacity duration-300"
                                style={{ opacity: isFaded ? 0.3 : 1 }}
                            >
                                {/* House Name */}
                                <h3 className="text-black [.dark_&]:text-white/90 font-serif text-[12px] md:text-[14px] font-bold tracking-wide">
                                    {house.name}
                                </h3>
                                {/* Percent */}
                                <div className="text-lg md:text-2xl font-serif font-black text-black [.dark_&]:text-white/60 leading-tight">
                                    {house.percent}
                                </div>
                                {/* Skill */}
                                <div className="text-[10px] uppercase tracking-wider text-[#b8860b] [.dark_&]:text-primary mt-1 font-mono font-bold opacity-100">
                                    {house.skill}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style jsx global>{`
                @keyframes shimmer {
                    0% { left: -100%; }
                    100% { left: 200%; }
                }
            `}</style>
        </div>
    );
}
