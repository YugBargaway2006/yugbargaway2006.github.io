"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Terminal, Send, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { InteractiveTerminal } from "@/components/interactive-terminal";

export default function Home() {
  const { theme } = useTheme();
  // Avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] p-4">
      {/* Interactive Terminal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full flex justify-center"
      >
        <InteractiveTerminal />
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="flex flex-col sm:flex-row gap-4 mt-12 w-full max-w-4xl justify-center md:justify-start"
      >
        <Link href="/projects">
          <Button size="lg" variant="outline" className="group text-lg px-8 border-primary/50 hover:bg-primary/10 hover:text-primary">
            {"</>"} View Artifacts
          </Button>
        </Link>
        <Link href="/contact">
          <Button size="lg" className="text-lg px-8 bg-[#ffd700] text-black hover:bg-[#ffd700]/90 font-bold">
            <Send className="mr-2 w-4 h-4" /> Contact Me
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
