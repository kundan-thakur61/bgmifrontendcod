'use client';

import { useState, useEffect } from 'react';

export default function ComparativeStats() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/player-analytics/comparative-stats`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error('Error fetching comparative stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-400">Loading comparative stats...</div>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-400">No comparative data available</div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Your Ranking</h2>
            
            {/* Global Rank */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Global Rank</span>
                    <span className="text-3xl font-bold text-purple-400">{stats.global}%</span>
                </div>
                <ProgressBar value={stats.global} color="bg-purple-500" />
            </div>

            {/* Individual Stats */}
            <div className="space-y-4">
                <StatRow
                    label="Kills"
                    value={stats.kills}
                    color="bg-red-500"
                    icon="💀"
                />
                <StatRow
                    label="Wins"
                    value={stats.wins}
                    color="bg-green-500"
                    icon="🏆"
                />
                <StatRow
                    label="Earnings"
                    value={stats.earnings}
                    color="bg-yellow-500"
                    icon="💰"
                />
            </div>

            {/* Rank Badge */}
            <div className="mt-6 pt-6 border-t border-gray-700">
                <RankBadge percentile={stats.global} />
            </div>
        </div>
    );
}

function StatRow({ label, value, color, icon }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                    <span>{icon}</span>
                    <span className="text-gray-400">{label}</span>
                </div>
                <span className="font-semibold">{value}%</span>
            </div>
            <ProgressBar value={value} color={color} />
        </div>
    );
}

function ProgressBar({ value, color }) {
    return (
        <div className="w-full bg-gray-700 rounded-full h-3">
            <div
                className={`${color} h-3 rounded-full transition-all duration-500`}
                style={{ width: `${value}%` }}
            />
        </div>
    );
}

function RankBadge({ percentile }) {
    let rank, color, icon;

    if (percentile >= 90) {
        rank = 'Elite';
        color = 'from-yellow-400 to-yellow-600';
        icon = '👑';
    } else if (percentile >= 75) {
        rank = 'Diamond';
        color = 'from-cyan-400 to-cyan-600';
        icon = '💎';
    } else if (percentile >= 50) {
        rank = 'Gold';
        color = 'from-yellow-500 to-yellow-700';
        icon = '🥇';
    } else if (percentile >= 25) {
        rank = 'Silver';
        color = 'from-gray-300 to-gray-500';
        icon = '🥈';
    } else {
        rank = 'Bronze';
        color = 'from-orange-400 to-orange-600';
        icon = '🥉';
    }

    return (
        <div className={`bg-gradient-to-r ${color} rounded-xl p-4 text-center`}>
            <div className="text-4xl mb-2">{icon}</div>
            <div className="text-2xl font-bold text-white">{rank}</div>
            <div className="text-sm text-white/80">Top {100 - percentile}% of players</div>
        </div>
    );
}
