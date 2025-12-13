
"use client";

import { Footer } from "../components/Footer";
import { ServiceCard } from "../components/ServiceCard";
import { StatsCounter } from "../components/StatsCounter";
import { FAQSection } from "../components/FAQSection";
import { ShieldCheck, Smartphone, FileText, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30 font-sans flex flex-col">
      {/* Navbar */}
      <header className="fixed top-0 w-full bg-slate-950/80 backdrop-blur-md border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-lg group-hover:bg-emerald-500/40 transition-all duration-500" />
              <div className="relative bg-slate-900 p-2 rounded-xl border border-white/10 group-hover:border-emerald-500/50 transition-colors">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
            <span className="font-bold text-lg tracking-tight">
              Secure<span className="text-emerald-400">Scan</span>
            </span>
          </div>
          <div className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
            v1.0 Live
          </div>
        </div>
      </header>

      <main className="flex-1 pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto space-y-20">

          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              AI-Powered Threat Detection
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent pb-2">
              Analyze Files.<br />Stay Secure.
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Detect hidden malware, spyware, and vulnerabilities instantly using our advanced static analysis engine. Choose your scanner below.
            </p>
          </div>

          <StatsCounter />

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            <ServiceCard
              title="App Scanner"
              description="Deep analyze Android APKs and Windows EXEs. Checks permissions, secrets, and dangerous imports."
              icon={Smartphone}
              href="/apk-scanner"
              color="emerald"
            />
            <ServiceCard
              title="Doc Scanner"
              description="Scan PDF and Text files for malicious scripts and embedded threats. Includes detailed reports."
              icon={FileText}
              href="/doc-scanner"
              color="blue"
            />
            <ServiceCard
              title="URL Scanner"
              description="Check suspicious links for phishing attempts and scam domains before you click."
              icon={Globe}
              href="/url-scanner"
              color="indigo"
            />
          </div>

          <FAQSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
