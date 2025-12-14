"use client";

import { useState } from "react";
import { AnalysisReport } from "../../components/AnalysisReport";
import { Footer } from "../../components/Footer";
import { Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import TerminalLog from "../../components/TerminalLog";

export default function UrlScanner() {
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [report, setReport] = useState<any>(null);

    const handleScan = async () => {
        if (!url) return;
        setIsLoading(true);
        setReport(null);

        try {
            // Force Minimum 3 Second "Hacker Processing" Time
            const minTimePromise = new Promise(resolve => setTimeout(resolve, 3000));

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";
            const responsePromise = fetch(`${apiUrl}/scan-url`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });

            // Wait for both results
            const [_, response] = await Promise.all([minTimePromise, responsePromise]);

            const data = await response.json();
            setReport(data);
        } catch (error) {
            console.error(error);
            alert("Failed to scan URL");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30 font-sans flex flex-col">
            {/* Navbar */}
            <header className="fixed top-0 w-full bg-slate-950/80 backdrop-blur-md border-b border-white/10 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-lg group-hover:bg-emerald-500/40 transition-all duration-500" />
                            <div className="relative bg-slate-900 p-2 rounded-xl border border-white/10 group-hover:border-emerald-500/50 transition-colors">
                                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                            </div>
                        </div>
                        <span className="font-bold text-lg tracking-tight">
                            Secure<span className="text-emerald-400">Scan</span>
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/20 border border-emerald-500/20">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-mono text-emerald-500">SYSTEM: ONLINE</span>
                        </div>
                        <div className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                            URL Scanner
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 pt-32 pb-20 px-4">
                <div className="max-w-3xl mx-auto space-y-12">

                    {!report ? (
                        <>
                            <div className="text-center space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium animate-fade-in">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    Phishing Detection Active
                                </div>
                                <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent pb-2">
                                    Is this link safe?
                                </h1>
                                <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                                    Paste any website URL below to instantly detect phishing attempts, scams, and malicious domains using our AI-powered engine.
                                </p>
                            </div>

                            {isLoading ? (
                                <div className="animate-fade-in">
                                    <div className="text-center mb-6">
                                        <h3 className="text-xl font-bold text-emerald-400 animate-pulse">
                                            TRACING NETWORK PATH...
                                        </h3>
                                        <p className="text-slate-500 text-sm">Validating SSL certificates & DNS records...</p>
                                    </div>
                                    <TerminalLog />
                                </div>
                            ) : (
                                <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl">
                                    <div className="flex gap-4">
                                        <div className="relative flex-1">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Search className="h-5 w-5 text-slate-500" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Can you trust this link? (e.g. http://login-update-bank.com)"
                                                className="block w-full pl-10 pr-3 py-4 border border-slate-700 rounded-xl leading-5 bg-slate-950/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-lg transition-all"
                                                value={url}
                                                onChange={(e) => setUrl(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                                            />
                                        </div>
                                        <button
                                            onClick={handleScan}
                                            disabled={isLoading || !url}
                                            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold text-white transition-all shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            Scan URL
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <AnalysisReport report={report} />
                    )}

                </div>
            </main>
            <Footer />
        </div>
    );
}
