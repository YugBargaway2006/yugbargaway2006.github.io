"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";

export function FloatingHogwartsLetter() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const [hasBeenClicked, setHasBeenClicked] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const letterRef = useRef<HTMLDivElement>(null);
    const controls = useAnimation();

    // Physics state
    const position = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 - 75 : 300, y: 100 });
    const velocity = useRef({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(0);
    const [skew, setSkew] = useState({ x: 0, y: 0 });
    const [breathingScale, setBreathingScale] = useState(1);
    const [isCurious, setIsCurious] = useState(false);
    const lastCuriosityTime = useRef(0);
    const isAnimating = useRef(false);
    const explorationTarget = useRef({ x: 400, y: 200 });
    const explorationCooldown = useRef(0);

    // Track mouse position
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        const handleKeyDown = () => {
            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 3000);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    // Breathing animation
    useEffect(() => {
        let time = 0;
        const breathe = () => {
            time += 0.016;
            const scale = 1 + Math.sin(time * 1.5) * 0.02;
            setBreathingScale(scale);
            requestAnimationFrame(breathe);
        };
        const breatheId = requestAnimationFrame(breathe);
        return () => cancelAnimationFrame(breatheId);
    }, []);

    // Physics-based floating animation
    useEffect(() => {
        let animationId: number;
        let time = 0;
        let autonomousRotation = 0;

        const animate = () => {
            time += 0.016;

            const width = window.innerWidth;
            const height = window.innerHeight;
            const letterSize = 150;

            // Calculate distance to mouse
            const dx = mousePos.x - position.current.x - letterSize / 2;
            const dy = mousePos.y - position.current.y - letterSize / 2;
            const distToMouse = Math.sqrt(dx * dx + dy * dy);

            // === EXPLORATION BEHAVIOR - VERY STRONG, NO GRAVITY ===
            explorationCooldown.current -= 1;

            if (explorationCooldown.current <= 0) {
                // Create exploration targets WEIGHTED TOWARD NAVBAR BUTTONS & UPPER AREAS
                const targets = [
                    // Navbar buttons - precise locations (y: 0.04-0.11) - 8 targets
                    { x: width * 0.15, y: height * 0.06 }, // Logo area
                    { x: width * 0.33, y: height * 0.08 }, // About
                    { x: width * 0.42, y: height * 0.08 }, // Experience
                    { x: width * 0.52, y: height * 0.08 }, // Projects
                    { x: width * 0.63, y: height * 0.08 }, // Achievements
                    { x: width * 0.73, y: height * 0.08 }, // Contact
                    { x: width * 0.85, y: height * 0.06 }, // Social icons
                    { x: width * 0.92, y: height * 0.08 }, // Theme toggle
                    // Upper area (y: 0.15-0.35) - 8 targets
                    { x: width * 0.15, y: height * 0.15 },
                    { x: width * 0.5, y: height * 0.18 },
                    { x: width * 0.85, y: height * 0.22 },
                    { x: width * 0.3, y: height * 0.25 },
                    { x: width * 0.7, y: height * 0.28 },
                    { x: width * 0.25, y: height * 0.32 },
                    { x: width * 0.55, y: height * 0.2 },
                    { x: width * 0.75, y: height * 0.3 },
                    // Middle (y: 0.35-0.55) - 4 targets
                    { x: width * 0.2, y: height * 0.38 },
                    { x: width * 0.5, y: height * 0.42 },
                    { x: width * 0.8, y: height * 0.48 },
                    { x: width * 0.35, y: height * 0.52 },
                    // Lower (y: 0.55-0.7) - 2 targets only
                    { x: width * 0.4, y: height * 0.6 },
                    { x: width * 0.65, y: height * 0.65 },
                    // Sides - upper/middle heights only
                    { x: width * 0.08, y: height * 0.2 },
                    { x: width * 0.92, y: height * 0.25 },
                    { x: width * 0.1, y: height * 0.4 },
                    { x: width * 0.9, y: height * 0.35 },
                ];
                explorationTarget.current = targets[Math.floor(Math.random() * targets.length)];
                explorationCooldown.current = 70 + Math.random() * 30; // 1.1-1.6s
            }

            // Move toward exploration target - DOMINANT FORCE
            const toTargetX = explorationTarget.current.x - position.current.x;
            const toTargetY = explorationTarget.current.y - position.current.y;
            const distToTarget = Math.sqrt(toTargetX * toTargetX + toTargetY * toTargetY);

            if (distToTarget > 50) {
                const exploreForce = 0.35; // VERY DOMINANT
                velocity.current.x += (toTargetX / distToTarget) * exploreForce;
                velocity.current.y += (toTargetY / distToTarget) * exploreForce;
            }

            // === CURIOSITY BEHAVIOR ===
            const timeSinceLastCuriosity = time - lastCuriosityTime.current;
            if (!isCurious && timeSinceLastCuriosity > 8 && Math.random() < 0.003) {
                setIsCurious(true);
                lastCuriosityTime.current = time;
                setTimeout(() => setIsCurious(false), 4000);
            }

            // === MOUSE INTERACTIONS ===
            const repelRadius = 180;
            const attractRadius = 400;
            const curiousRadius = 600;

            if (!isHovered) {
                if (isCurious) {
                    // When curious, actively approach the cursor
                    if (distToMouse > 120 && distToMouse < curiousRadius) {
                        const force = 0.08;
                        velocity.current.x += (dx / distToMouse) * force;
                        velocity.current.y += (dy / distToMouse) * force;
                    }
                } else {
                    // Normal behavior: repulsion when close
                    if (distToMouse < repelRadius && distToMouse > 0) {
                        const force = (repelRadius - distToMouse) / repelRadius;
                        velocity.current.x -= (dx / distToMouse) * force * 1.2;
                        velocity.current.y -= (dy / distToMouse) * force * 1.2;
                    }
                    // Gentle attraction when at medium distance
                    else if (distToMouse > repelRadius && distToMouse < attractRadius) {
                        const force = 0.02;
                        velocity.current.x += (dx / distToMouse) * force;
                        velocity.current.y += (dy / distToMouse) * force;
                    }
                }
            }

            // === MINIMAL DRIFT - truly neutral ===
            const driftX = Math.sin(time * 0.8) * 0.08;
            const driftY = Math.sin(time * 1.1 + Math.PI / 2) * 0.08; // Same pattern as X, just phase-shifted
            velocity.current.x += driftX;
            velocity.current.y += driftY;

            // === GENTLE UPWARD BIAS to counteract subtle downward tendency ===
            velocity.current.y -= 0.03; // Gentle constant upward force

            // === CONTENT AREA ATTRACTION ===
            if (isTyping) {
                const formCenterX = width * 0.65;
                const formCenterY = height * 0.35; // Moved up from 0.45
                const toFormX = formCenterX - position.current.x;
                const toFormY = formCenterY - position.current.y;
                velocity.current.x += toFormX * 0.01;
                velocity.current.y += toFormY * 0.01;
            }

            // === RANDOM LIVELINESS ===
            if (Math.random() < 0.03) {
                velocity.current.x += (Math.random() - 0.5) * 3;
                velocity.current.y += (Math.random() - 0.5) * 3;
                autonomousRotation += (Math.random() - 0.5) * 20;
            }

            // === DAMPING ===
            velocity.current.x *= 0.93;
            velocity.current.y *= 0.93;

            // === SPEED LIMIT ===
            const speed = Math.sqrt(velocity.current.x ** 2 + velocity.current.y ** 2);
            const maxSpeed = 8;
            if (speed > maxSpeed) {
                velocity.current.x = (velocity.current.x / speed) * maxSpeed;
                velocity.current.y = (velocity.current.y / speed) * maxSpeed;
            }

            // === FOLDING EFFECT ===
            const velocityMagnitude = Math.sqrt(velocity.current.x ** 2 + velocity.current.y ** 2);
            const skewIntensity = Math.min(velocityMagnitude * 2.5, 12);
            const skewX = (velocity.current.y / (velocityMagnitude + 0.1)) * skewIntensity;
            const skewY = (velocity.current.x / (velocityMagnitude + 0.1)) * skewIntensity;
            setSkew({ x: skewX, y: skewY });

            // === UPDATE POSITION ===
            position.current.x += velocity.current.x;
            position.current.y += velocity.current.y;

            // === BOUNDARIES - STRONG edge forces ===
            const padding = 60;

            // Very strong repelling force from edges
            if (position.current.x < padding) {
                const edgeForce = (padding - position.current.x) * 0.15;
                velocity.current.x += edgeForce;
            }
            if (position.current.x > width - letterSize - padding) {
                const edgeForce = (width - letterSize - padding - position.current.x) * 0.15;
                velocity.current.x += edgeForce;
            }
            if (position.current.y < padding) {
                const edgeForce = (padding - position.current.y) * 0.15;
                velocity.current.y += edgeForce;
            }
            if (position.current.y > height - letterSize - padding) {
                const edgeForce = (height - letterSize - padding - position.current.y) * 0.15;
                velocity.current.y += edgeForce;
            }

            // Hard limits
            position.current.x = Math.max(40, Math.min(width - letterSize - 40, position.current.x));
            position.current.y = Math.max(40, Math.min(height - letterSize - 40, position.current.y));

            // === ROTATION ===
            autonomousRotation += Math.sin(time * 0.8) * 0.5;
            autonomousRotation *= 0.92;

            const velocityRotation = Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI);
            const targetRotation = velocityRotation * 0.3 + autonomousRotation;
            setRotation((prev) => prev + (targetRotation - prev) * 0.1);

            // === UPDATE DOM ===
            if (letterRef.current) {
                letterRef.current.style.transform = `translate(${position.current.x}px, ${position.current.y}px) rotate(${rotation}deg)`;
            }
            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationId);
    }, [mousePos, isHovered, isTyping, rotation, isCurious]);

    // Click handlers
    const handleClick = async () => {
        if (!hasBeenClicked) {
            setHasBeenClicked(true);
            isAnimating.current = true;
            await controls.start({
                rotate: [rotation, rotation + 360], // First click: 360 degree rotation
                scale: [1, 1.2, 1],
                transition: { duration: 1, ease: "easeOut" },
            });
            isAnimating.current = false;
        } else {
            // Second click: show wizard message
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000);
        }
    };

    const handleDoubleClick = async () => {
        isAnimating.current = true;
        await controls.start({
            rotateY: [0, 360],
            rotateX: [0, 360],
            scale: [1, 1.3, 1],
            transition: { duration: 1.2, ease: "easeInOut" },
        });
        isAnimating.current = false;
    };

    return (
        <>
            <motion.div
                ref={letterRef}
                className="fixed pointer-events-auto cursor-pointer z-30"
                style={{
                    width: "150px",
                    height: "100px",
                    willChange: "transform",
                }}
                animate={controls}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
            >
                <motion.div
                    style={{
                        scale: breathingScale,
                        skew: `${skew.x}deg ${skew.y}deg`,
                    }}
                    className="relative w-full h-full"
                >
                    <Image
                        src="/hogwarts-letter.png"
                        alt="Hogwarts Letter"
                        fill
                        className="object-contain drop-shadow-2xl"
                        style={{
                            filter: isHovered ? "drop-shadow(0 0 20px rgba(255, 0, 0, 0.6))" : "drop-shadow(0 10px 25px rgba(0,0,0,0.3))",
                            transition: "filter 0.3s ease",
                            imageRendering: "crisp-edges",
                        }}
                        priority
                        unoptimized
                    />

                    {/* Sparkles on hover */}
                    {isHovered && (
                        <>
                            {[...Array(8)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                    }}
                                    animate={{
                                        y: [-20, -60],
                                        opacity: [0, 1, 0],
                                        scale: [0, 1.5, 0],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        delay: i * 0.15,
                                    }}
                                />
                            ))}
                        </>
                    )}
                </motion.div>
            </motion.div>

            {/* Message popup */}
            {showMessage && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
                >
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl shadow-2xl border-2 border-yellow-400 text-2xl font-bold">
                        ✨ You're a wizard! ✨
                    </div>
                </motion.div>
            )}
        </>
    );
}
