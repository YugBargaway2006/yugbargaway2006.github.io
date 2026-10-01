"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { Clock } from "lucide-react";

export function IITKGPClock() {
    const [time, setTime] = useState<string>("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const timeZone = "Asia/Kolkata";
            const zonedDate = toZonedTime(now, timeZone);
            setTime(format(zonedDate, "HH:mm:ss"));
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, []);

    if (!time) return null;

    return (
        <a
            href="https://www.google.co.in/maps/place/IIT+Kharagpur,+Main+Academic+Building/@22.3199771,87.3076252,18.33z/data=!4m9!1m2!2m1!1siit+kgp!3m5!1s0x3a1d4404ef05b8c7:0x1ff255c90a52ac18!8m2!3d22.319622!4d87.3098694!16s%2Fg%2F11c46j09xd?entry=ttu&g_ep=EgoyMDI2MDEyNy4wIKXMDSoKLDEwMDc5MjA3M0gBUAM%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-mono text-muted-foreground bg-secondary/30 px-3 py-1 rounded-full border border-border backdrop-blur-sm hover:text-primary hover:border-primary/50 data-[simulated-hover]:text-primary data-[simulated-hover]:border-primary/50 transition-colors"
        >
            <Clock className="w-4 h-4" />
            <span>IIT KGP: {time}</span>
        </a>
    );
}
