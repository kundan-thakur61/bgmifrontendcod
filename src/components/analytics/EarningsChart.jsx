'use client';

import { useState, useEffect } from 'react';

export default function EarningsChart() {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('30d');
    const [showCumulative, setShowCumulative] = useState(false);

    useEffect(() => {
        fetchChartData();
    }, [period]);

    const fetchChartData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/player-analytics/earnings-chart?period=${period}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            if (data.success) {
                setChartData(data.data);
            }
        } catch (error) {
            console.error('Error fetching earnings data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-400">Loading earnings chart...</div>
                </div>
            </div>
        );
    }

    if (!chartData) {
        return (
            <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-400">No earnings data available</div>
                </div>
            </div>
        );
    }

    const { labels, dailyEarnings, cumulativeEarnings } = chartData;
    const data = showCumulative ? cumulativeEarnings : dailyEarnings;
    const maxValue = Math.max(...data, 1);
    const totalEarnings = cumulativeEarnings[cumulativeEarnings.length - 1] || 0;

    return (
        <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Earnings Overview</h2>
                    <p className="text-gray-400">Total Earnings: <span className="text-green-400 font-bold">₹{totalEarnings}</span></p>
                </div>
                <div className="flex space-x-2">
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="bg-gray-700 text-white px-4 py-2 rounded-lg"
                    >
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 90 Days</option>
                    </select>
                    <button
                        onClick={() => setShowCumulative(!showCumulative)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            showCumulative
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        {showCumulative ? 'Cumulative' : 'Daily'}
                    </button>
                </div>
            </div>

            <div className="h-64 flex items-end justify-between gap-1">
                {data.map((value, index) => {
                    const height = (value / maxValue) * 100;
                    return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                            <div
                                className={`w-full rounded-t-lg transition-all duration-300 hover:opacity-80 relative group ${
                                    showCumulative
                                        ? 'bg-gradient-to-t from-green-600 to-green-400'
                                        : 'bg-gradient-to-t from-yellow-600 to-yellow-400'
                                }`}
                                style={{ height: `${Math.max(height, 2)}%` }}
                            >
                                {/* Tooltip */}
                                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    ₹{value}
                                </div>
                            </div>
                            <div className="text-xs text-gray-400 mt-2 text-center">
                                {labels[index]}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-4 flex justify-center space-x-6">
                <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded ${showCumulative ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-sm text-gray-400">{showCumulative ? 'Cumulative' : 'Daily'} Earnings</span>
                </div>
            </div>
        </div>
    );
}
