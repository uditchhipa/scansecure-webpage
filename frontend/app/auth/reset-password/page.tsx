"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { KeyRound, ShieldCheck, ArrowRight, Lock } from "lucide-react";
import Link from "next/link";

// Component that uses useSearchParams must be wrapped in Suspense boundary
function ResetForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Auto-fill email from URL if present
    const initialEmail = searchParams.get("email") || "";

    const [email, setEmail] = useState(initialEmail);
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";
            const res = await fetch(`${API_URL}/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, new_password: newPassword }),
            });

            const data = await res.json();
            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/auth/login");
                }, 2000);
            } else {
                setError(data.detail || "Reset failed. Check OTP.");
            }
        } catch (err) {
            setError("Something went wrong.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleReset} className="space-y-4 relative z-10">
            {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                    {error}
                </div>
            )}

            {success && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center">
                    Password reset! Logging you in...
                </div>
            )}

            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative">
                    <ShieldCheck className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
                    <input
                        type="email"
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">OTP Code</label>
                <div className="relative">
                    <KeyRound className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600 tracking-widest font-mono"
                        placeholder="123456"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">New Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
                    <input
                        type="password"
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg font-bold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {loading ? "Updating..." : success ? "Done!" : "Set New Password"}
                {!loading && !success && <ArrowRight className="w-4 h-4" />}
            </button>
        </form>
    );
}

export default function ResetPassword() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
            <Navbar />

            <div className="max-w-md mx-auto px-6 py-24">
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>

                    <div className="text-center mb-8 relative z-10">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 mb-4 border border-emerald-500/20">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
                        <p className="text-slate-400 text-sm">
                            Check your email for the code and enter your new password below.
                        </p>
                    </div>

                    <Suspense fallback={<div className="text-center text-slate-500 py-8">Loading form...</div>}>
                        <ResetForm />
                    </Suspense>

                    <div className="mt-6 text-center">
                        <Link href="/auth/login" className="text-xs text-slate-500 hover:text-indigo-400 transition-colors">
                            Remember your password? Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
