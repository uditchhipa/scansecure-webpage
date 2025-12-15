"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, AlertCircle, Github, ArrowLeft } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);

            const res = await fetch("http://localhost:8082/auth/token", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || "Login failed");
            }

            // Store Token
            localStorage.setItem("token", data.access_token);

            // Redirect
            router.push("/dashboard");

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-[#030303] text-white font-sans selection:bg-emerald-500/30">

            {/* LEFT SIDE - Animated/Marketing */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-black items-center justify-center border-r border-white/5 overflow-hidden">

                {/* Background Pattern (Subtle Arrows/Grid) */}
                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `radial-gradient(circle at 50% 50%, #10b981 0%, transparent 50%), url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}
                ></div>

                <div className="relative z-10 p-12 max-w-lg">
                    {/* Floating/Glowing Icon */}
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)] mb-8 animate-pulse text-black">
                        <ShieldCheck className="w-8 h-8" strokeWidth={2.5} />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
                        Secure your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                            digital footprint
                        </span> <br />
                        in seconds.
                    </h1>
                    <p className="text-slate-500 text-lg leading-relaxed font-light">
                        Advanced threat detection and port scanning for the modern web.
                        Monitor your perimeter with enterprise-grade precision.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE - Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col p-6 md:p-12 lg:p-24 justify-center relative">

                {/* Back Button */}
                <Link href="/" className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-medium border border-white/5 rounded-full px-4 py-1.5 hover:bg-white/5 hover:border-white/10 group">
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    Home
                </Link>

                <div className="max-w-[400px] w-full mx-auto">
                    <div className="mb-10 text-center">
                        <h2 className="text-2xl font-semibold mb-2">Log in to your account</h2>
                        <p className="text-slate-500 text-sm">Connect to ScanSecure with:</p>
                    </div>

                    {/* Social Buttons */}
                    <div className="grid grid-cols-2 gap-3 mb-8">
                        <button
                            onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082"}/auth/google/login`}
                            className="flex items-center justify-center gap-2 bg-white text-slate-900 text-sm font-semibold py-2.5 rounded-md hover:bg-slate-200 transition-colors"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </button>
                        <button
                            onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082"}/auth/github/login`}
                            className="flex items-center justify-center gap-2 bg-[#1a1c1e] text-white text-sm font-semibold py-2.5 rounded-md border border-white/5 hover:bg-[#25282c] transition-colors"
                        >
                            <Github className="w-4 h-4 text-white" />
                            GitHub
                        </button>
                    </div>

                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-medium tracking-wider">
                            <span className="bg-[#030303] px-3 text-slate-500">Or log in with your email</span>
                        </div>
                    </div>

                    {/* Email Form */}
                    {error && (
                        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-md flex items-center gap-2 text-red-400 text-xs">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-light text-slate-400 ml-0.5">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-700"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-0.5">
                                <label className="block text-xs font-light text-slate-400">Password</label>
                                <Link href="/auth/forgot-password" className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors">
                                    Forgot Password?
                                </Link>
                            </div>
                            <input
                                type="password"
                                required
                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-700"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#1e2023] hover:bg-emerald-600 hover:text-white text-slate-200 font-medium py-2.5 rounded-md transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-4 border border-white/5"
                        >
                            {loading ? "Authenticating..." : "Log In"}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-xs text-slate-500">
                        New to ScanSecure?{" "}
                        <Link href="/auth/register" className="text-emerald-500 hover:text-emerald-400 transition-colors">
                            Sign up for an account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
