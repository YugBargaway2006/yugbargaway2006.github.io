"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Github, Linkedin, Instagram, Menu, X } from "lucide-react";
import { Codeforces } from "./icons/codeforces";
import { IITKGPClock } from "./clock";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Experience", href: "/experience" },
    { name: "Projects", href: "/projects" },
    { name: "Achievements", href: "/achievements" },
    { name: "Contact", href: "/contact" },
];

export function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/60 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-24 flex items-center justify-between">
                {/* Logo / Name */}
                <Link href="/" className="font-serif text-2xl font-bold tracking-tight hover:text-primary data-[simulated-hover]:text-primary transition-colors">
                    Yug Bargaway
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "text-base font-medium transition-colors hover:text-primary data-[simulated-hover]:text-primary relative group",
                                pathname === item.href ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            {item.name}
                            {pathname === item.href && (
                                <motion.span
                                    layoutId="navbar-indicator"
                                    className="absolute left-0 -bottom-1 w-full h-0.5 bg-primary rounded-full"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Right Side: Clock, Socials, Mobile Toggle */}
                <div className="flex items-center gap-4">
                    <div className="hidden lg:block">
                        <IITKGPClock />
                    </div>

                    <div className="hidden md:flex items-center gap-2">
                        <Link href="https://github.com/yugbargaway2006" target="_blank" className="p-2 hover:bg-secondary data-[simulated-hover]:bg-secondary rounded-full transition-colors">
                            <Github className="w-5 h-5" />
                        </Link>
                        <Link href="https://linkedin.com/in/yugbargaway" target="_blank" className="p-2 hover:bg-secondary data-[simulated-hover]:bg-secondary rounded-full transition-colors">
                            <Linkedin className="w-5 h-5" />
                        </Link>
                        <Link href="https://codeforces.com/profile/Yug_Bargaway" target="_blank" className="p-2 hover:bg-secondary data-[simulated-hover]:bg-secondary rounded-full transition-colors" title="Codeforces">
                            <Codeforces className="w-5 h-5" />
                        </Link>
                        <Link href="https://instagram.com/yugbargaway" target="_blank" className="p-2 hover:bg-secondary data-[simulated-hover]:bg-secondary rounded-full transition-colors">
                            <Instagram className="w-5 h-5" />
                        </Link>
                        <ThemeToggle />
                    </div>

                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="md:hidden border-t border-border bg-background p-4 flex flex-col gap-4"
                >
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "text-lg font-medium",
                                pathname === item.href ? "text-primary" : "text-foreground"
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}
                    <div className="flex justify-between items-center mt-4 border-t border-border pt-4">
                        <IITKGPClock />
                        <ThemeToggle />
                    </div>
                </motion.div>
            )}
        </header>
    );
}
