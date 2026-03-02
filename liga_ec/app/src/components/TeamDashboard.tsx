'use client';

import { motion } from 'framer-motion';
import { Shield, User, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Player, Team } from '../types';

interface TeamWithPlayers extends Team {
    players: Player[];
}

export function TeamDashboard() {
    const [teamsData, setTeamsData] = useState<TeamWithPlayers[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const { data: teams, error: teamsError } = await supabase
                    .from('teams')
                    .select('*')
                    .order('name');

                if (teamsError) throw teamsError;

                const { data: players, error: playersError } = await supabase
                    .from('players')
                    .select('*');

                if (playersError) throw playersError;

                // Group players by team
                const formattedData = teams.map(team => ({
                    ...team,
                    players: players.filter(p => p.team_id === team.id)
                }));

                setTeamsData(formattedData);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        // Initial fetch
        fetchTeams();

        // Subscribe to changes for live updates
        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                },
                () => {
                    fetchTeams();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    if (loading) return (
        <div className="w-full py-12 text-center text-gray-500 animate-pulse">
            Updating Live Stats...
        </div>
    );

    return (
        <div className="w-full flex flex-col p-1">
            <div className="flex items-center gap-4 mb-4 shrink-0 bg-slate-900/90 p-2 z-10 backdrop-blur-md rounded-lg border border-white/5">
                <Users className="w-5 h-5 text-yellow-500" />
                <h2 className="text-lg font-bold text-white tracking-widest uppercase">Live Squads</h2>
            </div>

            <div className="">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                    {teamsData.map((team, index) => (
                        <motion.div
                            key={team.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden"
                        >
                            {/* Team Header */}
                            <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-white/5 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-white">{team.name}</h3>
                                <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
                                    <Shield className="w-3 h-3" />
                                    <span>{team.players.length} Players</span>
                                </div>
                            </div>

                            {/* Players Table */}
                            <div className="p-0">
                                <table className="w-full text-xs">
                                    <thead className="bg-white/5 text-gray-400 font-medium text-[10px] uppercase tracking-wider">
                                        <tr>
                                            <th className="px-3 py-2 text-left">Player</th>
                                            <th className="px-3 py-2 text-right">Pos</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {team.players.length === 0 ? (
                                            <tr>
                                                <td colSpan={2} className="px-3 py-6 text-center text-gray-600 italic">
                                                    No players signed yet
                                                </td>
                                            </tr>
                                        ) : (
                                            team.players.map((player) => (
                                                <tr key={player.id} className="hover:bg-white/5 transition-colors group">
                                                    <td className="px-3 py-2 text-gray-200 flex items-center gap-2">
                                                        <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-600 relative shrink-0">
                                                            {player.image_url ? (
                                                                <>
                                                                    <img
                                                                        src={player.image_url}
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            (e.target as HTMLImageElement).style.display = 'none';
                                                                            e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                                                                        }}
                                                                    />
                                                                    <User className="w-2.5 h-2.5 text-gray-400 absolute fallback-icon hidden" />
                                                                </>
                                                            ) : (
                                                                <User className="w-2.5 h-2.5 text-gray-400" />
                                                            )}
                                                        </div>
                                                        <span className="font-medium group-hover:text-yellow-400 transition-colors truncate max-w-[120px]">{player.name}</span>
                                                    </td>
                                                    <td className="px-3 py-2 text-right">
                                                        <span className={`
                                inline-block px-1.5 py-0.5 rounded text-[9px] font-bold text-black
                                ${player.position === 'GK' ? 'bg-yellow-500' : ''}
                                ${player.position === 'DEF' ? 'bg-blue-400' : ''}
                                ${player.position === 'MID' ? 'bg-emerald-400' : ''}
                                ${player.position === 'FWD' ? 'bg-red-400' : ''}
                              `}>
                                                            {player.position}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer Summary (Optional) */}
                            <div className="p-2 bg-black/20 border-t border-white/5 text-center">
                                <div className="w-full h-0.5 bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500/50"
                                        style={{ width: `${(team.players.length / 15) * 100}%` }} // Assuming ~15 squad size max
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
