"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { KeyRound, Mail, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleForgot = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";
            const res = await fetch(`${API_URL}/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (res.ok) {
                setSuccess(true);
                // Redirect after 2 seconds or allow manual
                setTimeout(() => {
                    router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
                }, 2000);
            } else {
                setError(data.detail || "Failed to send reset email.");
            }
        } catch (err) {
            setError("Something went wrong. Is backend running?");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
            <Navbar />

            <div className="max-w-md mx-auto px-6 py-24">
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>

                    <div className="text-center mb-8 relative z-10">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 mb-4 border border-indigo-500/20">
                            <KeyRound className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Forgot Password?</h1>
                        <p className="text-slate-400 text-sm">
                            Enter your email address and we'll send you a code to reset your password.
                        </p>
                    </div>

                    <form onSubmit={handleForgot} className="space-y-4 relative z-10">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center">
                                Verification code sent! Redirecting...
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
                                    placeholder="hackerman@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || success}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg font-bold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? "Sending..." : success ? "Sens Sent!" : "Send Reset Code"}
                            {!loading && !success && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link href="/auth/login" className="text-xs text-slate-500 hover:text-indigo-400 transition-colors flex items-center justify-center gap-1">
                            <ArrowLeft className="w-3 h-3" /> Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
