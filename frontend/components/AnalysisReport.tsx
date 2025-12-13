
"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, ShieldAlert, FileCode, Terminal } from 'lucide-react';
import { cn } from '@/utils/cn';

interface AnalysisReportProps {
    report: any; // Using any for MVP speed, ideally strict type
    onReset: () => void;
}

export const AnalysisReport: React.FC<AnalysisReportProps> = ({ report, onReset }) => {
    if (!report) return null;

    const isMalicious = report.is_malicious;
    const riskColor = isMalicious ? "red" : "emerald";

    // Configurable colors based on risk
    const bgClass = isMalicious ? "bg-red-500/10 border-red-500/20" : "bg-emerald-500/10 border-emerald-500/20";
    const textClass = isMalicious ? "text-red-400" : "text-emerald-400";
    const Icon = isMalicious ? ShieldAlert : CheckCircle;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl mx-auto space-y-6"
        >
            {/* Header Card */}
            <div className={cn("p-8 rounded-3xl border backdrop-blur-md relative overflow-hidden", bgClass)}>
                <div className="absolute top-0 right-0 p-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                    <div className={cn("p-6 rounded-2xl ring-1 ring-white/10 bg-slate-900/50", textClass)}>
                        <Icon className="w-12 h-12" />
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 text-xs font-mono mb-2 text-slate-400 border border-white/5">
                            <FileCode className="w-3 h-3" />
                            {report.type.toUpperCase()} ANALYSIS
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-1">
                            {isMalicious ? "Threat Detected" : "File Seems Safe"}
                        </h2>
                        <p className="text-slate-400">
                            {report.filename} • Risk Level: <span className={cn("font-bold", textClass)}>{report.risk_level}</span>
                        </p>
                    </div>

                    <div className="text-center bg-slate-900/50 p-4 rounded-xl border border-white/5 min-w-[120px]">
                        <div className="text-sm text-slate-500 mb-1">Risk Score</div>
                        <div className={cn("text-4xl font-black", textClass)}>{report.risk_score}/10</div>
                    </div>
                </div>
            </div>

            {/* Recommendation Card */}
            <div className={cn("p-6 rounded-3xl border backdrop-blur-sm relative transition-all duration-300", isMalicious ? "bg-red-500/20 border-red-500/30" : "bg-emerald-500/20 border-emerald-500/30")}>
                <div className="flex items-start gap-4">
                    <div className={cn("p-3 rounded-xl", isMalicious ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400")}>
                        {isMalicious ? <ShieldAlert className="w-8 h-8" /> : <CheckCircle className="w-8 h-8" />}
                    </div>
                    <div className="flex-1">
                        <h3 className={cn("text-xl font-bold mb-1", isMalicious ? "text-red-400" : "text-emerald-400")}>
                            {isMalicious ? "Security Recommendation: DO NOT INSTALL" : "Recommendation: Safe to Proceed"}
                        </h3>
                        <p className="text-slate-300 text-sm mb-3">
                            {isMalicious
                                ? "This file exhibits malicious behavior patterns. Installing it puts your device and data at significant risk."
                                : "No threats were detected in this file. It appears safe to install, but always ensure you downloaded it from a trusted source."}
                        </p>

                        {isMalicious && (
                            <div className="flex flex-col gap-3 mt-4">
                                <div className="flex flex-wrap gap-3">
                                    <a
                                        href={report.type === 'apk' ? "https://play.google.com/store/apps" : "https://www.google.com/search?q=official+site+for+" + report.filename}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors flex items-center gap-2"
                                    >
                                        Get Safe Version from {report.type === 'apk' ? "Google Play" : "Official Site"}
                                    </a>
                                </div>

                                {/* Affiliate Banner Placeholder - High Conversion Spot */}
                                <a
                                    href="https://nordvpn.com/threat-protection/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-4 p-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 border border-amber-500/30 flex items-center justify-between group cursor-pointer hover:border-amber-500/60 transition-colors"
                                >
                                    <div>
                                        <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">Recommended Protection</div>
                                        <div className="text-white font-semibold">Your PC might be vulnerable. Scan with NordVPN Threat Protection.</div>
                                    </div>
                                    <div className="px-4 py-2 bg-amber-500 text-slate-900 font-bold rounded-lg text-sm group-hover:bg-amber-400 transition-colors">
                                        Fix Now
                                    </div>
                                </a>
                            </div>
                        )}
                        {!isMalicious && (
                            <div className="flex flex-col gap-3 mt-2">
                                <div className="flex flex-wrap gap-3">
                                    <span className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-semibold border border-emerald-500/30 flex items-center gap-2 cursor-default">
                                        <CheckCircle className="w-4 h-4" />
                                        Verified Safe
                                    </span>
                                </div>

                                {/* Soft Monetization for Safe Users */}
                                <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-white/5">
                                    <span className="text-slate-400 text-sm">Help us keep this tool free!</span>
                                    <a href="https://www.buymeacoffee.com/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors text-sm font-bold">
                                        <span>☕</span> Buy me a coffee
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Findings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                        Key Findings
                    </h3>

                    {report.findings.length === 0 ? (
                        <div className="text-slate-500 italic py-4">No suspicious indicators found.</div>
                    ) : (
                        <ul className="space-y-3">
                            {report.findings.map((finding: string, i: number) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-start gap-3 text-sm text-slate-300 bg-slate-800/50 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                                >
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                                    {finding}
                                </motion.li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-blue-400" />
                        Metadata
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {Object.entries(report.metadata).map(([key, value], i) => {
                            // Hide complex objects that have their own sections
                            if (['file_structure', 'pe_imports', 'pe_sections'].includes(key)) return null;

                            // Format key: "section_text_entropy" -> "Section Text Entropy"
                            const formattedKey = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

                            return (
                                <div key={i} className="flex flex-col bg-slate-800/30 p-3 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1 opacity-70">{formattedKey}</span>
                                    <span className="text-sm text-white font-medium truncate" title={String(value)}>{String(value)}</span>
                                </div>
                            );
                        })}
                        {Object.keys(report.metadata).filter(k => !['file_structure', 'pe_imports', 'pe_sections'].includes(k)).length === 0 && (
                            <div className="text-slate-500 italic py-4 col-span-2 text-center text-sm">No additional metadata available.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* APK File Structure Viewer */}
            {report.metadata.file_structure && (
                <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <FileCode className="w-5 h-5 text-purple-400" />
                        Package Contents
                    </h3>
                    <div className="h-64 overflow-y-auto pr-2 custom-scrollbar bg-slate-950/50 rounded-xl border border-white/5 p-4 font-mono text-xs text-slate-400">
                        {report.metadata.file_structure.map((file: string, i: number) => (
                            <div key={i} className="py-1 border-b border-white/5 last:border-0 hover:text-white transition-colors cursor-default">
                                {file}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* EXE Imports Viewer */}
            {report.metadata.pe_imports && report.metadata.pe_imports.length > 0 && (
                <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-blue-400" />
                        PE Imports
                    </h3>
                    <div className="h-64 overflow-y-auto pr-2 custom-scrollbar bg-slate-950/50 rounded-xl border border-white/5 p-4 font-mono text-xs text-slate-400">
                        {report.metadata.pe_imports.map((imp: string, i: number) => (
                            <div key={i} className="py-1 border-b border-white/5 last:border-0 hover:text-white transition-colors cursor-default">
                                {imp}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* EXE Sections Viewer */}
            {report.metadata.pe_sections && report.metadata.pe_sections.length > 0 && (
                <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-amber-400" />
                        PE Sections
                    </h3>
                    <div className="h-40 overflow-y-auto pr-2 custom-scrollbar bg-slate-950/50 rounded-xl border border-white/5 p-4 font-mono text-xs text-slate-400">
                        {report.metadata.pe_sections.map((sec: string, i: number) => (
                            <div key={i} className="py-1 border-b border-white/5 last:border-0 hover:text-white transition-colors cursor-default">
                                {sec}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex justify-center pt-8">
                <button
                    onClick={onReset}
                    className="px-8 py-3 rounded-full bg-white text-slate-900 font-bold hover:bg-slate-200 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200"
                >
                    Analyze Another File
                </button>
            </div>
        </motion.div>
    );
};
