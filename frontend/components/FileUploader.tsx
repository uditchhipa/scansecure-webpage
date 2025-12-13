
"use client"

import React, { useState, useRef } from 'react';
import { Upload, File, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';

interface FileUploaderProps {
    onUpload: (file: File) => void;
    isAnalyzing: boolean;
    accept?: string;
    description?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
    onUpload,
    isAnalyzing,
    accept = ".exe,.apk",
    description = "Supports .EXE, .APK (Max 100MB)"
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onUpload(e.dataTransfer.files[0]);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onUpload(e.target.files[0]);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-xl mx-auto"
        >
            <div
                className={cn(
                    "relative group cursor-pointer border-2 border-dashed rounded-3xl p-12 transition-all duration-300",
                    "flex flex-col items-center justify-center text-center",
                    isDragging
                        ? "border-emerald-500 bg-emerald-500/10 scale-[1.02]"
                        : "border-slate-700/50 hover:border-emerald-500/50 hover:bg-slate-800/50 bg-slate-900/50",
                    isAnalyzing && "pointer-events-none opacity-50"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept={accept}
                />

                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 rounded-3xl -z-10" />

                {isAnalyzing ? (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                        <Loader2 className="w-16 h-16 text-emerald-400" />
                    </motion.div>
                ) : (
                    <>
                        <div className="p-4 rounded-full bg-slate-800/80 mb-4 group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/10">
                            <Upload className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-400 mb-2">
                            Drop your File here
                        </h3>
                        <p className="text-slate-400 text-sm">
                            {description}
                        </p>
                    </>
                )}
            </div>
        </motion.div>
    );
};
