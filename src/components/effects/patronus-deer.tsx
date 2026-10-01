"use client";

import { motion } from "framer-motion";

interface FoldVanishProps {
    onComplete: () => void;
    formRect: DOMRect;
}

export function FlooNetworkPortal({ onComplete, formRect }: FoldVanishProps) {
    return (
        <motion.div
            className="fixed z-50 pointer-events-none"
            style={{
                left: formRect.left,
                top: formRect.top,
                width: formRect.width,
                height: formRect.height,
            }}
            initial={{ opacity: 1 }}
            animate={{
                scaleY: [1, 0.5, 0.1, 0],
                scaleX: [1, 0.95, 0.5, 0],
                rotateX: [0, -45, -90, -90],
                y: [0, 20, 40, 60],
                opacity: [1, 0.8, 0.4, 0],
            }}
            transition={{
                duration: 1.2,
                times: [0, 0.4, 0.7, 1],
                ease: "easeInOut",
            }}
            onAnimationComplete={onComplete}
        >
            <div
                className="w-full h-full backdrop-blur-md bg-card/60 rounded-lg border border-border shadow-lg"
                style={{
                    transformStyle: "preserve-3d",
                    perspective: "1000px",
                }}
            >
                {/* Fold line indicators */}
                <div className="absolute inset-x-0 top-1/3 h-px bg-border/30" />
                <div className="absolute inset-x-0 top-2/3 h-px bg-border/30" />
            </div>
        </motion.div>
    );
}
