"use client";

import { Footer } from "../components/Footer";
import { ServiceCard } from "../components/ServiceCard";
import { StatsCounter } from "../components/StatsCounter";
import { FAQSection } from "../components/FAQSection";
import { ThreatMap } from "../components/ThreatMap";
import { Shield, ArrowRight, FileText, Smartphone, Globe, ShieldCheck, LogIn } from "lucide-react";
import { Navbar } from "../components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30">

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-20">

          {/* Hero Content */}
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


          <ThreatMap />
          <StatsCounter />

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
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
            <ServiceCard
              title="Privacy Tool"
              description="Remove hidden GPS location and device metadata from your photos before sharing."
              icon={Shield}
              href="/tools/metadata"
              color="rose"
            />
            <ServiceCard
              title="Website Auditor"
              description="Check your site's health. Scan SSL, Headers, and Privacy leaks."
              icon={Globe}
              href="/tools/auditor"
              color="indigo"
            />
          </div>

          <FAQSection />
        </div>
      </section>
      <Footer />
    </div>
  );
}
