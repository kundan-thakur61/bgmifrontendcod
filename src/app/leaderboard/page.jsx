'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/layout';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const TABS = [
    { id: 'global', label: 'All Time', icon: '🏆' },
    { id: 'weekly', label: 'This Week', icon: '📅' },
    { id: 'monthly', label: 'This Month', icon: '📆' },
    { id: 'kills', label: 'Top Kills', icon: '🎯' },
];

const GAME_FILTERS = [
    { id: '', label: 'All Games' },
    { id: 'pubg_mobile', label: 'PUBG Mobile' },
    { id: 'free_fire', label: 'Free Fire' },
];

export default function LeaderboardPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('global');
    const [gameFilter, setGameFilter] = useState('');
    const [leaderboard, setLeaderboard] = useState([]);
    const [userRank, setUserRank] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0 });

    useEffect(() => {
        fetchLeaderboard();
    }, [activeTab, gameFilter]);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                ...(gameFilter && { gameType: gameFilter }),
            };

            const data = await api.getLeaderboard(activeTab, params);
            setLeaderboard(data.leaderboard || []);
            setUserRank(data.userRank);
            setPagination(prev => ({ ...prev, total: data.pagination?.total || 0 }));
        } catch (err) {
            console.error('Failed to fetch leaderboard:', err);
        } finally {
            setLoading(false);
        }
    };

    const getRankBadge = (rank) => {
        if (rank === 1) return { emoji: '🥇', color: 'from-yellow-400 to-yellow-600', text: 'text-yellow-400' };
        if (rank === 2) return { emoji: '🥈', color: 'from-gray-300 to-gray-500', text: 'text-gray-300' };
        if (rank === 3) return { emoji: '🥉', color: 'from-orange-400 to-orange-600', text: 'text-orange-400' };
        return { emoji: '', color: 'from-cyan-500/20 to-purple-500/20', text: 'text-gray-400' };
    };

    const getLevelBadge = (level) => {
        const levels = {
            bronze: { color: 'bg-orange-900/50 text-orange-400', icon: '🔶' },
            silver: { color: 'bg-gray-700/50 text-gray-300', icon: '⬜' },
            gold: { color: 'bg-yellow-900/50 text-yellow-400', icon: '🔸' },
            platinum: { color: 'bg-cyan-900/50 text-cyan-400', icon: '💎' },
            diamond: { color: 'bg-purple-900/50 text-purple-400', icon: '👑' },
        };
        return levels[level] || levels.bronze;
    };

    return (
        <>
            <Navbar />

            <main className="min-h-screen pt-16 sm:pt-20 bg-gradient-to-b from-gray-900 via-black to-gray-900" suppressHydrationWarning>
                <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
                    {/* Header */}
                    <div className="text-center mb-8 sm:mb-12">
                        <h1 className="text-3xl sm:text-5xl font-bold mb-3 sm:mb-4">
                            <span className="text-white">BATTLE</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">ZONE</span>
                            <span className="text-white"> RANKINGS</span>
                        </h1>
                        <p className="text-gray-400 text-sm sm:text-lg">
                            See how you stack up against the best players
                        </p>
                    </div>

                    {/* User's Rank Card (if logged in) */}
                    {user && userRank && (
                        <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-cyan-900/30 to-purple-900/30 rounded-2xl border border-cyan-500/30">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold flex-shrink-0">
                                        {(user.name || 'U')[0].toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-base sm:text-xl font-bold text-white truncate">{user.name || 'Player'}</h3>
                                        <p className="text-gray-400 text-xs sm:text-sm">Your Current Rank</p>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                                        #{userRank}
                                    </div>
                                    <p className="text-gray-400 text-xs sm:text-sm">{activeTab === 'global' ? 'All Time' : activeTab}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tabs — horizontally scrollable on mobile */}
                    <div className="flex gap-2 mb-5 sm:mb-6 overflow-x-auto pb-1 -mx-3 px-3 sm:mx-0 sm:px-0 sm:flex-wrap" style={{ scrollbarWidth: 'none' }}>
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-shrink-0 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 text-sm sm:text-base min-h-[44px] tap-scale ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/30'
                                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'
                                    }`}
                            >
                                <span>{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Game Filter — scrollable on mobile */}
                    <div className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto pb-1 -mx-3 px-3 sm:mx-0 sm:px-0" style={{ scrollbarWidth: 'none' }}>
                        {GAME_FILTERS.map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setGameFilter(filter.id)}
                                className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all min-h-[44px] tap-scale ${gameFilter === filter.id
                                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                                    : 'bg-gray-800/30 text-gray-400 hover:text-white border border-transparent'
                                    }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    {/* Leaderboard Table */}
                    <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800 overflow-hidden">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-800/50 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                            <div className="col-span-1 text-center">Rank</div>
                            <div className="col-span-5">Player</div>
                            <div className="col-span-2 text-center">Matches</div>
                            <div className="col-span-2 text-center">Win Rate</div>
                            <div className="col-span-2 text-right">
                                {activeTab === 'kills' ? 'Total Kills' : 'Earnings'}
                            </div>
                        </div>

                        {/* Loading — shimmer skeleton */}
                        {loading ? (
                            <div className="p-4 sm:p-8 space-y-3">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-gray-800/20">
                                        <div className="skeleton h-8 w-8 rounded-full flex-shrink-0" />
                                        <div className="skeleton h-10 w-10 rounded-full flex-shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <div className="skeleton h-4 rounded" style={{ width: '55%' }} />
                                            <div className="skeleton h-3 rounded" style={{ width: '35%' }} />
                                        </div>
                                        <div className="skeleton h-5 w-16 rounded flex-shrink-0" />
                                    </div>
                                ))}
                            </div>
                        ) : leaderboard.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="text-5xl mb-4">🎮</div>
                                <h3 className="text-xl font-bold text-white mb-2">No Rankings Yet</h3>
                                <p className="text-gray-400">Play matches to appear on the leaderboard!</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-800">
                                {leaderboard.map((entry) => {
                                    const rankBadge = getRankBadge(entry.rank);
                                    const userData = entry.user || entry;
                                    const levelBadge = getLevelBadge(userData.level);

                                    return (
                                        <div
                                            key={entry.rank}
                                            className={`transition-colors hover:bg-gray-800/30 ${entry.rank <= 3 ? 'bg-gradient-to-r ' + rankBadge.color + '/10' : ''}`}
                                        >
                                            {/* ── MOBILE card (block on <md) ── */}
                                            <div className="md:hidden flex items-center gap-3 px-4 py-3">
                                                <div className="w-8 flex-shrink-0 text-center">
                                                    {entry.rank <= 3 ? (
                                                        <span className="text-xl">{rankBadge.emoji}</span>
                                                    ) : (
                                                        <span className={`text-sm font-bold ${rankBadge.text}`}>#{entry.rank}</span>
                                                    )}
                                                </div>
                                                <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                    {(userData.name || 'U')[0].toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-semibold text-white text-sm truncate">{userData.name || 'Unknown'}</div>
                                                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${levelBadge.color}`}>
                                                        {levelBadge.icon} {userData.level}
                                                    </span>
                                                </div>
                                                <div className="flex-shrink-0 text-right">
                                                    <div className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 whitespace-nowrap">
                                                        {activeTab === 'kills'
                                                            ? `${entry.totalKills || 0} 🎯`
                                                            : `₹${(entry.totalEarnings || userData.totalEarnings || 0).toLocaleString()}`
                                                        }
                                                    </div>
                                                    <div className="text-xs text-gray-500">{entry.matchesPlayed || 0} matches</div>
                                                </div>
                                            </div>

                                            {/* ── DESKTOP row (grid on md+) ── */}
                                            <div className="hidden md:grid md:grid-cols-12 md:gap-4 px-6 py-4">
                                                <div className="col-span-1 flex items-center justify-center">
                                                    {entry.rank <= 3 ? (
                                                        <span className="text-2xl">{rankBadge.emoji}</span>
                                                    ) : (
                                                        <span className={`text-lg font-bold ${rankBadge.text}`}>#{entry.rank}</span>
                                                    )}
                                                </div>
                                                <div className="col-span-5 flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                                        {(userData.name || 'U')[0].toUpperCase()}
                                                    </div>
                                                    <div className="font-semibold text-white flex items-center gap-2">
                                                        {userData.name || 'Unknown Player'}
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${levelBadge.color}`}>
                                                            {levelBadge.icon} {userData.level}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-span-2 flex items-center justify-center">
                                                    <span className="text-gray-300">{entry.matchesPlayed || userData.matchesPlayed || 0}</span>
                                                </div>
                                                <div className="col-span-2 flex items-center justify-center">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                                                            <div className="h-full bg-gradient-to-r from-cyan-400 to-green-400" style={{ width: `${entry.winRate || 0}%` }} />
                                                        </div>
                                                        <span className="text-gray-300 text-sm">{entry.winRate || 0}%</span>
                                                    </div>
                                                </div>
                                                <div className="col-span-2 flex items-center justify-end">
                                                    <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
                                                        {activeTab === 'kills'
                                                            ? entry.totalKills || 0
                                                            : `₹${(entry.totalEarnings || userData.totalEarnings || 0).toLocaleString()}`
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Load More */}
                    {leaderboard.length > 0 && leaderboard.length < pagination.total && (
                        <div className="text-center mt-6 sm:mt-8">
                            <button
                                onClick={() => {
                                    setPagination(prev => ({ ...prev, page: prev.page + 1 }));
                                    fetchLeaderboard();
                                }}
                                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all min-h-[48px] tap-scale"
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}
