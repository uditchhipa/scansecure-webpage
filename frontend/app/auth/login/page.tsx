
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, AlertCircle } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const formData = new URLSearchParams();
            formData.append("username", email);
            formData.append("password", password);

            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";
            const res = await fetch(`${API_URL}/auth/token`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Invalid credentials");
            }

            const data = await res.json();
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("email", email); // Store email for Navbar
            window.location.href = "/dashboard"; // Force reload/navigation to update UI state
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05)_0%,transparent_50%)]" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />

            <div className="z-10 w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-4 p-3 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                        <ShieldCheck className="w-8 h-8 text-emerald-500" />
                    </Link>
                    <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-slate-400 text-sm">Access your secure dashboard</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1 ml-1">EMAIL ADDRESS</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-600"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1 ml-1">PASSWORD</label>
                        <div className="relative">
                            <input
                                type="password"
                                required
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-600"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Lock className="absolute right-3 top-3 w-4 h-4 text-slate-600" />
                        </div>
                        <div className="text-right mt-1">
                            <Link href="/auth/forgot-password" className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold tracking-wide">
                                FORGOT PASSWORD?
                            </Link>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Authenticating..." : "Secure Login"}
                    </button>
                </form>

                <div className="mt-4">
                    <button
                        type="button"
                        onClick={() => {
                            localStorage.setItem("token", "guest_token");
                            window.location.href = "/dashboard";
                        }}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-3 rounded-xl transition-all border border-white/5"
                    >
                        🕵️ Continue as Guest
                    </button>
                </div>

                <div className="mt-8 text-center text-sm text-slate-500">
                    Don't have an account?{" "}
                    <Link href="/auth/register" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                        Initialize Protocol
                    </Link>
                </div>
            </div>
        </div>
    );
}
