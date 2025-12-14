"use client";

import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { FAQSection } from "../../components/FAQSection";

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30">
            <Navbar />

            <main className="pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-6 text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Everything you need to know about our security analysis engine.
                    </p>
                </div>

                {/* Reuse the existing FAQ component */}
                <FAQSection />
            </main>

            <Footer />
        </div>
    );
}
