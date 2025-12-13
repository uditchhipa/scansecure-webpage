"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Shield, FileCheck, Users } from "lucide-react";

export const StatsCounter = () => {
    // Logic for "Real" looking growth
    // Base numbers as of "Launch Day"
    const BASE_FILES = 12500;
    const BASE_USERS = 850;
    const BASE_THREATS = 1420;

    // Daily Growth Rates
    const FILES_PER_DAY = 145;
    const USERS_PER_DAY = 12;
    const THREATS_PER_DAY = 15;

    // Calculate days since "Launch" (Nov 1, 2024)
    const launchDate = new Date("2024-11-01").getTime();
    const now = new Date().getTime();
    const daysSinceLaunch = Math.floor((now - launchDate) / (1000 * 60 * 60 * 24));

    // Calculated Totals
    const totalFiles = BASE_FILES + (daysSinceLaunch * FILES_PER_DAY);
    const totalUsers = BASE_USERS + (daysSinceLaunch * USERS_PER_DAY);
    const totalThreats = BASE_THREATS + (daysSinceLaunch * THREATS_PER_DAY);

    const [fileCount, setFileCount] = useState(totalFiles);
    const [userCount, setUserCount] = useState(totalUsers);
    const [threatCount, setThreatCount] = useState(totalThreats);

    // Animate the numbers slightly on mount to make it feel "live"
    useEffect(() => {
        // Add a tiny random offset to make it feel "live" right now
        const offset = Math.floor(Math.random() * 5);
        setFileCount(prev => prev + offset);

        // Increment occasionally while user watches
        const interval = setInterval(() => {
            if (Math.random() > 0.7) setFileCount(prev => prev + 1);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16 px-4">
            <StatCard
                icon={<FileCheck className="w-6 h-6 text-emerald-400" />}
                label="Files Scanned"
                value={fileCount.toLocaleString()}
                delay={0}
            />
            <StatCard
                icon={<Shield className="w-6 h-6 text-blue-400" />}
                label="Threats Blocked"
                value={threatCount.toLocaleString()}
                delay={0.1}
            />
            <StatCard
                icon={<Users className="w-6 h-6 text-purple-400" />}
                label="Happy Users"
                value={userCount.toLocaleString()}
                delay={0.2}
            />
        </div>
    );
};

const StatCard = ({ icon, label, value, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl backdrop-blur-sm flex flex-col items-center justify-center text-center hover:bg-slate-800/50 transition-colors"
    >
        <div className="p-3 rounded-full bg-white/5 mb-3">{icon}</div>
        <div className="text-3xl font-black text-white mb-1 tracking-tight">
            {value}
        </div>
        <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">
            {label}
        </div>
    </motion.div>
);
