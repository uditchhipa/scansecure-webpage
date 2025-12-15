"use client";

import { useState } from "react";
import { Upload, Shield, ShieldAlert, Download, RefreshCw, Smartphone, MapPin, Calendar, Camera } from "lucide-react";
import { Navbar } from "../../../components/Navbar";

export default function MetadataCleaner() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [metadata, setMetadata] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [cleaning, setCleaning] = useState(false);
    const [cleanedUrl, setCleanedUrl] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"analyze" | "spoof" | "bulk">("analyze");
    const [spoofLat, setSpoofLat] = useState("28.6139");
    const [spoofLon, setSpoofLon] = useState("77.2090"); // Default: New Delhi
    const [bulkFiles, setBulkFiles] = useState<FileList | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selected = e.target.files[0];
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
            setMetadata(null);
            setCleanedUrl(null);
        }
    };

    const analyzeImage = async () => {
        if (!file) return;
        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";
            const res = await fetch(`${API_URL}/tools/analyze-metadata`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`
                },
                body: formData,
            });
            const data = await res.json();
            setMetadata(data);
        } catch (err) {
            console.error(err);
            alert("Analysis failed.");
        } finally {
            setLoading(false);
        }
    };

    const cleanImage = async () => {
        if (!file) return;
        setCleaning(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";
            const res = await fetch(`${API_URL}/tools/clean-metadata`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`
                },
                body: formData,
            });

            if (res.ok) {
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                setCleanedUrl(url);
            } else {
                alert("Failed to clean image.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setCleaning(false);
        }
    };

    const spoofImage = async () => {
        if (!file) return;
        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("lat", spoofLat);
        formData.append("lon", spoofLon);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";
            const res = await fetch(`${API_URL}/tools/spoof-metadata`, {
                method: "POST",
                headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
                body: formData,
            });

            if (res.ok) {
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                setCleanedUrl(url);
            } else {
                alert("Spoofing failed.");
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleBulkUpload = async () => {
        if (!bulkFiles || bulkFiles.length === 0) return;
        setCleaning(true);
        const formData = new FormData();
        Array.from(bulkFiles).forEach(f => formData.append("files", f));

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";
            console.log("Sending bulk request...");
            const res = await fetch(`${API_URL}/tools/bulk-clean`, {
                method: "POST",
                headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
                body: formData,
            });

            if (res.ok) {
                console.log("Bulk request successful. Downloading...");
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `clean_images_${Date.now()}.zip`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                const errText = await res.text();
                console.error("Bulk Failure:", errText);
                alert(`Bulk clean failed: ${res.statusText} (${res.status})\n${errText}`);
            }
        } catch (err) {
            console.error("Network Error:", err);
            alert("Network Error: Failed to reach server.");
        }
        finally { setCleaning(false); }
    };

    const hasSensitiveData = metadata && (metadata["GPSInfo"] || metadata["Make"] || metadata["Model"]);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30">
            <Navbar />

            <main className="max-w-6xl mx-auto px-6 py-12">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">
                        Advanced Privacy Tool
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Analyze hidden secrets, clean them, or spoof them. You decide.
                    </p>
                </div>

                {/* Social Media Warning Banner */}
                <div className="mb-10 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start gap-3 max-w-3xl mx-auto">
                    <ShieldAlert className="w-6 h-6 text-yellow-500 shrink-0 mt-1" />
                    <div>
                        <h4 className="font-bold text-yellow-400 text-sm">WhatsApp & Social Media Users</h4>
                        <p className="text-xs text-yellow-200/80 mt-1 leading-relaxed">
                            Photos sent via WhatsApp, Facebook, or Instagram are <strong>automatically stripped of metadata</strong> by their servers.
                            If you upload a photo from WhatsApp, it will say "No Data Found" because
                            <strong> Mark Zuckerberg already cleaned it for you.</strong> Use the <strong>Spoofer</strong> tab to add fake data back in!
                        </p>
                    </div>
                </div>

                <div className="flex justify-center mb-8 gap-4">
                    <button onClick={() => setActiveTab("analyze")} className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${activeTab === "analyze" ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                        🔍 Analyze & Clean
                    </button>
                    <button onClick={() => setActiveTab("spoof")} className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${activeTab === "spoof" ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/25' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                        📍 GPS Spoofer
                    </button>
                    <button onClick={() => setActiveTab("bulk")} className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${activeTab === "bulk" ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                        📂 Bulk Cleaner
                    </button>
                </div>

                {activeTab === "analyze" && (
                    <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
                        {/* Existing Analyze UI - Left */}
                        <div className="space-y-6">
                            <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${file ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-700 hover:border-slate-500 hover:bg-slate-900'}`}>
                                {preview ? (
                                    <div className="space-y-4">
                                        <img src={preview} alt="Preview" className="max-h-80 mx-auto rounded-lg shadow-lg" />
                                        <button onClick={() => document.getElementById('file-upload')?.click()} className="text-sm text-slate-400 hover:text-white">Change Image</button>
                                    </div>
                                ) : (
                                    <div onClick={() => document.getElementById('file-upload')?.click()} className="cursor-pointer space-y-4">
                                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                                            <Upload className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg">Click to Upload Photo</p>
                                            <p className="text-slate-500 text-sm">Supports JPG, PNG</p>
                                        </div>
                                    </div>
                                )}
                                <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                            </div>

                            {file && !metadata && (
                                <button onClick={analyzeImage} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2">
                                    {loading ? <RefreshCw className="animate-spin" /> : <ShieldAlert />} Scan for Hidden Data
                                </button>
                            )}
                        </div>

                        {/* Existing Analyze UI - Right */}
                        <div className="space-y-6">
                            {metadata ? (
                                <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 shadow-xl animate-fade-in">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        {hasSensitiveData ? <span className="text-red-400 flex items-center gap-2"><ShieldAlert /> Hidden Data Found!</span> : <span className="text-emerald-400 flex items-center gap-2"><Shield /> Image is Safe-ish</span>}
                                    </h3>

                                    <div className="space-y-4 mb-8">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className={`p-4 rounded-lg border ${metadata["Decimal Latitude"] ? 'bg-red-500/10 border-red-500/20' : 'bg-slate-800 border-white/5'}`}>
                                                <div className="text-xs text-slate-500 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> GPS Location</div>
                                                {metadata["Decimal Latitude"] ? (
                                                    <div className="space-y-2">
                                                        <div className="font-mono text-sm text-red-400">
                                                            {Number(metadata["Decimal Latitude"]).toFixed(4)}, {Number(metadata["Decimal Longitude"]).toFixed(4)}
                                                        </div>
                                                        <a href={metadata["Google Maps Link"]} target="_blank" rel="noopener noreferrer" className="text-xs bg-red-500/20 hover:bg-red-500/40 text-red-300 px-2 py-1 rounded flex items-center gap-1 w-fit transition-colors cursor-pointer pointer-events-auto relative z-10">
                                                            <MapPin className="w-3 h-3" /> View on Map
                                                        </a>
                                                    </div>
                                                ) : <div className="font-mono text-sm text-slate-400">Not Found</div>}
                                            </div>
                                            <div className={`p-4 rounded-lg border ${metadata.Model ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-slate-800 border-white/5'}`}>
                                                <div className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Smartphone className="w-3 h-3" /> Device</div>
                                                <div className={`font-mono text-sm ${metadata.Model ? 'text-yellow-400' : 'text-slate-400'}`}>{metadata.Model || "Unknown"}</div>
                                            </div>
                                        </div>

                                        {/* Raw Data List */}
                                        <div className="bg-slate-950 rounded-lg p-4 max-h-60 overflow-y-auto text-xs font-mono">
                                            {Object.entries(metadata).map(([key, value]) => (
                                                key !== "GPSInfo" && (
                                                    <div key={key} className="flex justify-between py-1 border-b border-white/5 last:border-0">
                                                        <span className="text-slate-500">{key}</span>
                                                        <span className="text-slate-300 truncate max-w-[150px]">{String(value)}</span>
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    </div>

                                    {cleanedUrl ? (
                                        <a href={cleanedUrl} download={`clean_${file?.name}`} className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2">
                                            <Download /> Download Clean Image
                                        </a>
                                    ) : (
                                        <button onClick={cleanImage} disabled={cleaning} className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2">
                                            {cleaning ? <RefreshCw className="animate-spin" /> : <Shield />} Remove All Metadata
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-600 border border-white/5 rounded-2xl p-8 bg-slate-900/50">
                                    <Camera className="w-16 h-16 mb-4 opacity-20" />
                                    <p>Upload an image to see what's hidden inside.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "spoof" && (
                    <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
                        <div className="bg-slate-900 border border-white/5 p-8 rounded-2xl shadow-xl">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-amber-500">
                                <MapPin /> Fake Location Generator
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Upload Photo</label>
                                    <input type="file" onChange={handleFileChange} className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-700" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">New Latitude</label>
                                        <input type="text" value={spoofLat} onChange={e => setSpoofLat(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">New Longitude</label>
                                        <input type="text" value={spoofLon} onChange={e => setSpoofLon(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white" />
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500">Tip: Default is New Delhi. Try 51.5074, -0.1278 for London.</p>

                                {cleanedUrl ? (
                                    <a href={cleanedUrl} download={`spoofed_${file?.name}`} className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-4">
                                        <Download /> Download Fake Location Image
                                    </a>
                                ) : (
                                    <button onClick={spoofImage} disabled={loading} className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-4">
                                        {loading ? <RefreshCw className="animate-spin" /> : <MapPin />} Inject Fake GPS
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "bulk" && (
                    <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
                        <div className="bg-slate-900 border border-white/5 p-8 rounded-2xl shadow-xl text-center">
                            <h3 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2 text-emerald-500">
                                <RefreshCw /> Bulk Meta Cleaner
                            </h3>

                            <div className="border-2 border-dashed border-slate-700 rounded-2xl p-10 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all">
                                <input
                                    type="file"
                                    multiple
                                    onChange={(e) => setBulkFiles(e.target.files)}
                                    className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-700"
                                />
                                <p className="mt-4 text-slate-500">Select up to 50 images. We will strip them and zip them.</p>
                            </div>

                            <button onClick={handleBulkUpload} disabled={cleaning || !bulkFiles} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed">
                                {cleaning ? <RefreshCw className="animate-spin" /> : <Download />} Clean & Download ZIP
                            </button>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
