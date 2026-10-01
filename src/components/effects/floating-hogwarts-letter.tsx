"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function FloatingHogwartsLetter() {
    const pathname = usePathname();
    const [isHovered, setIsHovered] = useState(false);
    const [hasBeenClicked, setHasBeenClicked] = useState(false);
    const [showMessage, setShowMessage] = useState(false);

    const letterRef = useRef<HTMLDivElement>(null);
    const controls = useAnimation();

    // Physics State - MUTABLE REFS for performance (no re-renders)
    const state = useRef({
        pos: { x: typeof window !== 'undefined' ? window.innerWidth / 2 : 300, y: 100 },
        vel: { x: 0, y: 0 },
        acc: { x: 0, y: 0 },
        target: { x: 0, y: 0 },
        mode: "EXPLORE" as "EXPLORE" | "HOVER_POI" | "IDLE",
        timer: 0,
        rotation: 0,
        breathingTime: 0
    });

    const [breathingScale, setBreathingScale] = useState(1);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const prevHoveredElement = useRef<Element | null>(null);

    // Track Mouse
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Main Physics Loop
    useEffect(() => {
        if (pathname !== "/contact" && pathname !== "/contact/") return;

        let animationId: number;
        const letterSize = 150;
        const padding = 10; // Minimal padding to allow touching edges

        const updatePhysics = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const s = state.current;

            // 1. STATE MANAGEMENT & TARGET SELECTION
            s.timer--;
            if (s.timer <= 0) {
                // Pick new behavior
                const rand = Math.random();

                if (rand < 0.35) {
                    // TARGET NAVBAR (35% Chance)
                    s.mode = "EXPLORE";
                    s.target = {
                        x: Math.random() * (width - letterSize),
                        // Allow it to go really high up, even slightly offscreen to 'peek'
                        y: -30 + Math.random() * 90 // Range: -30px to 60px
                    };
                    s.timer = 150 + Math.random() * 100;
                } else if (rand < 0.75) {
                    // RANDOM LOWER SCREEN (40% Chance) - FORCE DOWN
                    s.mode = "EXPLORE";
                    s.target = {
                        x: Math.random() * (width - letterSize),
                        // FORCE 50-95% HEIGHT
                        y: height * 0.5 + Math.random() * (height * 0.45 - letterSize)
                    };
                    s.timer = 180 + Math.random() * 120;
                } else {
                    // FULL RANDOM (Idle/Hover combined) (25%)
                    s.mode = "EXPLORE";
                    s.target = {
                        x: Math.random() * (width - letterSize),
                        y: Math.random() * (height - letterSize)
                    };
                    s.timer = 200 + Math.random() * 200;
                }
            }

            // 2. FORCE CALCULATION
            // Reset acceleration
            s.acc = { x: 0, y: 0 };

            // Steering Force towards Target
            if (s.mode === "EXPLORE") {
                const dx = s.target.x - s.pos.x;
                const dy = s.target.y - s.pos.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist > 30) { // Larger arrival radius for smoother stop
                    // Normalize and scale (Seek behavior)
                    const speed = 0.25; // Good realistic force
                    s.acc.x += (dx / dist) * speed;
                    s.acc.y += (dy / dist) * speed;
                }
            } else if (s.mode === "IDLE") {
                // GENTLE HOVER IN PLACE
                // Counteract velocity to stop
                s.acc.x -= s.vel.x * 0.1;
                s.acc.y -= s.vel.y * 0.1;
            }

            // Mouse Repulsion (unless clicked/active)
            const mDx = mousePos.x - s.pos.x - letterSize / 2;
            const mDy = mousePos.y - s.pos.y - letterSize / 2;
            const mDist = Math.sqrt(mDx * mDx + mDy * mDy);

            if (!isHovered && mDist < 200 && mDist > 0) {
                const repelStrength = 0.6;
                s.acc.x -= (mDx / mDist) * repelStrength;
                s.acc.y -= (mDy / mDist) * repelStrength;
            }

            // Noise / Wander (Wind effect) - Smoother wind
            s.acc.x += (Math.random() - 0.5) * 0.08;
            s.acc.y += (Math.random() - 0.5) * 0.08;

            // 3. INTEGRATION (Euler)
            s.vel.x += s.acc.x;
            s.vel.y += s.acc.y;

            // Damping (Friction) - slightly less damping for drift
            s.vel.x *= 0.96;
            s.vel.y *= 0.96;

            // Speed Limit
            const maxSpeed = 10; // Realistic fast drift
            const speedMag = Math.sqrt(s.vel.x ** 2 + s.vel.y ** 2);
            if (speedMag > maxSpeed) {
                s.vel.x = (s.vel.x / speedMag) * maxSpeed;
                s.vel.y = (s.vel.y / speedMag) * maxSpeed;
            }

            // Update Position
            s.pos.x += s.vel.x;
            s.pos.y += s.vel.y;

            // 4. BOUNDARY CHECKS (Bounce/Slide)
            // Allow going slightly negative on Y to hit usage
            if (s.pos.x < padding) { s.pos.x = padding; s.vel.x *= -0.5; }
            if (s.pos.x > width - letterSize - padding) { s.pos.x = width - letterSize - padding; s.vel.x *= -0.5; }
            if (s.pos.y < -30) { s.pos.y = -30; s.vel.y *= -0.5; } // Allow peeking top
            if (s.pos.y > height - letterSize - padding) { s.pos.y = height - letterSize - padding; s.vel.y *= -0.5; }

            // 5. SECONDARY ANIMATIONS (Rotation, Scale)
            // Bank turn: Rotate based on X velocity
            const targetRot = s.vel.x * 2.5;
            s.rotation += (targetRot - s.rotation) * 0.1;

            // Breathing
            s.breathingTime += 0.03;
            const breathe = 1 + Math.sin(s.breathingTime) * 0.03;
            setBreathingScale(breathe);

            // 6. GHOST INTERACTION (Trigger underlying elements)
            if (letterRef.current) {
                // Move DOM
                letterRef.current.style.transform = `translate(${s.pos.x}px, ${s.pos.y}px) rotate(${s.rotation}deg)`;

                // Interaction Check
                const cx = s.pos.x + letterSize / 2;
                const cy = s.pos.y + letterSize / 2;

                // Briefly ignore pointer events to peek
                letterRef.current.style.pointerEvents = 'none';
                const elBelow = document.elementFromPoint(cx, cy);
                letterRef.current.style.pointerEvents = 'auto';

                if (elBelow && elBelow !== prevHoveredElement.current) {
                    // Leave prev
                    if (prevHoveredElement.current) {
                        try {
                            const eventOpts = { bubbles: true, cancelable: true, view: window };
                            prevHoveredElement.current.dispatchEvent(new MouseEvent('mouseleave', eventOpts));
                            prevHoveredElement.current.dispatchEvent(new MouseEvent('mouseout', eventOpts));

                            // SIMULATED HOVER: Remove attribute
                            prevHoveredElement.current.removeAttribute("data-simulated-hover");

                            if (prevHoveredElement.current instanceof HTMLElement) prevHoveredElement.current.blur();
                        } catch (e) { }
                    }
                    // Enter new
                    const interactive = elBelow.closest('a, button, [role="button"], .interactive-card');
                    if (interactive) {
                        const eventOpts = { bubbles: true, cancelable: true, view: window };
                        interactive.dispatchEvent(new MouseEvent('mouseenter', eventOpts));
                        interactive.dispatchEvent(new MouseEvent('mouseover', eventOpts));

                        // SIMULATED HOVER: Manually set attribute for styling
                        interactive.setAttribute("data-simulated-hover", "true");

                        // REMOVED focus() call to prevent stealing focus
                        prevHoveredElement.current = interactive;
                    } else {
                        prevHoveredElement.current = null;
                    }
                }
            }

            animationId = requestAnimationFrame(updatePhysics);
        };

        animationId = requestAnimationFrame(updatePhysics);
        return () => cancelAnimationFrame(animationId);
    }, [mousePos, isHovered, pathname]);

    const handleClick = async () => {
        if (!hasBeenClicked) {
            setHasBeenClicked(true);
            await controls.start({
                rotate: [0, 360],
                scale: [1, 1.3, 1],
                transition: { duration: 0.8, ease: "backOut" },
            });
        } else {
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000);
        }
    };

    if (pathname !== "/contact" && pathname !== "/contact/") return null;

    return (
        <>
            <motion.div
                id="hogwarts-envelope"
                ref={letterRef}
                className="fixed pointer-events-auto cursor-pointer z-[100] touch-none"
                style={{ width: "150px", height: "100px", willChange: "transform" }}
                animate={controls}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleClick}
            >
                <motion.div
                    style={{ scale: breathingScale }}
                    className="relative w-full h-full"
                >
                    <Image
                        src="/hogwarts-letter.png"
                        alt="Hogwarts Letter"
                        fill
                        className="object-contain drop-shadow-2xl"
                        style={{
                            // Magical Tint (Purple/Gold)
                            filter: isHovered
                                ? "drop-shadow(0 0 15px rgba(255, 215, 0, 0.7)) drop-shadow(0 0 30px rgba(128, 0, 128, 0.3)) brightness(1.1)"
                                : "drop-shadow(0 5px 15px rgba(0,0,0,0.2))",
                            transition: "filter 0.3s ease",
                        }}
                        priority
                        unoptimized
                    />

                    {/* Sparkles on Hover */}
                    {isHovered && Array.from({ length: 5 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute bg-yellow-300 rounded-full box-shadow-[0_0_5px_gold]"
                            style={{
                                width: 4, height: 4,
                                left: `${50 + Math.random() * 40 - 20}%`,
                                top: `${50 + Math.random() * 40 - 20}%`
                            }}
                            animate={{
                                y: -40,
                                x: (Math.random() - 0.5) * 30,
                                opacity: [0, 1, 0],
                                scale: [0, 1.5, 0]
                            }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                        />
                    ))}
                </motion.div>
            </motion.div>

            {/* Flash Message - Reverted to Pill Style */}
            {showMessage && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] pointer-events-none"
                >
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl shadow-2xl border-2 border-yellow-400 text-2xl font-bold whitespace-nowrap">
                        ✨ You&apos;re a wizard! ✨
                    </div>
                </motion.div>
            )}
        </>
    );
}
