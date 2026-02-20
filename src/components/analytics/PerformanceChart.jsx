'use client';

import { useState, useEffect } from 'react';

export default function PerformanceChart({ period = '7d', metric = 'kills' }) {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchChartData();
    }, [period, metric]);

    const fetchChartData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/player-analytics/performance-chart?period=${period}&metric=${metric}`,
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
            console.error('Error fetching chart data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-400">Loading chart...</div>
            </div>
        );
    }

    if (!chartData) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-400">No data available</div>
            </div>
        );
    }

    const { labels, chartData: data } = chartData;
    const maxValue = Math.max(...data, 1);
    const minValue = Math.min(...data, 0);

    return (
        <div className="relative">
            {/* Chart Container */}
            <div className="h-64 flex items-end justify-between gap-2">
                {data.map((value, index) => {
                    const height = ((value - minValue) / (maxValue - minValue)) * 100;
                    return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                            <div
                                className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all duration-300 hover:from-purple-500 hover:to-purple-300 relative group"
                                style={{ height: `${Math.max(height, 5)}%` }}
                            >
                                {/* Tooltip */}
                                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {metric === 'kd' ? value : value}
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
            <div className="mt-4 flex justify-center">
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-t from-purple-600 to-purple-400 rounded"></div>
                    <span className="text-sm text-gray-400 capitalize">{metric}</span>
                </div>
            </div>
        </div>
    );
}
