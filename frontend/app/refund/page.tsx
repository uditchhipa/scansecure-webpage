
import React from 'react';
import Link from 'next/link';

export default function RefundPolicy() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-300 py-20 px-6">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="text-emerald-400 hover:text-emerald-300 mb-8 inline-block">← Back to Home</Link>
                <h1 className="text-4xl font-bold text-white mb-8">Refund & Cancellation Policy</h1>

                <div className="space-y-6 text-sm leading-relaxed">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>

                    <h2 className="text-xl font-bold text-white mt-8">1. Returns</h2>
                    <p>Since our product (Certified Analysis Report) is a digital file delivered instantly upon payment, we generally do not offer returns.</p>

                    <h2 className="text-xl font-bold text-white mt-8">2. Refunds</h2>
                    <p>If you were charged but did not receive the PDF report due to a technical error, please contact us within 7 days. We will verify the transaction and issue a full refund within 5-7 business days.</p>

                    <h2 className="text-xl font-bold text-white mt-8">3. Cancellation</h2>
                    <p>Orders cannot be cancelled once the payment is processed and the PDF is generated.</p>

                    <h2 className="text-xl font-bold text-white mt-8">4. Contact Us</h2>
                    <p>For refund requests, please email us at <a href="mailto:udit7852@gmail.com" className="text-emerald-400 hover:underline">udit7852@gmail.com</a> or call us at +91 7852091947.</p>
                </div>
            </div>
        </main>
    );
}
