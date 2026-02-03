"use client";

import { useCallback } from "react";
import type { Container, Engine } from "tsparticles-engine";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

export function ParticlesBackground() {
    const { theme } = useTheme();

    const particlesInit = useCallback(async (engine: Engine) => {
        await loadSlim(engine);
    }, []);

    const particlesLoaded = useCallback(async (container: Container | undefined) => {
        // container loaded
    }, []);

    const color = theme === "dark" ? "#ffd700" : "#6a1b9a"; // Gold in dark, Purple in light
    const linkedColor = theme === "dark" ? "#ffffff" : "#2c2c2c";

    const pathname = usePathname();

    return (
        <Particles
            id="tsparticles"
            key={pathname === "/contact" ? "contact-particles" : "global-particles"}
            init={particlesInit}
            loaded={particlesLoaded}
            className="absolute inset-0 z-0 animate-fade-in pointer-events-none"
            options={{
                background: {
                    color: {
                        value: "transparent",
                    },
                },
                fpsLimit: 120,
                interactivity: {
                    events: {
                        onClick: {
                            enable: false,
                        },
                        onHover: {
                            enable: true,
                            mode: "repulse",
                        },
                        // Enable interaction with the floating envelope
                        onDiv: {
                            selectors: "#hogwarts-envelope",
                            enable: true,
                            mode: "repulse",
                            type: "rectangle"
                        },
                        resize: true,
                    },
                    modes: {
                        push: {
                            quantity: 4,
                        },
                        repulse: {
                            distance: 100,
                            duration: 0.4,
                        },
                    },
                },
                particles: {
                    color: {
                        value: color,
                    },
                    links: {
                        color: linkedColor,
                        distance: 150,
                        enable: true,
                        opacity: 0.2,
                        width: 1,
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: false,
                        speed: 1,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 800,
                        },
                        value: 50,
                    },
                    opacity: {
                        value: 0.3,
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 1, max: 3 },
                    },
                },
                detectRetina: true,
            }}
        />
    );
}
