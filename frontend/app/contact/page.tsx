
import React from 'react';
import Link from 'next/link';
import { Mail, MapPin } from 'lucide-react';

export default function Contact() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-300 py-20 px-6">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="text-emerald-400 hover:text-emerald-300 mb-8 inline-block">← Back to Home</Link>
                <h1 className="text-4xl font-bold text-white mb-8">Contact Us</h1>

                <div className="space-y-8">
                    <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/5">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="p-3 bg-slate-800 rounded-lg">
                                <Mail className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">Email Support</h3>
                                <p className="text-slate-400 text-sm mb-2">For general inquiries and support.</p>
                                <a href="mailto:udit7852@gmail.com" className="text-emerald-400 hover:underline">udit7852@gmail.com</a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-slate-800 rounded-lg">
                                <Mail className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">Phone Support</h3>
                                <p className="text-slate-400 text-sm mb-2">Available Mon-Fri, 9am - 6pm IST.</p>
                                <a href="tel:+917852091947" className="text-emerald-400 hover:underline">+91 7852091947</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
