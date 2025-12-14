
"use client";

import React, { useEffect, useState, useRef } from "react";

const TERMINAL_LINES = [
    "Initializing SecureScan v3.0...",
    "Connecting to secure cloud nodes...",
    "Bypassing firewall...",
    "Access granted.",
    "> Analyzing file structure...",
    "> extracting_manifest.xml... OK",
    "> scanning_classes.dex... [HEURISTIC_ANALYSIS]",
    "> Checking for known signatures...",
    "> decrypting_strings... DONE",
    "> Detecting C2 communication channels...",
    "> analyzing_permissions... [READ_SMS, CAMERA, INTERNET]",
    "WARNING: Suspicious pattern detected in network_module.js",
    "> cross_referencing virus_total_db...",
    "> analyzing_bytecodes...",
    "Optimizing results...",
    "Finalizing protection report...",
    "Done."
];

export default function TerminalLog() {
    const [lines, setLines] = useState<string[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            if (index < TERMINAL_LINES.length) {
                setLines((prev) => [...prev, TERMINAL_LINES[index]]);
                index++;
            } else {
                clearInterval(interval);
            }
        }, 300); // Add a line every 300ms

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [lines]);

    return (
        <div className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden bg-slate-950 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)] font-mono text-xs md:text-sm">
            {/* Terminal Header */}
            <div className="bg-slate-900 px-4 py-2 border-b border-emerald-500/20 flex items-center justify-between">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="text-emerald-500/60 text-xs">root@securescan:~</div>
            </div>

            {/* Terminal Body */}
            <div
                ref={scrollRef}
                className="h-64 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-1"
            >
                {lines.map((line, i) => (
                    <div
                        key={i}
                        className={`transition-opacity duration-300 ${line.includes("WARNING")
                                ? "text-amber-400 font-bold"
                                : line.startsWith(">")
                                    ? "text-emerald-400"
                                    : "text-slate-400"
                            }`}
                    >
                        <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                        {line}
                    </div>
                ))}
                {/* Blinking Cursor */}
                <div className="w-2 h-4 bg-emerald-500 ml-1 inline-block align-middle animate-pulse" />
            </div>
        </div>
    );
}
