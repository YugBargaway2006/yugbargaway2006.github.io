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
    const position = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 - 75 : 300, y: typeof window !== 'undefined' ? window.innerHeight / 2 - 50 : 200 });
    const velocity = useRef({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(0);
    const [skew, setSkew] = useState({ x: 0, y: 0 });
    const [breathingScale, setBreathingScale] = useState(1);
    const [isCurious, setIsCurious] = useState(false);
    const lastCuriosityTime = useRef(0);
    const isAnimating = useRef(false);
    const explorationTarget = useRef({ x: 400, y: 300 });
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

            // === EXPLORATION BEHAVIOR - Travel to different page areas ===
            explorationCooldown.current -= 1;

            if (explorationCooldown.current <= 0) {
                // Target ALL areas - 9 diverse locations
                const targets = [
                    { x: width * 0.15, y: height * 0.2 },
                    { x: width * 0.5, y: height * 0.15 },
                    { x: width * 0.85, y: height * 0.25 },
                    { x: width * 0.2, y: height * 0.5 },
                    { x: width * 0.5, y: height * 0.4 },
                    { x: width * 0.8, y: height * 0.5 },
                    { x: width * 0.25, y: height * 0.75 },
                    { x: width * 0.5, y: height * 0.7 },
                    { x: width * 0.75, y: height * 0.65 },
                ];
                explorationTarget.current = targets[Math.floor(Math.random() * targets.length)];
                explorationCooldown.current = 100 + Math.random() * 50; // 1.5-2.5s faster
            }

            // Move toward exploration target
            const toTargetX = explorationTarget.current.x - position.current.x;
            const toTargetY = explorationTarget.current.y - position.current.y;
            const distToTarget = Math.sqrt(toTargetX * toTargetX + toTargetY * toTargetY);

            if (distToTarget > 50) {
                const exploreForce = 0.15; // MASSIVELY INCREASED from 0.02!
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
            const repelRadius = 220;
            const attractRadius = 450;
            const curiousRadius = 700;

            if (!isHovered) {
                if (isCurious) {
                    // When curious, actively approach the cursor
                    if (distToMouse > 120 && distToMouse < curiousRadius) {
                        const force = 0.05;
                        velocity.current.x += (dx / distToMouse) * force;
                        velocity.current.y += (dy / distToMouse) * force;
                    }
                } else {
                    // Normal behavior: weaker repulsion
                    if (distToMouse < repelRadius && distToMouse > 0) {
                        const force = (repelRadius - distToMouse) / repelRadius;
                        velocity.current.x -= (dx / distToMouse) * force * 0.8; // Reduced from 1.8
                        velocity.current.y -= (dy / distToMouse) * force * 0.8;
                    }
                    // Gentle attraction when at medium distance
                    else if (distToMouse > repelRadius && distToMouse < attractRadius) {
                        const force = 0.015;
                        velocity.current.x += (dx / distToMouse) * force;
                        velocity.current.y += (dy / distToMouse) * force;
                    }
                }
            }

            // === ACTIVE DRIFT - Much weaker ===
            const driftX = Math.sin(time * 0.9) * 0.3 + Math.cos(time * 1.3) * 0.2; // Halved
            const driftY = Math.cos(time * 1.1) * 0.25 + Math.sin(time * 0.7) * 0.15; // Halved
            velocity.current.x += driftX;
            velocity.current.y += driftY;

            // === TYPING ATTRACTION ===
            if (isTyping) {
                const formCenterX = width * 0.65;
                const formCenterY = height * 0.5;
                const toFormX = formCenterX - position.current.x;
                const toFormY = formCenterY - position.current.y;
                velocity.current.x += toFormX * 0.004;
                velocity.current.y += toFormY * 0.004;
            }

            // === RANDOM LIVELINESS ===
            if (Math.random() < 0.04) {
                velocity.current.x += (Math.random() - 0.5) * 4;
                velocity.current.y += (Math.random() - 0.5) * 4;
                autonomousRotation += (Math.random() - 0.5) * 25;
            }

            // === DAMPING ===
            velocity.current.x *= 0.90;
            velocity.current.y *= 0.90;

            // === SPEED LIMIT ===
            const speed = Math.sqrt(velocity.current.x ** 2 + velocity.current.y ** 2);
            const maxSpeed = 6;
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

            // === BOUNDARIES - Soft forces from edges ===
            const padding = 80;

            // Gentle repelling force from edges instead of hard bounce
            if (position.current.x < padding) {
                const edgeForce = (padding - position.current.x) * 0.08;
                velocity.current.x += edgeForce;
            }
            if (position.current.x > width - letterSize - padding) {
                const edgeForce = (width - letterSize - padding - position.current.x) * 0.08;
                velocity.current.x += edgeForce;
            }
            if (position.current.y < padding) {
                const edgeForce = (padding - position.current.y) * 0.08;
                velocity.current.y += edgeForce;
            }
            if (position.current.y > height - letterSize - padding) {
                const edgeForce = (height - letterSize - padding - position.current.y) * 0.08;
                velocity.current.y += edgeForce;
            }

            // Hard limits
            position.current.x = Math.max(50, Math.min(width - letterSize - 50, position.current.x));
            position.current.y = Math.max(50, Math.min(height - letterSize - 50, position.current.y));

            // === ROTATION ===
            autonomousRotation += Math.sin(time * 0.8) * 0.5;
            autonomousRotation *= 0.90;

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
                rotate: [rotation, rotation + 720],
                scale: [1, 1.2, 1],
                transition: { duration: 1, ease: "easeOut" },
            });
            isAnimating.current = false;
        } else {
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000);
        }
    };

    const handleDoubleClick = async () => {
        isAnimating.current = true;
        await controls.start({
            rotateY: [0, 360],
            scale: [1, 1.3, 1],
            transition: { duration: 0.8, ease: "easeInOut" },
        });
        isAnimating.current = false;
    };

    return (
        <>
            <div
                ref={letterRef}
                className="fixed pointer-events-auto cursor-pointer z-40"
                style={{
                    width: "150px",
                    height: "105px",
                    willChange: "transform",
                }}
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* The letter */}
                <motion.div
                    className="relative w-full h-full"
                    animate={controls}
                    style={{
                        transform: `scale(${breathingScale}) skewX(${skew.x}deg) skewY(${skew.y}deg)`,
                    }}
                >
                    <Image
                        src={`/hogwarts-letter.png?v=${Date.now()}`}
                        alt="Hogwarts Letter"
                        fill
                        className="object-contain drop-shadow-xl"
                        draggable={false}
                        unoptimized
                    />

                    {/* Wax seal glow */}
                    {isHovered && (
                        <motion.div
                            className="absolute top-1/2 left-1/2 w-8 h-8 bg-red-500/30 rounded-full blur-md"
                            style={{ transform: "translate(-50%, -50%)" }}
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.3, 0.7, 0.3],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                            }}
                        />
                    )}

                    {/* Magic sparkles */}
                    {isHovered && (
                        <>
                            {[...Array(4)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                                    style={{
                                        left: `${20 + i * 25}%`,
                                        top: `${30 + i * 15}%`,
                                    }}
                                    animate={{
                                        y: [-10, -40],
                                        x: [(Math.random() - 0.5) * 15, (Math.random() - 0.5) * 25],
                                        opacity: [1, 0],
                                        scale: [0, 1.5, 0],
                                    }}
                                    transition={{
                                        duration: 1.2,
                                        repeat: Infinity,
                                        delay: i * 0.25,
                                    }}
                                />
                            ))}
                        </>
                    )}
                </motion.div>
            </div>

            {/* Easter egg message */}
            {showMessage && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
                >
                    <div className="bg-card/95 backdrop-blur-md border-2 border-primary p-8 rounded-lg shadow-2xl">
                        <p className="text-2xl font-serif text-center mb-2">
                            ✨ You&apos;re a wizard! ✨
                        </p>
                        <p className="text-muted-foreground text-center text-sm">
                            Your message will be delivered by owl post 🦉
                        </p>
                    </div>
                </motion.div>
            )}
        </>
    );
}
