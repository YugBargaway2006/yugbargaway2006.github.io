"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Send, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { MatrixRain } from "./effects/matrix-rain";
import { TimeBomb } from "./effects/time-bomb";

interface HistoryItem {
    command: string;
    output: React.ReactNode;
}

export function InteractiveTerminal() {
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isTyping, setIsTyping] = useState(false); // Block input during effects
    const [showMatrix, setShowMatrix] = useState(false);
    const [showBomb, setShowBomb] = useState(false);
    const [typingCommand, setTypingCommand] = useState("");

    // Ref for auto-scrolling
    const endRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initial typing effect state
    const [introTyped, setIntroTyped] = useState("");
    const introText = "./init_profile.sh --theme=magical";

    useEffect(() => {
        setMounted(true);
        // Intro typing effect
        let i = 0;
        const interval = setInterval(() => {
            setIntroTyped(introText.substring(0, i + 1));
            i++;
            if (i > introText.length) clearInterval(interval);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    // Only scroll when a new command is executed (history length changes)
    // Don't scroll when just typing
    const prevHistoryLength = useRef(history.length);

    useEffect(() => {
        // Only scroll if history actually increased (new command was executed)
        if (history.length > prevHistoryLength.current && history.length > 0) {
            // Scroll the terminal container, not the whole page
            if (contentRef.current) {
                contentRef.current.scrollTop = contentRef.current.scrollHeight;
            }
        }
        prevHistoryLength.current = history.length;
    }, [history]);

    // Focus input on click
    const handleContainerClick = () => {
        inputRef.current?.focus();
    };

    const handleCommand = async (cmd: string) => {
        const cleanCmd = cmd.trim().toLowerCase();

        // Add command to history immediately
        const newHistory = [...history, { command: cmd, output: null }];
        setHistory(newHistory);
        setInput("");

        // Process Command
        let output: React.ReactNode = null;

        switch (cleanCmd) {
            case "help":
                output = (
                    <div className="space-y-1 text-sm">
                        <p className="text-primary font-bold">Available Commands:</p>
                        <div className="grid grid-cols-[100px_1fr] gap-2">
                            <span>about</span><span>:: Warp to About Sector</span>
                            <span>projects</span><span>:: Explore Artifacts</span>
                            <span>contact</span><span>:: Open Comm Channels</span>
                            <span>clear</span><span>:: Wipe Terminal Buffer</span>
                            <span>history</span><span>:: View Command Log</span>
                            <span>theme</span><span>:: Toggle Visual Matrix (Light/Dark)</span>
                            <span>sudo</span><span>:: Execute as Superuser</span>
                        </div>
                    </div>
                );
                break;

            case "clear":
            case "cls":
                setTimeout(() => setHistory([]), 300); // Slight delay for feel
                return; // Return early, history cleared

            case "about":
            case "whoami":
                output = <p className="text-green-500">Initiating warp to [ABOUT_SECTOR]...</p>;
                setHistory([...newHistory, { command: cmd, output }]);
                setTimeout(() => router.push("/about"), 1000);
                return;

            case "projects":
            case "work":
                output = <p className="text-blue-500">Accessing artifact archive...</p>;
                setHistory([...newHistory, { command: cmd, output }]);
                setTimeout(() => router.push("/projects"), 800);
                return;

            case "contact":
            case "email":
                output = <p className="text-yellow-500">Opening frequency channels...</p>;
                setHistory([...newHistory, { command: cmd, output }]);
                setTimeout(() => router.push("/contact"), 800);
                return;

            case "theme":
                output = <p>Toggling reality matrix...</p>;
                setHistory([...newHistory, { command: cmd, output }]);
                // Trigger the theme toggle logic if possible, or just simple set
                setTimeout(() => {
                    const newTheme = theme === "dark" ? "light" : "dark";
                    setTheme(newTheme);
                }, 500);
                return;

            case "sudo":
                output = <p className="text-red-500 font-bold">User is not in the sudoers file. This incident will be reported to Yug.</p>;
                break;

            case "ls":
            case "ls -la":
                output = (
                    <div className="space-y-1">
                        <p>drwx------  2 yug  staff   64 Jan 30 20:25 .thoughts/</p>
                        <p>-rw-r--r--  1 yug  staff  420 Jan 20 16:20 hidden_talent.txt</p>
                        <p>-r--------  1 yug  staff  1337 Dec 25 00:00 secret_recipe.md</p>
                    </div>
                );
                break;

            case "cat secret_recipe.md":
                output = <p className="italic text-yellow-400">"10% Coffee, 20% Magic, 70% StackOverflow."</p>;
                break;

            case "matrix":
                setShowMatrix(true);
                output = <p className="text-green-500">Wake up, Neo...</p>;
                setTimeout(() => setShowMatrix(false), 5000);
                break;

            case "rm -rf /":
                setShowBomb(true);
                setIsTyping(true); // Lock input
                return; // Handled by effect component

            case "":
                break;

            default:
                output = <p className="text-red-400">Command not found: {cleanCmd}. Type &apos;help&apos; for assistance.</p>;
        }

        setHistory([...newHistory, { command: cmd, output }]);
    };

    const onBombComplete = () => {
        setShowBomb(false);
        setIsTyping(false);
        setHistory([]); // Fresh start
        setIntroTyped(""); // Re-type intro? 
        // Actually, let's append a funny message
        setHistory([{
            command: "SYSTEM_REBOOT",
            output: <p className="text-green-500">System restored. Please do not delete my portfolio again. ❤️</p>
        }]);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleCommand(input);
        }
    };

    if (!mounted) return null;

    return (
        <>
            {showMatrix && <MatrixRain />}
            {showBomb && <TimeBomb onComplete={onBombComplete} />}

            <div
                className={cn(
                    "w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden border transition-colors duration-500 mx-2 sm:mx-0 relative",
                    theme === "dark"
                        ? "bg-[#1e1e1e] border-gray-800"
                        : "bg-[#fffaf0] border-[#b0b0b0] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)]"
                )}
                onClick={handleContainerClick}
            >
                {/* Terminal Header */}
                <div className={cn(
                    "px-3 py-2 flex items-center justify-between border-b transition-colors duration-500",
                    theme === "dark"
                        ? "bg-[#2d2d2d] border-gray-700"
                        : "bg-[#e2e2e2] border-[#b0b0b0]"
                )}>
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    </div>

                    <div className={cn(
                        "text-xs font-mono flex items-center gap-2",
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                    )}>
                        <Terminal className="w-3 h-3" />
                        yug@portfolio:~
                    </div>
                    <div className="w-16" />
                </div>

                {/* Terminal Content (Scrollable) */}
                <div
                    ref={contentRef}
                    className={cn(
                        "p-4 md:p-8 font-mono h-[70vh] md:h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent transition-colors duration-500 cursor-text",
                        theme === "dark" ? "text-gray-200" : "text-[#586e75]"
                    )}
                >
                    {/* Initial Intro Block (Static-ish) */}
                    <div className="space-y-6 mb-8">
                        {/* Command Line */}
                        <div className="flex gap-2 items-center text-xs md:text-base flex-wrap text-muted-foreground opacity-75">
                            <span>yug@iit : ~ $</span>
                            <span>{introTyped}</span>
                        </div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5, duration: 0.5 }}
                            className="space-y-4"
                        >
                            <div className={cn("space-y-1 text-xs md:text-sm", theme === "dark" ? "text-gray-400" : "text-[#657b83]")}>
                                <p>{">"} Loading artifacts ... [Done]</p>
                                <p>{">"} Compiling spells ... [Done]</p>
                                <p>{">"} Initializing wizardry ... [Done]</p>
                            </div>

                            <div className="py-4 md:py-8">
                                <h1 className={cn(
                                    "text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif mb-4 tracking-tight break-words",
                                    theme === "dark" ? "text-white" : "text-[#b58900]"
                                )}>
                                    HELLO, I AM YUG
                                </h1>
                                <div className={cn(
                                    "flex flex-col md:flex-row gap-2 md:items-center text-base md:text-xl",
                                    theme === "dark" ? "text-gray-300" : "text-[#657b83]"
                                )}>
                                    <span className="flex items-center gap-2">
                                        {">"} <strong className={theme === "dark" ? "text-white" : "text-[#2aa198]"}>Magical Tech Geek</strong>
                                    </span>
                                    <span className={cn("hidden md:inline", theme === "dark" ? "text-gray-600" : "text-[#93a1a1]")}>|</span>
                                    <span className={theme === "dark" ? "text-gray-400" : "text-[#586e75]"}>CS Undergrad @ IIT Kharagpur</span>
                                </div>
                            </div>
                            <p className={cn(
                                "italic text-base md:text-lg leading-relaxed border-l-4 pl-4 py-2 my-4 rounded-r-lg",
                                theme === "dark" ? "border-[#ffbd2e] bg-white/5 text-gray-300" : "border-[#d33682] bg-[#fdf6e3] text-[#657b83]"
                            )}>
                                "Pushing the boundaries of High Performance Computing and Machine Learning. I build systems that scale and intelligence that adapts."
                            </p>

                            <div className="text-sm opacity-80 mt-8">
                                Type <span className="text-primary font-bold">'help'</span> to explore the system.
                            </div>
                        </motion.div>
                    </div>

                    {/* Dynamic History */}
                    <div className="space-y-2">
                        {history.map((item, idx) => (
                            <div key={idx} className="space-y-1">
                                <div className="flex gap-2 items-center text-xs md:text-base">
                                    <span className={theme === "dark" ? "text-[#5af78e]" : "text-[#d33682]"}>yug@iit</span>
                                    <span className="text-muted-foreground">:</span>
                                    <span className={theme === "dark" ? "text-[#57c7ff]" : "text-[#268bd2]"}>~</span>
                                    <span className="text-muted-foreground">$</span>
                                    <span className={theme === "dark" ? "text-gray-100" : "text-[#4e5c5e]"}>{item.command}</span>
                                </div>
                                {item.output && (
                                    <div className={cn("ml-2 md:ml-4 text-sm md:text-base", theme === "dark" ? "text-gray-300" : "text-[#657b83]")}>
                                        {item.output}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Active Input Line */}
                    {!isTyping && (
                        <div className="flex gap-2 items-center text-xs md:text-base mt-2">
                            <span className={theme === "dark" ? "text-[#5af78e]" : "text-[#d33682]"}>yug@iit</span>
                            <span className="text-muted-foreground">:</span>
                            <span className={theme === "dark" ? "text-[#57c7ff]" : "text-[#268bd2]"}>~</span>
                            <span className="text-muted-foreground">$</span>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className={cn(
                                    "bg-transparent border-none outline-none flex-1 font-mono",
                                    theme === "dark" ? "text-gray-100" : "text-[#4e5c5e]"
                                )}
                                autoFocus
                                autoComplete="off"
                                spellCheck={false}
                            />
                        </div>
                    )}
                    <div ref={endRef} />
                </div>
            </div>
        </>
    );
}
