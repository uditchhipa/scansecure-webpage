
import React from 'react';
import Link from 'next/link';

export default function Terms() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-300 py-20 px-6">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="text-emerald-400 hover:text-emerald-300 mb-8 inline-block">← Back to Home</Link>
                <h1 className="text-4xl font-bold text-white mb-8">Terms & Conditions</h1>

                <div className="space-y-6 text-sm leading-relaxed">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>

                    <h2 className="text-xl font-bold text-white mt-8">1. Acceptance of Terms</h2>
                    <p>By using SecureScan, you agree to these terms. If you do not agree, please do not use our services.</p>

                    <h2 className="text-xl font-bold text-white mt-8">2. Services</h2>
                    <p>SecureScan provides automated static analysis for APK, EXE, PDF, and TXT files. The results are probabilistic and we do not guarantee 100% accuracy. You verify that you have the right to scan the files you upload.</p>

                    <h2 className="text-xl font-bold text-white mt-8">3. Pricing</h2>
                    <p>The basic usage of the site is free. We charge a fee of <strong>₹49 (INR)</strong> for generating and downloading the "Certified Analysis Report" (PDF).</p>

                    <h2 className="text-xl font-bold text-white mt-8">4. Liability</h2>
                    <p>We are not liable for any damages resulting from the use of this tool or the analysis reports provided.</p>
                </div>
            </div>
        </main>
    );
}
