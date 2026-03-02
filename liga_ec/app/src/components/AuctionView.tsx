import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Loader2, Play, User, Filter } from 'lucide-react';
import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Player, Team, Category, Position } from '../types';
import { PlayerCard } from './PlayerCard';
import { TeamSelector } from './TeamSelector';
import { ConfirmationModal } from './ConfirmationModal';
import { cn } from '@/lib/utils';

interface AuctionViewProps {
    category: Category;
    onBack: () => void;
}

const POSITIONS: (Position | 'ALL')[] = ['ALL', 'GK', 'DEF', 'MID', 'FWD'];

export function AuctionView({ category, onBack }: AuctionViewProps) {
    const [players, setPlayers] = useState<Player[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'auction'>('list');
    const [selectedPos, setSelectedPos] = useState<Position | 'ALL'>('ALL');

    // Modal State
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [showModal, setShowModal] = useState(false);

    // Sold Animation trigger
    const [justSold, setJustSold] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch players for category who don't have a team yet
                const { data: playersData, error: playersError } = await supabase
                    .from('players')
                    .select('*')
                    .eq('category', category)
                    .is('team_id', null);

                if (playersError) throw playersError;

                // Fetch teams
                const { data: teamsData, error: teamsError } = await supabase
                    .from('teams')
                    .select('*')
                    .order('name');

                if (teamsError) throw teamsError;

                setPlayers(playersData || []);
                setTeams(teamsData || []);
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Failed to load auction data. Check the console for details.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [category]);

    // Filtered players based on selected position (especially for Silver)
    const filteredPlayers = useMemo(() => {
        if (selectedPos === 'ALL') return players;
        return players.filter(p => p.position === selectedPos);
    }, [players, selectedPos]);

    const handleTeamClick = (teamId: string) => {
        const team = teams.find(t => t.id === teamId);
        if (!team) return;

        setSelectedTeam(team);
        setShowModal(true);
    };

    const handleConfirmSale = async () => {
        if (!selectedTeam || assigning) return;

        setAssigning(true);
        setShowModal(false);

        const currentPlayer = filteredPlayers[currentIndex];

        try {
            const { error } = await supabase
                .from('players')
                .update({ team_id: selectedTeam.id })
                .eq('id', currentPlayer.id);

            if (error) throw error;

            setJustSold(true);

            setTimeout(() => {
                setJustSold(false);
                setAssigning(false);
                setSelectedTeam(null);
                setCurrentIndex((prev) => prev + 1);
            }, 2000);

        } catch (error) {
            console.error('Error assigning team:', error);
            setAssigning(false);
            setJustSold(false);
            alert("Failed to assign player. See console.");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh]">
                <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
                <p className="text-gray-400 mt-4 animate-pulse">Scouting {category} players...</p>
            </div>
        );
    }

    const isComplete = currentIndex >= filteredPlayers.length;

    if (viewMode === 'list') {
        return (
            <div className="flex flex-col items-center justify-start py-4 px-4 relative">
                <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center mb-8 relative z-10 gap-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" /> Back to Categories
                    </button>

                    <h2 className="text-3xl font-black text-white tracking-widest uppercase flex items-center gap-4">
                        <span className={cn(
                            "px-3 py-1 rounded text-sm",
                            category === 'Iconic' && "bg-purple-600",
                            category === 'Gold' && "bg-amber-500 text-black",
                            category === 'Silver' && "bg-slate-500"
                        )}>
                            {category}
                        </span>
                        POOL
                        <span className="text-gray-500 text-xl font-normal">({filteredPlayers.length})</span>
                    </h2>

                    {category === 'Silver' ? (
                        <div className="flex bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md">
                            {POSITIONS.map((pos) => (
                                <button
                                    key={pos}
                                    onClick={() => setSelectedPos(pos)}
                                    className={cn(
                                        "px-4 py-1.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider",
                                        selectedPos === pos
                                            ? "bg-white text-black shadow-lg"
                                            : "text-gray-400 hover:text-white"
                                    )}
                                >
                                    {pos}
                                </button>
                            ))}
                        </div>
                    ) : <div className="w-40 md:block hidden" />}
                </div>

                <div className="w-full max-w-7xl relative z-10 flex flex-col">
                    <div className="mb-2">
                        {filteredPlayers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 italic">
                                <Filter className="w-12 h-12 mb-4 opacity-20" />
                                No unassigned {selectedPos !== 'ALL' ? selectedPos : ''} players found.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                {filteredPlayers.map((player, idx) => (
                                    <motion.div
                                        key={player.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="aspect-[3/4.5] rounded-xl overflow-hidden bg-slate-800/50 border border-white/10 group relative shadow-lg"
                                    >
                                        {player.image_url ? (
                                            <img
                                                src={player.image_url}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                alt={player.name}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 bg-slate-900/50">
                                                <User className="w-12 h-12 mb-2 opacity-30" />
                                            </div>
                                        )}

                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                                        <div className="absolute bottom-0 left-0 right-0 p-3">
                                            <div className="text-[10px] font-black text-yellow-500 uppercase tracking-tighter mb-1">
                                                {player.position}
                                            </div>
                                            <h4 className="text-white font-bold text-sm leading-tight truncate">
                                                {player.name}
                                            </h4>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col items-center p-4 border-t border-white/10 bg-black/40 backdrop-blur-md rounded-2xl shadow-2xl shrink-0">
                        <button
                            onClick={() => {
                                if (filteredPlayers.length > 0) {
                                    setCurrentIndex(0);
                                    setViewMode('auction');
                                }
                            }}
                            disabled={filteredPlayers.length === 0}
                            className={cn(
                                "group relative flex items-center gap-3 px-10 py-3 font-black text-xl rounded-full transition-all hover:scale-105 active:scale-95 shadow-2xl",
                                filteredPlayers.length > 0
                                    ? "bg-yellow-500 text-black hover:bg-yellow-400"
                                    : "bg-gray-800 text-gray-500 cursor-not-allowed"
                            )}
                        >
                            <Play className={cn("w-6 h-6", filteredPlayers.length > 0 ? "fill-black" : "fill-gray-500")} />
                            START AUCTION
                            {filteredPlayers.length > 0 && (
                                <span className="absolute -inset-1 rounded-full bg-yellow-400/20 blur-xl group-hover:bg-yellow-400/40 transition-colors" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-start py-4 px-4 relative">
            <div className="w-full max-w-6xl flex justify-between items-center mb-4 relative z-10 shrink-0">
                <button
                    onClick={() => setViewMode('list')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" /> Back to Player List
                </button>
                <div className="flex items-center gap-4">
                    {selectedPos !== 'ALL' && (
                        <span className="px-2 py-0.5 rounded bg-white/10 text-white text-[10px] font-black tracking-widest uppercase">
                            {selectedPos} ONLY
                        </span>
                    )}
                    <span className="text-xl font-black text-white/20 tracking-widest">{category} AUCTION</span>
                </div>
            </div>

            <AnimatePresence mode='wait'>
                {isComplete ? (
                    <motion.div
                        key="complete"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 relative z-10 flex flex-col justify-center h-full"
                    >
                        <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-6" />
                        <h2 className="text-4xl font-bold text-white mb-4">Batch Complete!</h2>
                        <p className="text-gray-400 mb-8">
                            You've auctioned all players {selectedPos !== 'ALL' ? `in ${selectedPos} position` : `in the ${category} tier`}.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => setViewMode('list')}
                                className="px-8 py-3 bg-white/10 text-white border border-white/10 font-bold rounded-full hover:bg-white/20 transition-colors"
                            >
                                Back to List
                            </button>
                            <button
                                onClick={onBack}
                                className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
                            >
                                Home
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <div className="flex flex-col items-center w-full relative z-10 pb-20">
                        <div className="relative shrink-0 scale-90 origin-top">
                            <PlayerCard
                                key={filteredPlayers[currentIndex].id}
                                player={filteredPlayers[currentIndex]}
                            />

                            <AnimatePresence>
                                {justSold && (
                                    <motion.div
                                        initial={{ scale: 2, opacity: 0, rotate: -20 }}
                                        animate={{ scale: 1, opacity: 1, rotate: -12 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
                                    >
                                        <div className="border-[8px] rounded-lg p-4 backdrop-blur-sm transform rotate-[-12deg] border-red-600 bg-red-600/20">
                                            <h2 className="text-6xl font-black uppercase tracking-widest drop-shadow-md text-red-600">
                                                SOLD
                                            </h2>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="flex flex-col items-center w-full max-w-2xl mt-4 shrink-0">
                            <button
                                onClick={() => setCurrentIndex((prev) => prev + 1)}
                                className="mb-4 px-6 py-2 rounded-full border border-gray-500/50 text-gray-400 hover:bg-white/10 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider"
                                disabled={assigning || justSold}
                            >
                                Skip Player
                            </button>

                            <TeamSelector
                                teams={teams}
                                onSelect={handleTeamClick}
                                disabled={assigning || justSold}
                            />
                        </div>

                        <div className="mt-4 text-gray-600 text-xs">
                            Player {currentIndex + 1} of {filteredPlayers.length}
                        </div>
                    </div>
                )}
            </AnimatePresence>

            <ConfirmationModal
                isOpen={showModal}
                playerName={filteredPlayers[currentIndex]?.name || ''}
                teamName={selectedTeam?.name || ''}
                onConfirm={handleConfirmSale}
                onCancel={() => setShowModal(false)}
            />
        </div>
    );
}
