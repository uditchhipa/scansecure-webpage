"use client";

import { useState, useEffect } from "react";
import { Loader2, Server, ShieldCheck, ShieldAlert, Circle } from "lucide-react";

interface PortResult {
    port: number;
    service: string;
    status: "open" | "closed" | "error";
}

interface PortScannerProps {
    url: string;
}

export function PortScanner({ url }: PortScannerProps) {
    const [ports, setPorts] = useState<PortResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [scanned, setScanned] = useState(false);

    const startScan = async () => {
        setLoading(true);
        setError("");
        setPorts([]);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";
            const res = await fetch(`${API_URL}/tools/scan-ports`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }), // URLRequest model matches this
            });

            if (!res.ok) throw new Error("Scan failed");

            const data = await res.json();
            setPorts(data.ports);
            setScanned(true);
        } catch (err) {
            setError("Failed to verify ports. Host might be blocking scans.");
        } finally {
            setLoading(false);
        }
    };

    // Auto-start scan when component mounts if desired, or manual
    // Let's make it manual or distinct button? 
    // User wants "next tool", so inside Auditor it should probably self-trigger or have a "Deep Scan" button.
    // Let's auto-trigger if url is present.
    useEffect(() => {
        if (url && !scanned && !loading) {
            // startScan(); // Optional: Auto-scan
        }
    }, [url]);

    return (
        <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 mt-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                        <Server className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-white">Port Analysis</h3>
                        <p className="text-slate-400 text-sm">Checking exposed services on {url}</p>
                    </div>
                </div>

                {!loading && !scanned && (
                    <button
                        onClick={startScan}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg transition-colors"
                    >
                        Start Scan
                    </button>
                )}

                {loading && (
                    <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold animate-pulse">
                        <Loader2 className="w-4 h-4 animate-spin" /> Scanning Ports...
                    </div>
                )}
            </div>

            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm mb-4">
                    {error}
                </div>
            )}

            {scanned && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 animate-fade-in">
                    {ports.map((p) => (
                        <div key={p.port} className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${p.status === "open" ? "bg-red-500/10 border-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]" :
                                "bg-slate-950/50 border-white/5 text-slate-500 opacity-60"
                            }`}>
                            <div className="text-xs font-bold uppercase tracking-wider opacity-70">{p.service}</div>
                            <div className="text-xl font-bold font-mono">{p.port}</div>
                            <div className="text-[10px] flex items-center gap-1">
                                {p.status === "open" ? <><ShieldAlert className="w-3 h-3" /> OPEN</> : "CLOSED"}
                            </div>
                        </div>
                    ))}

                    {ports.length === 0 && !loading && (
                        <div className="col-span-full text-center text-slate-500 italic py-4">
                            No open ports detected (or firewall blocked scan).
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
