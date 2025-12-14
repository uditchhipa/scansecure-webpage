
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Grid Points Logic (Reusing the stable logic)
const ATTACK_TYPES = [
    { color: "bg-red-500", label: "Malware Blocked" },
    { color: "bg-orange-500", label: "Phishing Attempt" },
    { color: "bg-yellow-500", label: "Suspicious IP" },
    { color: "bg-emerald-500", label: "Scan Clean" },
];

export const ThreatMap = () => {
    const [attacks, setAttacks] = useState<any[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            // Random coordinates within general "Map" zones
            const zones = [
                { x: 200, y: 150, w: 150, h: 100 }, // NA
                { x: 450, y: 130, w: 100, h: 80 },  // EU
                { x: 600, y: 120, w: 200, h: 150 }, // Asia
                { x: 280, y: 350, w: 100, h: 150 }, // SA
                { x: 480, y: 300, w: 120, h: 120 }, // Africa
                { x: 750, y: 380, w: 100, h: 80 },  // Aus
            ];

            const zone = zones[Math.floor(Math.random() * zones.length)];
            const randomX = zone.x + Math.random() * zone.w;
            const randomY = zone.y + Math.random() * zone.h;

            const randomType = ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)];

            const newAttack = {
                id: Date.now(),
                x: randomX,
                y: randomY,
                type: randomType,
            };

            setAttacks(prev => [...prev.slice(-15), newAttack]);
        }, 600);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-5xl mx-auto h-[450px] relative bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl mb-12 group">

            {/* 1. Base Grid (Subtle) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

            {/* 2. World Map with "Dotted" Effect using Pattern */}
            <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                    <pattern id="dotPattern" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1" className="fill-emerald-500/20" />
                    </pattern>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Manual High-Res outlines approx */}
                <g fill="url(#dotPattern)" filter="url(#glow)" className="opacity-60">
                    <path d="M 68.3 84.7 L 173.2 59.8 L 331.4 69.2 L 359.2 163.7 L 298.5 258.1 L 227.1 270.8 L 193.8 221.7 L 138.2 173.3 L 68.3 84.7 Z" /> {/* NA */}
                    <path d="M 314.4 285.1 L 415.2 297.8 L 442.2 360.5 L 375.5 481.1 L 320.7 453.3 L 298.5 351.0 L 314.4 285.1 Z" /> {/* SA */}
                    <path d="M 436.6 220.9 L 526.3 216.9 L 596.1 236.7 L 602.5 316.9 L 553.3 408.1 L 493.0 384.3 L 439.8 281.2 L 436.6 220.9 Z" /> {/* Africa */}
                    <path d="M 419.1 169.2 L 507.2 108.9 L 558.0 162.9 L 513.6 200.2 L 444.5 194.6 L 419.1 169.2 Z" /> {/* Europe */}
                    <path d="M 573.9 160.5 L 759.6 98.6 L 872.2 89.9 L 916.7 185.9 L 811.2 262.1 L 655.6 229.5 L 573.9 160.5 Z" /> {/* Asia */}
                    <path d="M 765.9 337.5 L 876.2 338.3 L 888.1 411.3 L 804.0 427.1 L 765.9 337.5 Z" /> {/* Aus */}
                </g>
            </svg>

            {/* 3. Header HUD */}
            <div className="absolute top-6 left-6 flex items-center gap-3 bg-slate-900/80 backdrop-blur px-4 py-2 rounded-full border border-emerald-500/30">
                <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-50" />
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold tracking-widest">THREAT INTELLIGENCE: LIVE</span>
            </div>

            {/* 4. Attack Pings */}
            {attacks.map(attack => (
                <div
                    key={attack.id}
                    className="absolute"
                    style={{ left: `${(attack.x / 1000) * 100}%`, top: `${(attack.y / 500) * 100}%` }}
                >
                    <div className="relative group/ping">
                        <motion.div
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: 4, opacity: 0 }}
                            transition={{ duration: 2 }}
                            className={`absolute -inset-4 rounded-full ${attack.type.color} opacity-40 border border-white/20`}
                        />
                        <div className={`w-1.5 h-1.5 rounded-full ${attack.type.color} shadow-[0_0_15px_currentColor] bg-white`} />

                        {/* Connecting Line to Label */}
                        <div className="hidden group-hover/ping:block absolute left-2 top-2 w-8 h-[1px] bg-emerald-500/50 rotate-[-45deg] origin-top-left" />

                        {/* Hover Data Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            className="absolute left-6 -top-4 bg-slate-900/90 text-xs whitespace-nowrap px-3 py-2 rounded border border-emerald-500/30 text-emerald-100 shadow-xl backdrop-blur-md z-10 hidden group-hover/ping:block"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`w-1 h-1 rounded-full ${attack.type.color}`} />
                                <span className="font-bold text-[10px] uppercase text-slate-400">Threat Detected</span>
                            </div>
                            <div className="font-mono">{attack.type.label}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">IP: 192.168.0.{Math.floor(Math.random() * 255)}</div>
                        </motion.div>
                    </div>
                </div>
            ))}

            {/* 5. Cinematic Scan Line */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent h-[40px] w-full animate-scan-line pointer-events-none blur-[1px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,rgba(2,6,23,0.6)_100%)] pointer-events-none" /> {/* Vignette */}
        </div>
    );
};
