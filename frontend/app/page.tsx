
"use client"

import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { AnalysisReport } from '@/components/AnalysisReport';
import { Bug, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  const [report, setReport] = useState<any>(null); // Type 'any' for MVP
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    setReport(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/upload", {
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
          <a href="https://github.com/your-repo" target="_blank" className="text-xs font-mono text-slate-500 hover:text-white transition-colors">
            v1.0.0-beta
          </a>
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

            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Upload your APKs or Executables to detect hidden malware, spyware, and vulnerabilities instantly using our advanced static analysis engine.
            </p>
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
            <FileUploader onUpload={handleUpload} isAnalyzing={isAnalyzing} />
          ) : (
            <AnalysisReport report={report} onReset={() => setReport(null)} />
          )}
        </div>

      </div>

      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

    </main>
  );
}
