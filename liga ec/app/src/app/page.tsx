'use client';

import { useState } from 'react';
import { Category } from '@/types';
import { CategoryCard } from '@/components/CategoryCard';
import { AuctionView } from '@/components/AuctionView';
import { SoccerBackground } from '@/components/SoccerBackground';
import { TeamDashboard } from '@/components/TeamDashboard';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  return (
    <main className="h-screen bg-slate-900 overflow-hidden selection:bg-yellow-500/30 flex flex-col">
      <SoccerBackground />

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-4 flex flex-col flex-1 overflow-hidden">
        <header className="flex flex-col items-center justify-center mb-6 pt-2 shrink-0">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 tracking-tighter text-center uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          >
            Liga EC
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-blue-400 font-bold tracking-[0.5em] mt-1 uppercase text-xs md:text-sm"
          >
            Auction
          </motion.p>
        </header>

        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode='wait'>
            {selectedCategory ? (
              <motion.div
                key="auction"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <AuctionView
                  category={selectedCategory}
                  onBack={() => setSelectedCategory(null)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="home"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="max-w-6xl mx-auto h-full flex flex-col overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
                  <CategoryCard category="Iconic" label="Legendary Players" onClick={(c) => setSelectedCategory(c)} />
                  <CategoryCard category="Gold" label="Elite Players" onClick={(c) => setSelectedCategory(c)} />
                  <CategoryCard category="Silver" label="Rising Stars" onClick={(c) => setSelectedCategory(c)} />
                </div>

                <div className="mt-8 flex-1 min-h-0">
                  <TeamDashboard />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <footer className="mt-auto py-4 text-center shrink-0">
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">
            Made with <span className="text-red-500">❤️</span> by{' '}
            <a
              href="https://afnash.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors border-b border-gray-800 hover:border-white pb-0.5"
            >
              afnashhh
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
