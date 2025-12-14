"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Mail, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { Navbar } from "../../../components/Navbar";

export default function VerifyPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const emailParam = searchParams.get("email");
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [searchParams]);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) value = value[0]; // Allow only 1 char
        if (!/^\d*$/.test(value)) return; // Allow only numbers

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const otpCode = otp.join("");
        if (otpCode.length !== 6) {
            setError("Please enter the full 6-digit code.");
            setLoading(false);
            return;
        }

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";
            const res = await fetch(`${API_URL}/auth/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: otpCode }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || "Verification failed");
            }

            setSuccess(true);

            // Redirect to Login Page (Verification successful, now login)
            setTimeout(() => {
                router.push("/auth/login");
            }, 2000);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30">
            <Navbar />

            <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05)_0%,transparent_50%)]" />

                <div className="z-10 w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative">

                    {success ? (
                        <div className="text-center py-10 animate-fade-in">
                            <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
                                <ShieldCheck className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2 text-white">Verified!</h2>
                            <p className="text-slate-400 mb-6">Redirecting to your dashboard...</p>
                            <Loader2 className="w-6 h-6 text-emerald-500 animate-spin mx-auto" />
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <div className="mx-auto w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-white/5">
                                    <Mail className="w-6 h-6 text-emerald-500" />
                                </div>
                                <h1 className="text-2xl font-bold mb-2">Check Your Inbox</h1>
                                <p className="text-slate-400 text-sm">
                                    We sent a 6-digit code to <br />
                                    <span className="text-emerald-400 font-mono">{email}</span>
                                </p>
                            </div>

                            {error && (
                                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleVerify} className="space-y-6">
                                <div className="flex justify-between gap-2">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`otp-${index}`}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            className="w-12 h-12 text-center bg-slate-950 border border-white/10 rounded-xl text-xl font-bold focus:outline-none focus:border-emerald-500 transition-colors text-white"
                                        />
                                    ))}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                                        </>
                                    ) : (
                                        <>
                                            Verify Code <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-xs text-slate-500">
                                    Did not receive the code?
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            try {
                                                const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";
                                                const res = await fetch(`${API_URL}/auth/resend-otp`, {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({ email }),
                                                });
                                                if (res.ok) alert("New verification code sent!");
                                                else alert("Failed to resend code. Please try again.");
                                            } catch (e) { console.error(e); alert("Network error"); }
                                        }}
                                        className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium ml-1"
                                    >
                                        Resend
                                    </button>
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
