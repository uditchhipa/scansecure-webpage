"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Copy, RefreshCw, LogOut, LayoutDashboard, Shield, History, Wallet, ShieldCheck, Activity, Calendar, FileText, Key } from "lucide-react";
import Link from "next/link";
import { ScanHistoryTable } from "../../components/ScanHistoryTable";

interface Scan {
    id: number;
    filename: string;
    file_type: string;
    verdict: string;
    timestamp: string;
    details: string;
}

interface UserData {
    id: number;
    email: string;
    api_key: string;
    is_active: boolean;
    scans?: Scan[];
}

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [scans, setScans] = useState<Scan[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

    useEffect(() => {
        // Prevent hydration mismatch by moving all logic into useEffect
        let token = localStorage.getItem("token");
        if (!token) {
            // AUTO-GUEST MODE (Reverted Auth)
            localStorage.setItem("token", "guest_token");
            token = "guest_token";
        }

        if (token === "guest_token") {
            // GUEST MODE MOCK DATA
            setUser({
                id: 0,
                email: "guest@scansecure.io",
                api_key: "demo_sk_guest_mode_active",
                is_active: true
            });
            setScans([
                { id: 101, filename: "suspicious_installer.exe", file_type: "exe", verdict: "Suspicious", timestamp: new Date().toISOString(), details: "Heuristic analysis detected packed code." },
                { id: 102, filename: "clean_document.pdf", file_type: "pdf", verdict: "Safe", timestamp: new Date(Date.now() - 86400000).toISOString(), details: "No threats found." },
                { id: 103, filename: "malware_sample.apk", file_type: "apk", verdict: "Malicious", timestamp: new Date(Date.now() - 172800000).toISOString(), details: "Known signature found: Trojan.Android.Spy" }
            ]);
            setLoading(false);
            return;
        }

        const fetchUserData = async () => {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";
            try {
                const res = await fetch(`${API_URL}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch user");
                }
                const userData = await res.json();
                setUser(userData);

                if (userData.scans) {
                    setScans(userData.scans);
                }
            } catch (err) {
                console.error(err);
                localStorage.removeItem("token");
                window.location.href = "/auth/login"; // Hard redirect on failure
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    const handlePurchase = async () => {
        if (!isRazorpayLoaded) {
            alert("Payment SDK is still loading... Please wait 2 seconds.");
            return;
        }

        // 1. Create Order
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";
        try {
            const res = await fetch(`${API_URL}/create-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: 49900 }) // 499 INR in paise
            });
            const order = await res.json();

            // 2. Open Razorpay
            const options = {
                key: "rzp_live_RrVyzWfpYc47aQ", // Public ID is safe here
                amount: order.amount,
                currency: "INR",
                name: "SecureScan Pro",
                description: "Premium API Key - 1 Year",
                order_id: order.id,
                handler: function (response: any) {
                    alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
                    // TODO: Call backend to verify and upgrade user
                },
                theme: { color: "#10b981" }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (err) {
            alert("Payment initialization failed. Please try again.");
            console.error(err);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading Secure Environment...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30">
            {/* Load Razorpay Script */}
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                onLoad={() => setIsRazorpayLoaded(true)}
            />

            {/* Navigation Bar */}
            <nav className="border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
                        <Shield className="text-emerald-500 w-6 h-6" />
                        <span>SecureScan<span className="text-emerald-500">.IO</span></span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
                        >
                            <ShieldCheck className="w-3 h-3" /> New Scan
                        </Link>
                        <span className="text-sm text-slate-400 hidden sm:inline">{user?.email}</span>
                        <button
                            onClick={handleLogout}
                            className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                        >
                            <LogOut className="w-3 h-3" /> Logout
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-3 gap-8">

                    {/* Profile / Plan Card */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Shield className="w-32 h-32 text-emerald-500" />
                            </div>
                            <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
                                <LayoutDashboard className="w-4 h-4 text-emerald-500" /> Account Status
                            </h2>
                            <div className="text-3xl font-bold text-emerald-400 mb-1">Active</div>
                            <p className="text-slate-500 text-sm mb-6">Free Tier Plan</p>

                            <div className="space-y-3">
                                <div className="bg-slate-950 rounded-lg p-3 border border-white/5">
                                    <span className="text-xs text-slate-500 block mb-1">API KEY (HIDDEN)</span>
                                    <code className="text-xs font-mono text-slate-500 break-all select-none">sk_************************</code>
                                </div>
                                {/* Purchase Option */}
                                <button
                                    onClick={handlePurchase}
                                    className="w-full py-2.5 text-xs font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 rounded-lg text-white transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2">
                                    <Wallet className="w-4 h-4" /> Purchase Premium Key
                                </button>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-900/20 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <ShieldCheck className="w-32 h-32 text-indigo-500" />
                            </div>
                            <h3 className="text-indigo-400 font-bold mb-2 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" /> Pro Features
                            </h3>
                            <ul className="space-y-2 mb-4 text-sm text-slate-400">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> Unlimited Scans</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> Priority Queue</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> PDF Reports</li>
                            </ul>
                            <button
                                onClick={handlePurchase}
                                className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20">
                                Buy Pro Plan - ₹499/mo
                            </button>
                        </div>
                    </div>

                    {/* Scan History Section */}
                    <div className="md:col-span-2">
                        <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 shadow-xl min-h-[400px]">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <History className="w-5 h-5 text-emerald-500" />
                                    Recent Scan Activity
                                </h2>
                                <button className="text-sm text-slate-500 hover:text-white transition-colors">
                                    Export CSV
                                </button>
                            </div>

                            <ScanHistoryTable scans={scans} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
