"use client";

import React from "react";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

const faqs = [
    {
        q: "Is SecureScan really free?",
        a: "Yes! Our APK and EXE malware scanner is 100% free to use. We rely on donations and affiliate partners to keep the servers running.",
    },
    {
        q: "How does the malware detection work?",
        a: "We use advanced static analysis to inspect the internal structure of your files (Imports, Permissions, Sections) without executing them, making it safe and fast.",
    },
    {
        q: "Can I scan text or PDF files?",
        a: "Currently, we specialize in executable files (.exe) and Android apps (.apk) as these pose the highest security risk to your devices.",
    },
    {
        q: "Do you save my files?",
        a: "No. Your privacy is our priority. Files are analyzed in temporary memory and are permanently deleted immediately after the analysis report is generated.",
    },
];

export const FAQSection = () => {
    return (
        <div className="max-w-3xl mx-auto mt-24 mb-12 px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                    <HelpCircle className="w-8 h-8 text-emerald-400" />
                    Frequently Asked Questions
                </h2>
                <p className="text-slate-400">
                    Everything you need to know about our secure file scanning technology.
                </p>
            </div>

            <div className="space-y-4">
                {faqs.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 hover:bg-slate-900/60 transition-colors"
                    >
                        <h3 className="text-lg font-semibold text-white mb-2">{item.q}</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">{item.a}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
