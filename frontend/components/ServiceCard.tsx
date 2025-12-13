
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    href: string;
    color: "emerald" | "blue" | "indigo";
}

export function ServiceCard({ title, description, icon: Icon, href, color }: ServiceCardProps) {
    const colorStyles = {
        emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:border-emerald-500/50 group-hover:bg-emerald-500/20",
        blue: "bg-blue-500/10 border-blue-500/20 text-blue-400 group-hover:border-blue-500/50 group-hover:bg-blue-500/20",
        indigo: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/20",
    };

    return (
        <Link href={href} className="flex-1 min-w-[300px]">
            <div className={`h-full p-8 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group ${colorStyles[color]} border-slate-800 bg-slate-900/50`}>
                <div className="mb-6 inline-block p-4 rounded-xl bg-slate-950/50 border border-white/5">
                    <Icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
                <p className="text-slate-400 leading-relaxed font-light">{description}</p>

                <div className="mt-8 flex items-center text-sm font-semibold tracking-wide uppercase">
                    <span>Launch Tool</span>
                    <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
            </div>
        </Link>
    );
}
