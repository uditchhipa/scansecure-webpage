
"use client"

import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { AnalysisReport } from '@/components/AnalysisReport';
import { StatsCounter } from '@/components/StatsCounter';
import { FAQSection } from '@/components/FAQSection';
import { Footer } from '@/components/Footer';
import { cn } from '@/utils/cn';
import { Bug, ShieldCheck, Zap, FileText } from 'lucide-react';

export default function Home() {
  const [report, setReport] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanMode, setScanMode] = useState<"app" | "doc">("app");

  const handleUpload = async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    setReport(null);

    const formData = new FormData();
    formData.append("file", file);

    // Use environment variable for production (Vercel), fallback to localhost for dev
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    try {
      const response = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Analysis failed. Please try again.");
      }

      const data = await response.json();

      // Artificial delay for UX "scanning" feel if it's too fast
      setTimeout(() => {
        setReport(data);
        setIsAnalyzing(false);
      }, 1500);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black selection:bg-emerald-500/30">

      {/* Navbar / Header */}
      <header className="border-b border-white/5 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-blue-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              Secure<span className="text-emerald-400">Scan</span>
            </span>
          </div>
          <div className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
            v1.0 Live
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-20">

        {/* Hero Section - Only show if no report */}
        {!report && (
          <div className="text-center mb-16 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium uppercase tracking-wider mb-4 animate-fade-in">
              <Zap className="w-3 h-3" />
              AI-Powered Threat Detection
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 tracking-tight">
              Analyze Files.<br />
              <span className="text-white">Stay Secure.</span>
            </h1>

            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
              Upload your APKs or Executables to detect hidden malware, spyware, and vulnerabilities instantly using our advanced static analysis engine.
            </p>

            {/* Social Proof Stats */}
            <StatsCounter />
          </div>
        )}

        {/* Dynamic Content Area */}
        <div className="relative min-h-[400px]">
          {error && (
            <div className="max-w-xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
              <Bug className="w-5 h-5" />
              {error}
            </div>
          )}

          {!report ? (
            <>
              {/* Mode Switcher Tabs */}
              <div className="flex justify-center mb-8">
                <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/5 backdrop-blur-sm">
                  <button
                    onClick={() => setScanMode("app")}
                    className={cn(
                      "px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2",
                      scanMode === "app"
                        ? "bg-slate-800 text-emerald-400 shadow-lg shadow-emerald-500/10"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    App Scanner
                  </button>
                  <button
                    onClick={() => setScanMode("doc")}
                    className={cn(
                      "px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2",
                      scanMode === "doc"
                        ? "bg-slate-800 text-blue-400 shadow-lg shadow-blue-500/10"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <FileText className="w-4 h-4" />
                    Doc Scanner
                  </button>
                </div>
              </div>

              <FileUploader
                onUpload={handleUpload}
                isAnalyzing={isAnalyzing}
                accept={scanMode === "app" ? ".exe,.apk" : ".pdf,.txt"}
                description={scanMode === "app" ? "Supports .EXE, .APK (Max 100MB)" : "Supports .PDF, .TXT (Max 50MB)"}
              />
            </>
          ) : (
            <AnalysisReport report={report} onReset={() => setReport(null)} />
          )}
        </div>

        {/* SEO FAQ Section */}
        <FAQSection />

      </div>

      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <Footer />
    </main>
  );
}
