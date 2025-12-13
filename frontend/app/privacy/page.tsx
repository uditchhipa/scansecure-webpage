
import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-300 py-20 px-6">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="text-emerald-400 hover:text-emerald-300 mb-8 inline-block">← Back to Home</Link>
                <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>

                <div className="space-y-6 text-sm leading-relaxed">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>

                    <h2 className="text-xl font-bold text-white mt-8">1. Information We Collect</h2>
                    <p>We collect uploaded files for the sole purpose of malware analysis. We do not store these files permanently. They are processed in temporary memory and deleted immediately after the report is generated.</p>
                    <p>We usage Google Analytics and simple cookies to track site usage statistics.</p>

                    <h2 className="text-xl font-bold text-white mt-8">2. Use of Information</h2>
                    <p>The information generated (analysis reports) is displayed to you and is not shared with third parties unless required by law.</p>

                    <h2 className="text-xl font-bold text-white mt-8">3. Payment Information</h2>
                    <p>We do not store your credit card or payment details. All payments are processed securely by Razorpay.</p>

                    <h2 className="text-xl font-bold text-white mt-8">4. Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy, please contact us at udit7852@gmail.com.</p>
                </div>
            </div>
        </main>
    );
}
