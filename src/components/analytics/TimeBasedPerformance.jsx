'use client';

import { useState, useEffect } from 'react';

export default function TimeBasedPerformance() {
    const [timeData, setTimeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('hourly'); // 'hourly' or 'daily'

    useEffect(() => {
        fetchTimeData();
    }, []);

    const fetchTimeData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/player-analytics/time-based-performance`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            if (data.success) {
                setTimeData(data.data);
            }
        } catch (error) {
            console.error('Error fetching time-based data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-400">Loading time-based performance...</div>
                </div>
            </div>
        );
    }

    if (!timeData) {
        return (
            <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-400">No time-based data available</div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Time-Based Performance</h2>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setView('hourly')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            view === 'hourly'
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        Hourly
                    </button>
                    <button
                        onClick={() => setView('daily')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            view === 'daily'
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        Daily
                    </button>
                </div>
            </div>

            {view === 'hourly' ? (
                <HourlyChart data={timeData.hourly} />
            ) : (
                <DailyChart data={timeData.daily} />
            )}
        </div>
    );
}

function HourlyChart({ data }) {
    const maxValue = Math.max(...data.map(d => d.matchesPlayed), 1);

    return (
        <div>
            <div className="h-48 flex items-end justify-between gap-1 mb-4">
                {data.map((hour, index) => {
                    const height = (hour.matchesPlayed / maxValue) * 100;
                    return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                            <div
                                className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all duration-300 hover:from-blue-500 hover:to-blue-300 relative group"
                                style={{ height: `${Math.max(height, 5)}%` }}
                            >
                                {/* Tooltip */}
                                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    <div>{hour.matchesPlayed} matches</div>
                                    <div>{hour.totalKills} kills</div>
                                    <div>{hour.winRate.toFixed(1)}% win</div>
                                </div>
                            </div>
                            <div className="text-xs text-gray-400 mt-2">
                                {hour.hour}:00
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Best Time */}
            <div className="bg-gray-700 rounded-lg p-4">
                <BestTimeCard
                    title="Best Playing Hour"
                    data={data}
                    metric="matchesPlayed"
                    label="matches"
                />
            </div>
        </div>
    );
}

function DailyChart({ data }) {
    const maxValue = Math.max(...data.map(d => d.matchesPlayed), 1);

    return (
        <div>
            <div className="h-48 flex items-end justify-between gap-1 mb-4">
                {data.map((day, index) => {
                    const height = (day.matchesPlayed / maxValue) * 100;
                    return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                            <div
                                className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t transition-all duration-300 hover:from-green-500 hover:to-green-300 relative group"
                                style={{ height: `${Math.max(height, 5)}%` }}
                            >
                                {/* Tooltip */}
                                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    <div>{day.dayName}</div>
                                    <div>{day.matchesPlayed} matches</div>
                                    <div>{day.totalKills} kills</div>
                                    <div>{day.winRate.toFixed(1)}% win</div>
                                </div>
                            </div>
                            <div className="text-xs text-gray-400 mt-2">
                                {day.dayName.substring(0, 3)}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Best Day */}
            <div className="bg-gray-700 rounded-lg p-4">
                <BestTimeCard
                    title="Best Playing Day"
                    data={data}
                    metric="matchesPlayed"
                    label="matches"
                />
            </div>
        </div>
    );
}

function BestTimeCard({ title, data, metric, label }) {
    const best = data.reduce((best, current) => 
        current[metric] > best[metric] ? current : best
    );

    return (
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-400">{title}</p>
                <p className="text-lg font-semibold">
                    {best.dayName || `${best.hour}:00`}
                </p>
            </div>
            <div className="text-right">
                <p className="text-2xl font-bold text-green-400">{best[metric]}</p>
                <p className="text-sm text-gray-400">{label}</p>
            </div>
        </div>
    );
}
