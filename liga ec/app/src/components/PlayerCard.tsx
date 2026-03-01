'use client';

import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import React from 'react';
import { Player } from '../types';

interface PlayerCardProps {
    player: Player;
}

export function PlayerCard({ player }: PlayerCardProps) {
    const [imageError, setImageError] = React.useState(false);

    return (
        <motion.div
            initial={{ scale: 0.5, opacity: 0, rotateY: 90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 0.8
            }}
            className="relative w-80 h-[450px] bg-gray-900 rounded-sm border-[4px] border-yellow-500/50 shadow-[0_0_50px_rgba(234,179,8,0.2)] overflow-hidden flex flex-col group"
        >
            {/* Full Player Image */}
            <div className="absolute inset-0 z-0 bg-gray-800 flex items-center justify-center">
                {!imageError && player.image_url ? (
                    <img
                        src={player.image_url}
                        alt={player.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <User className="w-32 h-32 text-gray-600" />
                )}
            </div>

            {/* Gradient Overlay */}
            {/* <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" /> */}

            {/* Player Info (Bottom) */}
            {/* <div className="absolute bottom-0 w-full p-6 z-20 text-center">
                <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-black text-white uppercase tracking-wider mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                >
                    {player.name}
                </motion.h2>
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="inline-block px-4 py-1.5 bg-yellow-500 text-black font-extrabold uppercase tracking-widest rounded-sm text-sm"
                >
                    {player.position}
                </motion.div>
            </div> */}

            {/* Shine Effect */}
            <div className="absolute inset-0 z-30 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent skew-x-12 translate-x-[-150%] group-hover:animate-shine" />
        </motion.div>
    );
}
