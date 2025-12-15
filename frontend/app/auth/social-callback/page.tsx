"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SocialCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");
        const email = searchParams.get("email");

        if (token) {
            // Save to Storage
            localStorage.setItem("token", token);
            if (email) localStorage.setItem("email", email);

            // Redirect to Dashboard
            router.push("/dashboard");
        } else {
            // Error handling
            console.error("No token found in callback URL");
            router.push("/auth/login?error=Social_Auth_Failed");
        }
    }, [searchParams, router]);

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-bold text-white">Finalizing Secure Handshake...</h2>
                <p className="text-slate-400">Verifying tokens with provider</p>
            </div>
        </div>
    );
}
