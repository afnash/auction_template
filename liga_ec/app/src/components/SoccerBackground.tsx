'use client';

import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

// SVG Paths for silhouettes
const silhouettes = [
    // Striker kicking
    "M50,10 L60,30 L55,50 L70,80 L80,70 M60,30 L80,30 L90,10 M55,50 L40,80 L30,70",
    // Goalkeeper diving
    "M100,50 L80,60 L60,50 L40,70 M80,60 L90,80 L110,80 M60,50 L50,30 M40,70 L30,90",
    // Runner
    "M30,20 L40,40 L30,60 L20,80 M40,40 L60,50 L70,30 M30,60 L50,80 L60,90"
];

// Simple representation using Lucide-like structure or just raw SVGs
const PlayerSilhouette = ({ d, delay, duration, y }: { d: string, delay: number, duration: number, y: number }) => (
    <motion.svg
        viewBox="0 0 150 150"
        className="absolute w-64 h-64 text-white/5 opacity-10 pointer-events-none"
        initial={{ x: -200, y }}
        animate={{ x: '120vw' }}
        transition={{
            duration: duration,
            delay: delay,
            repeat: Infinity,
            ease: "linear",
        }}
    >
        <path d={d} fill="currentColor" stroke="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
);

export function SoccerBackground() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Stadium Background */}
            <div className="absolute inset-0 z-[-1]">
                <img
                    src="/stadium-bg.png"
                    alt="Stadium Background"
                    className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/10 to-slate-900/40" />
            </div>

            {/* Dynamic Silhouettes */}
            <PlayerSilhouette d="M48.74 15.36c-2.3 2.1-1.9 6.2 1.2 8.3 2.9 2 6.8 2.2 9.1-.1 2.3-2.1 1.9-6.2-1.2-8.3-2.9-2-6.8-2.2-9.1.1zM58 87c-3-5-8-6-12-3l-16 14c-4 4-2 11 3 14 5 3 12 1 17-5l8-10 16 11c5 3 12 1 17-4 5-6 3-13-2-16L58 87z M75 42c-5-4-12-3-16 2L46 56c-4 5-2 12 3 16 5 4 12 3 16-2l13-12 15 12c5 4 13 4 18-2s4-13-2-18L75 42z" delay={0} duration={15} y={100} />
            <PlayerSilhouette d="M50 20c0-6 4-10 10-10s10 4 10 10-4 10-10 10-10-4-10-10zm20 30l20-10c5-3 5-10 0-14s-10-3-15 0L55 35 40 20c-5-5-13-5-18 0s-5 13 0 18l20 20v30c0 6 5 10 11 10s11-4 11-10V50z" delay={5} duration={18} y={300} />
            <PlayerSilhouette d="M60 20a10 10 0 1 0 0-20 10 10 0 0 0 0 20zm-10 10L30 80h10l10-30 10 30h10l-20-50z" delay={10} duration={20} y={500} />

            {/* Random Particles */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-yellow-500/30 rounded-full"
                    initial={{
                        x: Math.random() * 100 + 'vw',
                        y: Math.random() * 100 + 'vh',
                        opacity: 0
                    }}
                    animate={{
                        y: [null, Math.random() * 100 + 'vh'],
                        opacity: [0, 0.8, 0]
                    }}
                    transition={{
                        duration: Math.random() * 10 + 5,
                        repeat: Infinity,
                        delay: Math.random() * 5
                    }}
                />
            ))}
        </div>
    );
}
