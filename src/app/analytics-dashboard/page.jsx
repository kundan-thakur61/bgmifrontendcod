'use client';

import { useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import PerformanceChart from '@/components/analytics/PerformanceChart';
import MapPerformance from '@/components/analytics/MapPerformance';
import ModePerformance from '@/components/analytics/ModePerformance';
import WeaponStats from '@/components/analytics/WeaponStats';
import EarningsChart from '@/components/analytics/EarningsChart';
import InsightsPanel from '@/components/analytics/InsightsPanel';
import ComparativeStats from '@/components/analytics/ComparativeStats';
import MatchHistory from '@/components/analytics/MatchHistory';
import TimeBasedPerformance from '@/components/analytics/TimeBasedPerformance';

export default function AnalyticsDashboard() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [chartPeriod, setChartPeriod] = useState('7d');
    const [chartMetric, setChartMetric] = useState('kills');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/player-analytics/dashboard`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setDashboardData(data.data);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading analytics...</div>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">No analytics data available</div>
            </div>
        );
    }

    const { summary, analytics, recentMatches, recentTransactions } = dashboardData;

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
                    <p className="text-gray-300">Track your gaming performance and statistics</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <SummaryCard
                        title="Total Matches"
                        value={summary.totalMatches}
                        icon="🎮"
                        color="from-blue-500 to-blue-600"
                    />
                    <SummaryCard
                        title="Total Wins"
                        value={summary.totalWins}
                        icon="🏆"
                        color="from-green-500 to-green-600"
                    />
                    <SummaryCard
                        title="Total Kills"
                        value={summary.totalKills}
                        icon="💀"
                        color="from-red-500 to-red-600"
                    />
                    <SummaryCard
                        title="Total Earnings"
                        value={`₹${summary.totalEarnings}`}
                        icon="💰"
                        color="from-yellow-500 to-yellow-600"
                    />
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        title="Win Rate"
                        value={`${summary.winRate.toFixed(1)}%`}
                        icon="📊"
                        trend={analytics.performanceTrend.last7Days.winRate > analytics.performanceTrend.last30Days.winRate ? 'up' : 'down'}
                    />
                    <StatCard
                        title="K/D Ratio"
                        value={summary.kdRatio.toFixed(2)}
                        icon="⚔️"
                        trend={analytics.performanceTrend.last7Days.kdRatio > analytics.performanceTrend.last30Days.kdRatio ? 'up' : 'down'}
                    />
                    <StatCard
                        title="Skill Rating"
                        value={summary.skillRating}
                        icon="⭐"
                        trend="neutral"
                    />
                </div>

                {/* Tabs */}
                <div className="flex space-x-4 mb-8 border-b border-gray-700">
                    <TabButton
                        active={activeTab === 'overview'}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </TabButton>
                    <TabButton
                        active={activeTab === 'performance'}
                        onClick={() => setActiveTab('performance')}
                    >
                        Performance
                    </TabButton>
                    <TabButton
                        active={activeTab === 'maps'}
                        onClick={() => setActiveTab('maps')}
                    >
                        Maps
                    </TabButton>
                    <TabButton
                        active={activeTab === 'weapons'}
                        onClick={() => setActiveTab('weapons')}
                    >
                        Weapons
                    </TabButton>
                    <TabButton
                        active={activeTab === 'earnings'}
                        onClick={() => setActiveTab('earnings')}
                    >
                        Earnings
                    </TabButton>
                    <TabButton
                        active={activeTab === 'history'}
                        onClick={() => setActiveTab('history')}
                    >
                        History
                    </TabButton>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Performance Chart */}
                        <div className="bg-gray-800 rounded-xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Performance Trend</h2>
                                <div className="flex space-x-2">
                                    <select
                                        value={chartPeriod}
                                        onChange={(e) => setChartPeriod(e.target.value)}
                                        className="bg-gray-700 text-white px-4 py-2 rounded-lg"
                                    >
                                        <option value="7d">Last 7 Days</option>
                                        <option value="30d">Last 30 Days</option>
                                        <option value="90d">Last 90 Days</option>
                                    </select>
                                    <select
                                        value={chartMetric}
                                        onChange={(e) => setChartMetric(e.target.value)}
                                        className="bg-gray-700 text-white px-4 py-2 rounded-lg"
                                    >
                                        <option value="kills">Kills</option>
                                        <option value="wins">Wins</option>
                                        <option value="matches">Matches</option>
                                        <option value="earnings">Earnings</option>
                                        <option value="kd">K/D Ratio</option>
                                    </select>
                                </div>
                            </div>
                            <PerformanceChart period={chartPeriod} metric={chartMetric} />
                        </div>

                        {/* Insights and Comparative Stats */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <InsightsPanel />
                            <ComparativeStats />
                        </div>

                        {/* Recent Matches */}
                        <div className="bg-gray-800 rounded-xl p-6">
                            <h2 className="text-2xl font-bold mb-6">Recent Matches</h2>
                            <MatchHistory matches={recentMatches.slice(0, 5)} />
                        </div>
                    </div>
                )}

                {activeTab === 'performance' && (
                    <div className="space-y-8">
                        <ModePerformance />
                        <TimeBasedPerformance />
                    </div>
                )}

                {activeTab === 'maps' && (
                    <div className="space-y-8">
                        <MapPerformance />
                    </div>
                )}

                {activeTab === 'weapons' && (
                    <div className="space-y-8">
                        <WeaponStats />
                    </div>
                )}

                {activeTab === 'earnings' && (
                    <div className="space-y-8">
                        <EarningsChart />
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="space-y-8">
                        <MatchHistory matches={recentMatches} showAll />
                    </div>
                )}
            </div>
        </div>
    );
}

// Summary Card Component
function SummaryCard({ title, value, icon, color }) {
    return (
        <div className={`bg-gradient-to-br ${color} rounded-xl p-6 shadow-lg`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-white/80 text-sm mb-1">{title}</p>
                    <p className="text-3xl font-bold text-white">{value}</p>
                </div>
                <div className="text-4xl">{icon}</div>
            </div>
        </div>
    );
}

// Stat Card Component
function StatCard({ title, value, icon, trend }) {
    const trendColors = {
        up: 'text-green-400',
        down: 'text-red-400',
        neutral: 'text-gray-400'
    };

    const trendIcons = {
        up: '↑',
        down: '↓',
        neutral: '→'
    };

    return (
        <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-400 text-sm mb-1">{title}</p>
                    <p className="text-2xl font-bold">{value}</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl mb-1">{icon}</div>
                    <div className={`text-sm ${trendColors[trend]}`}>
                        {trendIcons[trend]}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Tab Button Component
function TabButton({ active, onClick, children }) {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-3 font-medium transition-colors ${
                active
                    ? 'text-purple-400 border-b-2 border-purple-400'
                    : 'text-gray-400 hover:text-white'
            }`}
        >
            {children}
        </button>
    );
}
