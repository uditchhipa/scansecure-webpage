
"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { jsPDF } from "jspdf";
import { AlertTriangle, CheckCircle, ShieldAlert, FileCode, Terminal, Download, ShieldCheck, Coffee } from 'lucide-react';
import { cn } from '@/utils/cn';

interface AnalysisReportProps {
    report: any; // Using any for MVP speed
    onReset?: () => void;
}

export const AnalysisReport: React.FC<AnalysisReportProps> = ({ report, onReset }) => {
    if (!report) return null;

    const isMalicious = report.risk_score >= 5;
    const isUrlScan = !report.file_size && (report.filename?.includes("http") || report.filename?.includes("www"));

    // Configurable styles
    const bgClass = isMalicious
        ? "bg-slate-900/40 border-rose-500/20 shadow-xl shadow-rose-900/10"
        : "bg-slate-900/40 border-emerald-500/20 shadow-xl shadow-emerald-900/10";

    const textClass = isMalicious ? "text-rose-400" : "text-emerald-400";
    const Icon = isMalicious ? ShieldAlert : ShieldCheck;

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.setTextColor(isMalicious ? 220 : 0, isMalicious ? 50 : 150, 50);
        doc.text(isMalicious ? "THREAT DETECTED" : (isUrlScan ? "Safe Link Report" : "Safe File Report"), 20, 20);

        doc.setFontSize(12);
        doc.setTextColor(50, 50, 50);
        doc.text(`Target: ${report.filename}`, 20, 40);
        doc.text(`Risk Score: ${report.risk_score}/10`, 20, 50);
        doc.text(`Scan Date: ${new Date().toLocaleDateString()}`, 20, 60);

        doc.setFontSize(16);
        doc.text("Findings:", 20, 80);

        doc.setFontSize(12);
        if (report.findings.length === 0) {
            doc.text("- No suspicious indicators found.", 20, 90);
        } else {
            report.findings.forEach((finding: string, i: number) => {
                // split long lines
                const lines = doc.splitTextToSize(`- ${finding}`, 170);
                doc.text(lines, 20, 90 + (i * 10));
            });
        }

        doc.save("securescan_report.pdf");
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl mx-auto space-y-8"
        >
            {/* Header Card */}
            <div className={cn("p-8 rounded-3xl border backdrop-blur-md relative overflow-hidden transition-all duration-500", bgClass)}>
                <div className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className={cn("p-5 rounded-2xl shadow-lg border backdrop-blur-sm", isMalicious ? "bg-rose-500/10 border-rose-500/20" : "bg-emerald-500/10 border-emerald-500/20")}>
                            <Icon className={cn("w-12 h-12", textClass, isMalicious && "animate-pulse")} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border", isMalicious ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400")}>
                                    {report.risk_level}
                                </span>
                                {isUrlScan && <span className="text-xs font-mono text-slate-500">URL SCAN</span>}
                            </div>
                            <h2 className="text-3xl font-bold text-white leading-none">
                                {isMalicious ? "Threat Detected" : (isUrlScan ? "Safe Website" : "Safe File")}
                            </h2>
                            <p className="text-slate-400 mt-2 font-mono text-sm max-w-[300px] truncate" title={report.filename}>
                                {report.filename}
                            </p>
                        </div>
                    </div>

                    <div className="text-center md:text-right bg-slate-900/30 p-4 rounded-2xl border border-white/5">
                        <div className="text-5xl font-black text-white tracking-tighter">
                            {report.risk_score}<span className="text-2xl text-slate-600 font-medium">/10</span>
                        </div>
                        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">
                            Risk Score
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Findings List */}
                <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 backdrop-blur-sm min-h-[300px]">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                        Analysis Findings
                    </h3>

                    {report.findings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[200px] text-slate-500 italic gap-2">
                            <CheckCircle className="w-8 h-8 opacity-20" />
                            No suspicious indicators found.
                        </div>
                    ) : (
                        <ul className="space-y-3 h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                            {report.findings.map((finding: string, i: number) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-start gap-3 text-sm text-slate-300 bg-slate-950/50 p-3 rounded-xl border border-white/5"
                                >
                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                                    <span className="leading-relaxed">{finding}</span>
                                </motion.li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Metadata & Actions */}
                <div className="space-y-6">
                    {/* Metadata Card */}
                    <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 backdrop-blur-sm">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Terminal className="w-5 h-5 text-blue-400" />
                            Metadata
                        </h3>
                        <div className="grid grid-cols-1 gap-2">
                            {isUrlScan ? (
                                <>
                                    <div className="flex justify-between p-3 bg-slate-950/30 rounded-lg border border-white/5">
                                        <span className="text-xs text-slate-500 uppercase">Scan Type</span>
                                        <span className="text-sm font-mono text-emerald-400">Heuristic URL Analysis</span>
                                    </div>
                                    <div className="flex justify-between p-3 bg-slate-950/30 rounded-lg border border-white/5">
                                        <span className="text-xs text-slate-500 uppercase">Protocol</span>
                                        <span className="text-sm font-mono text-white">{report.filename.startsWith("https") ? "HTTPS (Secure)" : "HTTP (Insecure)"}</span>
                                    </div>
                                </>
                            ) : (
                                Object.entries(report.metadata || {}).map(([key, value], i) => {
                                    if (['file_structure', 'pe_imports', 'pe_sections'].includes(key)) return null;
                                    const formattedKey = key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                                    return (
                                        <div key={i} className="flex justify-between p-3 bg-slate-950/30 rounded-lg border border-white/5">
                                            <span className="text-xs text-slate-500 uppercase">{formattedKey}</span>
                                            <span className="text-sm font-mono text-white truncate max-w-[150px]">{String(value)}</span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Actions Card */}
                    <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 backdrop-blur-sm flex flex-col gap-4">
                        {isMalicious ? (
                            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                                <h4 className="font-bold text-rose-400 mb-1">Recommendation: Avoid</h4>
                                <p className="text-xs text-rose-300/80 leading-relaxed">
                                    This {isUrlScan ? "link" : "file"} has high risk indicators. Do not assume it is safe.
                                </p>
                            </div>
                        ) : (
                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                <h4 className="font-bold text-emerald-400 mb-1">Recommendation: Safe</h4>
                                <p className="text-xs text-emerald-300/80 leading-relaxed">
                                    Low risk detected. Proceed with standard caution.
                                </p>
                            </div>
                        )}

                        <div className="flex gap-3 mt-2">
                            {onReset && (
                                <button
                                    onClick={onReset}
                                    className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors text-sm flex-1"
                                >
                                    Scan Again
                                </button>
                            )}
                            {!isUrlScan && (
                                <button
                                    onClick={handleDownloadPDF}
                                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:brightness-110 text-white font-bold transition-all shadow-lg hover:shadow-emerald-500/20 text-sm flex-1 flex items-center justify-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    PDF Report
                                </button>
                            )}
                            <a
                                href="https://www.buymeacoffee.com/yourusername" // User can update this
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold transition-all shadow-lg hover:shadow-yellow-500/20 text-sm flex items-center justify-center gap-2"
                            >
                                <Coffee className="w-4 h-4" />
                                Buy Me a Coffee
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reverse Engineering Details (New Section) */}
            {report.metadata && (report.metadata.file_structure || report.metadata.pe_imports) && (
                <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 backdrop-blur-sm mt-6">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <FileCode className="w-5 h-5 text-purple-400" />
                        Package Contents (Deep Scan)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* APK File Structure */}
                        {report.metadata.file_structure && (
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Internal Files ({report.metadata.file_structure.length})</h4>
                                <div className="h-[200px] overflow-y-auto bg-slate-950/50 rounded-xl p-3 border border-white/5 custom-scrollbar font-mono text-xs text-slate-400">
                                    {report.metadata.file_structure.map((file: string, i: number) => (
                                        <div key={i} className="py-1 border-b border-white/5 last:border-0 truncate">
                                            {file}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* PE Imports (EXE) */}
                        {report.metadata.pe_imports && report.metadata.pe_imports.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Imported DLLs & APIs</h4>
                                <div className="h-[200px] overflow-y-auto bg-slate-950/50 rounded-xl p-3 border border-white/5 custom-scrollbar font-mono text-xs text-slate-400">
                                    {report.metadata.pe_imports.map((imp: string, i: number) => (
                                        <div key={i} className="py-1 border-b border-white/5 last:border-0 truncate">
                                            {imp}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* PE Sections (EXE) */}
                        {report.metadata.pe_sections && report.metadata.pe_sections.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Binary Sections</h4>
                                <div className="h-[200px] overflow-y-auto bg-slate-950/50 rounded-xl p-3 border border-white/5 custom-scrollbar font-mono text-xs text-slate-400">
                                    {report.metadata.pe_sections.map((sec: string, i: number) => (
                                        <div key={i} className="py-1 border-b border-white/5 last:border-0 truncate">
                                            {sec}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default AnalysisReport;
