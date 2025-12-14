
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Shield, AlertCircle } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";
            const res = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.detail || "Registration failed");
            }

            // Redirect to Verify Page
            router.push(`/auth/verify?email=${encodeURIComponent(email)}`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.05)_0%,transparent_50%)]" />

            <div className="z-10 w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-4 p-3 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                        <Shield className="w-8 h-8 text-emerald-500" />
                    </Link>
                    <h1 className="text-2xl font-bold mb-2">New Identity</h1>
                    <p className="text-slate-400 text-sm">Create a secure account to track threats</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1 ml-1">EMAIL ADDRESS</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-600"
                            placeholder="agent@scansecure.io"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1 ml-1">SECURE PASSWORD</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-600"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Generating Keys..." : "Register User"}
                    </button>
                </form>

                <div className="mt-4">
                    <button
                        onClick={() => {
                            localStorage.setItem("token", "guest_token");
                            router.push("/dashboard");
                        }}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-3 rounded-xl transition-all border border-white/5"
                    >
                        🕵️ Continue as Guest
                    </button>
                </div>

                <div className="mt-8 text-center text-sm text-slate-500">
                    Already authorized?{" "}
                    <Link href="/auth/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                        Login here
                    </Link>
                </div>
            </div>
        </div>
    );
}
