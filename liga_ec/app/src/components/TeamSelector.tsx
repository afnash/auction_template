'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { Team } from '../types';

interface TeamSelectorProps {
    teams: Team[];
    onSelect: (teamId: string) => void;
    disabled?: boolean;
}

export function TeamSelector({ teams, onSelect, disabled }: TeamSelectorProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 w-full max-w-2xl px-4">
            {teams.map((team, index) => (
                <motion.button
                    key={team.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(59, 130, 246, 0.2)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelect(team.id)}
                    disabled={disabled}
                    className="relative p-4 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm text-center cursor-pointer transition-colors hover:border-blue-500/50 group"
                >
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    <span className="text-white font-bold tracking-wide group-hover:text-blue-400 transition-colors">
                        {team.name}
                    </span>
                </motion.button>
            ))}
        </div>
    );
}
