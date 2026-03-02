'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { BadgeDollarSign, X } from 'lucide-react';
import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    playerName: string;
    teamName: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmationModal({ isOpen, playerName, teamName, onConfirm, onCancel }: ConfirmationModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative bg-slate-900 border border-yellow-500/30 rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(234,179,8,0.1)] z-10"
                    >
                        <button
                            onClick={onCancel}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mb-6">
                                <BadgeDollarSign className="w-8 h-8 text-yellow-500" />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2">Confirm Transfer</h3>
                            <p className="text-gray-300 mb-8">
                                Are you sure you want to sell <span className="text-yellow-400 font-bold">{playerName}</span> to <span className="text-blue-400 font-bold">{teamName}</span>?
                            </p>

                            <div className="flex gap-4 w-full">
                                <button
                                    onClick={onCancel}
                                    className="flex-1 py-3 px-6 rounded-xl bg-gray-800 text-white font-semibold hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className="flex-1 py-3 px-6 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/20"
                                >
                                    Confirm Sale
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
