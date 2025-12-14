import { FileText, Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface Scan {
    id: number;
    filename: string;
    file_type: string;
    verdict: string;
    timestamp: string;
    details: string;
}

export function ScanHistoryTable({ scans }: { scans: Scan[] }) {
    if (scans.length === 0) {
        return (
            <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-xl">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="mb-4">No scans recorded yet.</p>
                <a href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-sm font-medium">
                    <Shield className="w-4 h-4" /> Start a New Scan
                </a>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="text-xs font-mono text-slate-500 border-b border-white/5">
                        <th className="p-4 font-normal">STATUS</th>
                        <th className="p-4 font-normal">FILENAME</th>
                        <th className="p-4 font-normal">TYPE</th>
                        <th className="p-4 font-normal">DATE</th>
                        <th className="p-4 font-normal">DETAILS</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {scans.map((scan) => (
                        <tr key={scan.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="p-4">
                                {scan.verdict === "Safe" && <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded text-xs"><CheckCircle className="w-3 h-3" /> Safe</span>}
                                {scan.verdict === "Suspicious" && <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2 py-1 rounded text-xs"><AlertTriangle className="w-3 h-3" /> Warning</span>}
                                {scan.verdict === "Malicious" && <span className="inline-flex items-center gap-1 text-red-400 bg-red-400/10 px-2 py-1 rounded text-xs"><Shield className="w-3 h-3" /> Threat</span>}
                            </td>
                            <td className="p-4 font-medium text-slate-200">{scan.filename}</td>
                            <td className="p-4 text-slate-400 uppercase text-xs">{scan.file_type}</td>
                            <td className="p-4 text-slate-400 text-xs font-mono">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(scan.timestamp).toLocaleDateString()}</span>
                            </td>
                            <td className="p-4 max-w-xs truncate text-slate-500 text-xs">{scan.details}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
