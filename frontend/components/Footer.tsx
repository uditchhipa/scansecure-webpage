
import React from 'react';
import Link from 'next/link';

export const Footer = () => {
    return (
        <footer className="border-t border-white/5 bg-slate-950/50 mt-20 py-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-slate-400 text-sm">
                        © {new Date().getFullYear()} SecureScan. All rights reserved.
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 text-sm">
                        <Link href="/privacy" className="text-slate-400 hover:text-emerald-400 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-slate-400 hover:text-emerald-400 transition-colors">
                            Terms & Conditions
                        </Link>
                        <Link href="/refund" className="text-slate-400 hover:text-emerald-400 transition-colors">
                            Refund Policy
                        </Link>
                        <Link href="/contact" className="text-slate-400 hover:text-emerald-400 transition-colors">
                            Contact Us
                        </Link>
                    </div>
                </div>

                <div className="mt-8 text-center text-xs text-slate-600">
                    <p>SecureScan is a malware analysis tool. Pricing: ₹49 per Certified Report.</p>
                </div>
            </div>
        </footer>
    );
};
