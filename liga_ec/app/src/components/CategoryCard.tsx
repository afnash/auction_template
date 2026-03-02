'use client';

import { motion } from 'framer-motion';
import { Crown, Trophy, Medal } from 'lucide-react';
import React from 'react';
import { Category } from '@/types';

interface CategoryCardProps {
    category: Category;
    label: string;
    onClick: (category: Category) => void;
}

const icons = {
    Iconic: Crown,
    Gold: Trophy,
    Silver: Medal,
};

const colors = {
    Iconic: 'from-purple-600 via-indigo-600 to-blue-700',
    Gold: 'from-amber-400 via-yellow-500 to-orange-600',
    Silver: 'from-slate-300 via-gray-400 to-slate-500',
};

const glowColors = {
    Iconic: 'rgba(139, 92, 246, 0.5)',
    Gold: 'rgba(251, 191, 36, 0.5)',
    Silver: 'rgba(148, 163, 184, 0.5)',
};

export function CategoryCard({ category, label, onClick }: CategoryCardProps) {
    const Icon = icons[category];

    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => onClick(category)}
            className={`relative z-10 w-full h-64 rounded-2xl cursor-pointer overflow-hidden group border border-white/10 bg-gradient-to-br ${colors[category]} p-1 shadow-2xl`}
        >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%] animate-shine" />

            <div className="relative h-full flex flex-col items-center justify-center p-8 text-center z-10">
                <motion.div
                    animate={{
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="mb-6"
                >
                    <Icon
                        className="w-20 h-20 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]"
                        style={{ filter: `drop-shadow(0 0 15px ${glowColors[category]})` }}
                    />
                </motion.div>

                <h3 className="text-4xl font-black text-white tracking-[0.2em] uppercase filter drop-shadow-2xl mb-2">
                    {category}
                </h3>
                <div className="h-1 w-12 bg-white/30 rounded-full mb-3 group-hover:w-24 transition-all duration-300" />
                <p className="text-sm text-white/80 font-bold uppercase tracking-widest">{label}</p>
            </div>

            <div className={`absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        </motion.div>
    );
}
