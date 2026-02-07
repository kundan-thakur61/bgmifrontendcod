'use client';

import { useState, useEffect } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import axios from 'axios';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function AnalyticsPage() {
    const [stats, setStats] = useState(null);
    const [trends, setTrends] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('30d');

    useEffect(() => {
        fetchAnalytics();
    }, [period]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const [statsRes, trendsRes] = await Promise.all([
                axios.get('/api/analytics/me', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }),
                axios.get(`/api/analytics/trends?period=${period}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
            ]);

            setStats(statsRes.data.data);
            setTrends(trendsRes.data.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
                <div className="animate-spin text-6xl">📊</div>
            </div>
        );
    }

    // Chart data
    const trendData = {
        labels: trends?.map(t => new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })) || [],
        datasets: [
            {
                label: 'Kills',
                data: trends?.map(t => t.kills) || [],
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Matches',
                data: trends?.map(t => t.matches) || [],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    const winRateData = {
        labels: ['Wins', 'Losses'],
        datasets: [{
            data: [stats?.totalWins || 0, stats?.totalLosses || 0],
            backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.8)'],
            borderColor: ['rgb(34, 197, 94)', 'rgb(239, 68, 68)'],
            borderWidth: 2
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: '#fff' },
                position: 'top'
            }
        },
        scales: {
            x: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(255,255,255,0.1)' } },
            y: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(255,255,255,0.1)' } }
        }
    };

    const getTrendIcon = () => {
        const trend = stats?.performanceTrend;
        if (trend === 'hot') return '🔥';
        if (trend === 'good') return '📈';
        if (trend === 'cold') return '❄️';
        return '➡️';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-600 mb-2">
                            Player Analytics
                        </h1>
                        <p className="text-gray-300 text-lg">Track your performance and improve your game</p>
                    </div>

                    {/* Period Selector */}
                    <div className="flex gap-2 bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/20">
                        {['7d', '30d', '90d'].map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-6 py-2 rounded-lg font-semibold transition-all ${period === p
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-300 hover:bg-white/10'
                                    }`}
                            >
                                {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Performance Indicator */}
                <div className="mb-8">
                    <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${stats?.performanceTrend === 'hot' ? 'bg-red-500/20 border-red-500/50' :
                            stats?.performanceTrend === 'good' ? 'bg-green-500/20 border-green-500/50' :
                                stats?.performanceTrend === 'cold' ? 'bg-blue-500/20 border-blue-500/50' :
                                    'bg-gray-500/20 border-gray-500/50'
                        } border-2`}>
                        <span className="text-3xl">{getTrendIcon()}</span>
                        <span className="text-white font-bold text-lg">
                            {stats?.performanceTrend === 'hot' ? 'On Fire!' :
                                stats?.performanceTrend === 'good' ? 'Playing Well' :
                                    stats?.performanceTrend === 'cold' ? 'Keep Practicing' :
                                        'Steady Performance'}
                        </span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-purple-500/20 to-purple-700/20 backdrop-blur-md rounded-2xl p-6 border border-purple-500/30">
                        <div className="text-purple-300 text-sm mb-2">Skill Rating</div>
                        <div className="text-4xl font-bold text-white mb-1">{stats?.skillRating || 1000}</div>
                        <div className="text-purple-300 text-xs">ELO Rating</div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500/20 to-green-700/20 backdrop-blur-md rounded-2xl p-6 border border-green-500/30">
                        <div className="text-green-300 text-sm mb-2">Win Rate</div>
                        <div className="text-4xl font-bold text-white mb-1">{stats?.winRate?.toFixed(1) || 0}%</div>
                        <div className="text-green-300 text-xs">{stats?.totalWins || 0} wins</div>
                    </div>

                    <div className="bg-gradient-to-br from-red-500/20 to-red-700/20 backdrop-blur-md rounded-2xl p-6 border border-red-500/30">
                        <div className="text-red-300 text-sm mb-2">K/D Ratio</div>
                        <div className="text-4xl font-bold text-white mb-1">{stats?.kdRatio?.toFixed(2) || 0}</div>
                        <div className="text-red-300 text-xs">{stats?.totalKills || 0} kills</div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-700/20 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30">
                        <div className="text-blue-300 text-sm mb-2">Total Matches</div>
                        <div className="text-4xl font-bold text-white mb-1">{stats?.totalMatches || 0}</div>
                        <div className="text-blue-300 text-xs">Games played</div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Performance Trends */}
                    <div className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                        <h3 className="text-2xl font-bold text-white mb-6">Performance Trends</h3>
                        <div className="h-80">
                            <Line data={trendData} options={chartOptions} />
                        </div>
                    </div>

                    {/* Win/Loss Ratio */}
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                        <h3 className="text-2xl font-bold text-white mb-6">Win/Loss Ratio</h3>
                        <div className="h-80 flex items-center justify-center">
                            <Doughnut
                                data={winRateData}
                                options={{
                                    ...chartOptions,
                                    cutout: '70%',
                                    plugins: {
                                        legend: { labels: { color: '#fff' } }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Streaks */}
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                        <h3 className="text-2xl font-bold text-white mb-6">🔥 Streaks</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                <div>
                                    <div className="text-gray-400 text-sm">Current Win Streak</div>
                                    <div className="text-2xl font-bold text-white">{stats?.currentWinStreak || 0} games</div>
                                </div>
                                <div className="text-4xl">🎯</div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                <div>
                                    <div className="text-gray-400 text-sm">Longest Win Streak</div>
                                    <div className="text-2xl font-bold text-yellow-400">{stats?.longestWinStreak || 0} games</div>
                                </div>
                                <div className="text-4xl">🏆</div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                <div>
                                    <div className="text-gray-400 text-sm">Chicken Dinners</div>
                                    <div className="text-2xl font-bold text-orange-400">{stats?.chickenDinners || 0}</div>
                                </div>
                                <div className="text-4xl">🍗</div>
                            </div>
                        </div>
                    </div>

                    {/* Achievements */}
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                        <h3 className="text-2xl font-bold text-white mb-6">🏅 Achievements</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                <div>
                                    <div className="text-gray-400 text-sm">MVP Count</div>
                                    <div className="text-2xl font-bold text-white">{stats?.mvpCount || 0}</div>
                                </div>
                                <div className="text-4xl">⭐</div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                <div>
                                    <div className="text-gray-400 text-sm">Ace Matches (5+ Kills)</div>
                                    <div className="text-2xl font-bold text-red-400">{stats?.aceCount || 0}</div>
                                </div>
                                <div className="text-4xl">🎖️</div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                <div>
                                    <div className="text-gray-400 text-sm">Average Damage</div>
                                    <div className="text-2xl font-bold text-purple-400">{stats?.averageDamage?.toFixed(0) || 0}</div>
                                </div>
                                <div className="text-4xl">💥</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Matches */}
                <div className="mt-8 bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                    <h3 className="text-2xl font-bold text-white mb-6">Recent Matches</h3>
                    <div className="space-y-3">
                        {stats?.recentMatches?.slice(0, 5).map((match, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${match.result === 'win' ? 'bg-green-500/20' : 'bg-red-500/20'
                                        }`}>
                                        {match.result === 'win' ? '✓' : '✗'}
                                    </div>
                                    <div>
                                        <div className="text-white font-semibold">
                                            {match.result === 'win' ? 'Victory' : 'Defeat'} - Rank #{match.placement}
                                        </div>
                                        <div className="text-gray-400 text-sm">
                                            {new Date(match.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-6 text-center">
                                    <div>
                                        <div className="text-red-400 font-bold text-xl">{match.kills}</div>
                                        <div className="text-gray-400 text-xs">Kills</div>
                                    </div>
                                    <div>
                                        <div className="text-blue-400 font-bold text-xl">{match.damage}</div>
                                        <div className="text-gray-400 text-xs">Damage</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
