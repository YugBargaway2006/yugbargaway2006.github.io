"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface DetailsSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export function DetailsSidebar({ isOpen, onClose, title, children }: DetailsSidebarProps) {
    // Prevent scrolling when sidebar is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={cn(
                            "fixed right-0 top-0 h-full w-full md:w-[600px] z-[60]",
                            "bg-background/95 backdrop-blur-md border-l border-border shadow-2xl overflow-y-auto"
                        )}
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-8 sticky top-0 bg-background/95 backdrop-blur pb-4 pt-2 z-10 border-b border-border/50">
                                <h2 className="text-2xl font-serif font-bold text-primary">{title}</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-secondary rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="prose dark:prose-invert max-w-none animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-backwards">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
