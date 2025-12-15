"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ShieldCheck, Lock, Globe, AlertTriangle, CheckCircle, XCircle, Search, Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function SiteAuditor() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState<any>(null);

    const FIXES: Record<string, string> = {
        "SSL Encryption": "Install a free Let's Encrypt InfoSec certificate. Run 'sudo certbot --nginx' (or --apache).",
        "HSTS": "Add to Nginx: 'add_header Strict-Transport-Security max-age=31536000;'.",
        "Clickjacking Protection": "Prevent Clickjacking. Nginx: 'add_header X-Frame-Options DENY;'. Apache: 'Header always append X-Frame-Options DENY'.",
        "XSS Protection (CSP)": "Define allowed sources. Example: \"default-src 'self'; script-src 'self' https://trusted.com\".",
        "No-Sniff": "Stop MIME sniffing. Add 'add_header X-Content-Type-Options nosniff;'.",
        "Server Privacy": "Hide server version. Nginx: 'server_tokens off;'. Apache: 'ServerSignature Off' and 'ServerTokens Prod'."
    };

    const handleAudit = async () => {
        if (!url) return;
        setLoading(true);
        setReport(null);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";
            const payload: any = { url };

            const res = await fetch(`${API_URL}/tools/audit-site`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`
                },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            setReport(data);
        } catch (err) {
            console.error(err);
            alert("Audit failed. Ensure backend is running.");
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = async () => {
        const element = document.getElementById("audit-report");
        if (!element) return;
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`audit_report_${new Date().toISOString().slice(0, 10)}.pdf`);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
            <Navbar />

            <main className="max-w-5xl mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Website Security Auditor
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Is your website safe? Scan for SSL issues, missing security headers, and privacy leaks.
                    </p>
                </div>

                {/* Input Section */}
                <div className="max-w-2xl mx-auto mb-12">
                    <div className="bg-slate-900 p-2 rounded-xl border border-white/5 space-y-2">
                        <div className="relative flex items-center bg-slate-950 rounded-lg p-2 border border-white/5">
                            <Globe className="ml-4 text-slate-500 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Your Website (e.g. example.com)"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="bg-transparent border-none focus:ring-0 text-white flex-1 px-4 py-2 placeholder:text-slate-600"
                            />
                        </div>

                        <button
                            onClick={handleAudit}
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-bold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 mt-2"
                        >
                            {loading ? "Scanning..." : "Audit Site"}
                        </button>
                    </div>
                </div>

                {/* Report Section */}
                {/* Report Section */}
                {report && (
                    <div id="audit-report" className="animate-fade-in space-y-8">

                        {/* Error Message */}
                        {report.error && (
                            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-300">
                                <AlertTriangle className="w-5 h-5 shrink-0" />
                                <div>
                                    <h3 className="font-bold text-sm">Scan Failed</h3>
                                    <p className="text-xs opacity-75">{report.error}</p>
                                </div>
                            </div>
                        )}

                        {/* Comparison View */}
                        {report.mode === 'comparison' && !report.error && (
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* User Card */}
                                <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 text-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                                    <h3 className="text-xl font-bold text-slate-300 mb-2">You</h3>
                                    <div className="text-5xl font-black text-blue-400 mb-2">{report.user?.score ?? '?'}</div>
                                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${report.user?.grade === 'A' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>Grade {report.user?.grade ?? 'N/A'}</div>
                                </div>
                                {/* Competitor Card */}
                                <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 text-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
                                    <h3 className="text-xl font-bold text-slate-300 mb-2">Competitor</h3>
                                    <div className="text-5xl font-black text-indigo-400 mb-2">{report.competitor?.score ?? '?'}</div>
                                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${report.competitor?.grade === 'A' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>Grade {report.competitor?.grade ?? 'N/A'}</div>
                                </div>
                            </div>
                        )}

                        {/* Header */}
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Security Audit Report</h2>
                                <p className="text-slate-400 text-sm">Target: {report.url}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Security Score</span>
                                <div className={`text-6xl font-black ${report.score >= 90 ? 'text-emerald-400' : report.score >= 80 ? 'text-blue-400' : report.score >= 50 ? 'text-yellow-400' : 'text-red-500'}`}>
                                    {report.score}
                                </div>
                            </div>
                        </div>

                        {/* Checks Grid */}
                        <div className="grid md:grid-cols-2 gap-4 mb-8 relative z-10">
                            {report.error ? (
                                <div className="col-span-2 text-center text-slate-500 italic py-8">
                                    Unable to load detailed checks due to error.
                                </div>
                            ) : (
                                report.checks?.map((check: any, idx: number) => (
                                    <div key={idx} className={`p-4 rounded-xl border flex items-start gap-4 ${check.status === 'pass' ? 'bg-emerald-500/5 border-emerald-500/10' : check.status === 'fail' ? 'bg-red-500/5 border-red-500/10' : 'bg-yellow-500/5 border-yellow-500/10'}`}>
                                        <div className={`mt-1 p-1 rounded-full ${check.status === 'pass' ? 'bg-emerald-500/20 text-emerald-400' : check.status === 'fail' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                            {check.status === 'pass' ? <CheckCircle className="w-4 h-4" /> : check.status === 'fail' ? <XCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className={`font-bold text-sm ${check.status === 'pass' ? 'text-emerald-200' : check.status === 'fail' ? 'text-red-200' : 'text-yellow-200'}`}>{check.name}</h4>
                                            <p className="text-xs text-slate-400 mt-1">{check.msg}</p>

                                            {/* Fix Tip */}
                                            {check.status !== 'pass' && (
                                                <div className="mt-3 p-3 bg-slate-950/50 rounded-lg border border-white/5 text-xs font-mono">
                                                    <div className="flex items-center gap-2 mb-1 text-indigo-400 font-bold uppercase tracking-wider text-[10px]">
                                                        <Lock className="w-3 h-3" /> Pro Fix
                                                    </div>
                                                    <p className="text-slate-300">
                                                        {FIXES[check.name] || "Consult your server administrator."}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )))}
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-white/5 relative z-10">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <ShieldCheck className="w-4 h-4" />
                                <span>Generated by ScanSecure Auditor</span>
                            </div>
                            <button onClick={downloadPDF} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-bold text-white transition-colors">
                                <Download className="w-4 h-4" /> Download PDF
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
