"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface SmokeParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    angle: number;
    spin: number;
    hue: number;
}

export function FluidCursor() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles: SmokeParticle[] = [];

        const createSmokeBurst = (x: number, y: number) => {
            const hue = Math.random() * 360;
            const particleCount = 50;

            for (let i = 0; i < particleCount; i++) {
                const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
                const speed = 0.5 + Math.random() * 2;

                particles.push({
                    x,
                    y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 0,
                    maxLife: 80 + Math.random() * 60,
                    size: 20 + Math.random() * 40,
                    angle: Math.random() * Math.PI * 2,
                    spin: (Math.random() - 0.5) * 0.05,
                    hue: hue + (Math.random() - 0.5) * 60,
                });
            }
        };

        // Click handler - only on background
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isInteractive = target.closest(
                'button, a, input, textarea, select, [role="button"], [role="link"], .card, nav, header, footer'
            );

            if (!isInteractive) {
                createSmokeBurst(e.clientX, e.clientY);
            }
        };

        window.addEventListener("click", handleClick);

        // Animation loop
        let animationId: number;
        const animate = () => {
            // Clear canvas completely for transparency
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];

                // Physics
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.99;
                p.vy *= 0.99;
                p.vy -= 0.02;
                p.angle += p.spin;
                p.size += 0.5;
                p.life++;

                // Remove dead particles
                if (p.life > p.maxLife) {
                    particles.splice(i, 1);
                    continue;
                }

                // Alpha based on life
                const lifeRatio = p.life / p.maxLife;
                const alpha = (1 - lifeRatio) * 0.4;

                // Draw smoke blob
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.angle);

                // Outer glow
                const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
                gradient.addColorStop(0, `hsla(${p.hue}, 80%, 60%, ${alpha})`);
                gradient.addColorStop(0.4, `hsla(${p.hue + 20}, 70%, 55%, ${alpha * 0.6})`);
                gradient.addColorStop(0.7, `hsla(${p.hue + 40}, 60%, 50%, ${alpha * 0.3})`);
                gradient.addColorStop(1, `hsla(${p.hue + 60}, 50%, 45%, 0)`);

                ctx.fillStyle = gradient;
                ctx.fillRect(-p.size, -p.size, p.size * 2, p.size * 2);

                // Inner bright core
                const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 0.3);
                coreGradient.addColorStop(0, `hsla(${p.hue}, 100%, 70%, ${alpha * 0.8})`);
                coreGradient.addColorStop(1, `hsla(${p.hue + 30}, 90%, 60%, 0)`);

                ctx.fillStyle = coreGradient;
                ctx.fillRect(-p.size * 0.3, -p.size * 0.3, p.size * 0.6, p.size * 0.6);

                ctx.restore();
            }

            animationId = requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("click", handleClick);
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationId);
        };
    }, [theme]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none w-full h-full"
            style={{
                zIndex: 1,
                mixBlendMode: theme === "dark" ? "screen" : "multiply",
            }}
        />
    );
}
