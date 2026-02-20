'use client';

import { useState, useEffect } from 'react';

export default function ModePerformance() {
    const [modeData, setModeData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchModeData();
    }, []);

    const fetchModeData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/player-analytics/mode-performance`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            if (data.success) {
                setModeData(data.data);
            }
        } catch (error) {
            console.error('Error fetching mode data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-400">Loading mode performance...</div>
                </div>
            </div>
        );
    }

    if (!modeData || modeData.length === 0) {
        return (
            <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-400">No mode data available</div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Mode Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {modeData.map((mode, index) => (
                    <ModeCard key={index} mode={mode} />
                ))}
            </div>
        </div>
    );
}

function ModeCard({ mode }) {
    const modeConfig = {
        solo: {
            icon: '👤',
            color: 'from-blue-500 to-blue-600',
            label: 'Solo'
        },
        duo: {
            icon: '👥',
            color: 'from-green-500 to-green-600',
            label: 'Duo'
        },
        squad: {
            icon: '👨‍👩‍👧‍👦',
            color: 'from-purple-500 to-purple-600',
            label: 'Squad'
        }
    };

    const config = modeConfig[mode.mode] || modeConfig.solo;

    return (
        <div className="bg-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-2xl`}>
                        {config.icon}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">{config.label}</h3>
                        <p className="text-sm text-gray-400">{mode.matchesPlayed} matches</p>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <ProgressBar
                    label="Win Rate"
                    value={mode.winRate}
                    color="bg-green-500"
                />
                <ProgressBar
                    label="K/D Ratio"
                    value={Math.min(mode.kdRatio * 20, 100)}
                    color="bg-blue-500"
                />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-600">
                <StatItem label="Kills" value={mode.totalKills} />
                <StatItem label="Deaths" value={mode.totalDeaths} />
                <StatItem label="Wins" value={mode.matchesWon} />
                <StatItem label="Earnings" value={`₹${mode.earnings}`} />
            </div>
        </div>
    );
}

function ProgressBar({ label, value, color }) {
    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">{label}</span>
                <span className="font-medium">{typeof value === 'number' ? value.toFixed(1) : value}%</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
                <div
                    className={`${color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(value, 100)}%` }}
                />
            </div>
        </div>
    );
}

function StatItem({ label, value }) {
    return (
        <div className="text-center">
            <p className="text-lg font-semibold">{value}</p>
            <p className="text-xs text-gray-400">{label}</p>
        </div>
    );
}
