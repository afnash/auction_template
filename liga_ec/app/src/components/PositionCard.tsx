'use client';

import { motion } from 'framer-motion';
import { Shield, Goal, Footprints, Target } from 'lucide-react';
import React from 'react';

interface PositionCardProps {
    position: 'GK' | 'DEF' | 'MID' | 'FWD';
    label: string;
    onClick: (position: string) => void;
}

const icons = {
    GK: Goal,
    DEF: Shield,
    MID: Footprints,
    FWD: Target,
};

const colors = {
    GK: 'from-yellow-400 to-orange-500',
    DEF: 'from-blue-400 to-indigo-500',
    MID: 'from-emerald-400 to-green-500',
    FWD: 'from-red-400 to-rose-500',
};

export function PositionCard({ position, label, onClick }: PositionCardProps) {
    const Icon = icons[position];

    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => onClick(position)}
            className={`relative z-10 w-full h-48 rounded-xl cursor-pointer overflow-hidden group border border-white/10 bg-gradient-to-br ${colors[position]} p-1`}
        >
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-300" />

            <div className="relative h-full flex flex-col items-center justify-center p-6 text-center z-10">
                <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                >
                    <Icon className="w-16 h-16 text-white mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                </motion.div>

                <h3 className="text-3xl font-black text-white tracking-widest uppercase filter drop-shadow-lg">
                    {position}
                </h3>
                <p className="text-sm text-gray-200 mt-1 font-medium">{label}</p>
            </div>

            {/* Electrifying effect overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay bg-[radial-gradient(circle_at_center,_white_0%,_transparent_70%)]" />
        </motion.div>
    );
}
