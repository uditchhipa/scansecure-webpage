"use client";

import Link from "next/link";
import { Shield, ShieldCheck, LogIn, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        // Check for token and email in localStorage
        const token = localStorage.getItem("token");
        const storedEmail = localStorage.getItem("email"); // We'll need to store this on login

        if (token) {
            setIsLoggedIn(true);
            // Handle Guest Mode label
            if (token === "guest_token") {
                setEmail("Guest User");
            } else {
                setEmail(storedEmail || "My Account");
            }
        }
    }, []);

    return (
        <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
            <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
                    <Shield className="text-emerald-500 w-6 h-6" />
                    <span>SecureScan<span className="text-emerald-500">.IO</span></span>
                </Link>

                <nav className="flex items-center gap-6">
                    <Link href="/faq" className="text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors hidden md:block">
                        FAQ
                    </Link>
                    <Link href="/contact" className="text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors hidden md:block">
                        Support
                    </Link>

                    {isLoggedIn ? (
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 rounded-full bg-slate-800 border border-slate-700 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-slate-700 hover:scale-105"
                        >
                            <LayoutDashboard className="h-4 w-4 text-emerald-400" />
                            {email || "Dashboard"}
                        </Link>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link href="/auth/login" className="text-slate-300 hover:text-white font-medium text-sm transition-colors">
                                Log In
                            </Link>
                            <Link
                                href="/auth/register"
                                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2 rounded-full font-bold text-sm transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
                            >
                                <ShieldCheck className="w-4 h-4" /> Sign Up
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}
