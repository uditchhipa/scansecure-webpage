
"use client";

import { useState } from "react";
import { AnalysisReport } from "../../components/AnalysisReport";
import { FileUploader } from "../../components/FileUploader";
import { Footer } from "../../components/Footer";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function ApkScanner() {
    const [report, setReport] = useState<any>(null);

    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleFileSelect = async (file: File) => {
        setIsAnalyzing(true);
        setReport(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const response = await fetch(`${apiUrl}/upload`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Analysis failed");

            const data = await response.json();
            setReport(data);
        } catch (error) {
            console.error(error);
            alert("Analysis failed. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleReset = () => {
        setReport(null);
    }

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
                    <div className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                        APK Scanner
                    </div>
                </div>
            </header>

            <main className="flex-1 pt-32 pb-20 px-4">
                <div className="max-w-5xl mx-auto space-y-12">
                    {!report ? (
                        <div className="flex flex-col items-center justify-center space-y-8 animate-fade-in-up">
                            <div className="text-center space-y-6 max-w-2xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium animate-fade-in">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    Ready to Analysis
                                </div>
                                <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent pb-2">
                                    App Security Scanner
                                </h1>
                                <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
                                    Upload your .APK or .EXE file to detect hidden malware, spyware, and dangerous permissions instantly.
                                </p>
                            </div>

                            <div className="w-full max-w-xl">
                                <FileUploader
                                    onUpload={handleFileSelect}
                                    isAnalyzing={isAnalyzing}
                                    accept=".apk,.exe,application/vnd.android.package-archive,application/x-msdownload"
                                    description="Supports .APK and .EXE files (Max 100MB)"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center w-full animate-fade-in">
                            <AnalysisReport report={report} />

                            <button
                                onClick={handleReset}
                                className="mt-12 px-8 py-3 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-emerald-500/50 transition-all font-medium"
                            >
                                Scan Another File
                            </button>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
