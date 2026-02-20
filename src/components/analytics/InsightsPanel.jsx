'use client';

import { useState, useEffect } from 'react';

export default function InsightsPanel() {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInsights();
    }, []);

    const fetchInsights = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/player-analytics/insights`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            if (data.success) {
                setInsights(data.data);
            }
        } catch (error) {
            console.error('Error fetching insights:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-400">Loading insights...</div>
                </div>
            </div>
        );
    }

    if (!insights || insights.length === 0) {
        return (
            <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-400">No insights available</div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Performance Insights</h2>
            <div className="space-y-4">
                {insights.map((insight, index) => (
                    <InsightCard key={index} insight={insight} />
                ))}
            </div>
        </div>
    );
}

function InsightCard({ insight }) {
    const typeConfig = {
        strength: {
            bgColor: 'bg-green-900/30',
            borderColor: 'border-green-500',
            iconBg: 'bg-green-500'
        },
        weakness: {
            bgColor: 'bg-red-900/30',
            borderColor: 'border-red-500',
            iconBg: 'bg-red-500'
        },
        trend: {
            bgColor: 'bg-blue-900/30',
            borderColor: 'border-blue-500',
            iconBg: 'bg-blue-500'
        },
        achievement: {
            bgColor: 'bg-yellow-900/30',
            borderColor: 'border-yellow-500',
            iconBg: 'bg-yellow-500'
        },
        recommendation: {
            bgColor: 'bg-purple-900/30',
            borderColor: 'border-purple-500',
            iconBg: 'bg-purple-500'
        }
    };

    const config = typeConfig[insight.type] || typeConfig.recommendation;

    return (
        <div className={`${config.bgColor} border-l-4 ${config.borderColor} rounded-lg p-4`}>
            <div className="flex items-start space-x-3">
                <div className={`${config.iconBg} w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0`}>
                    {insight.icon}
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold mb-1">{insight.title}</h3>
                    <p className="text-sm text-gray-300">{insight.description}</p>
                </div>
            </div>
        </div>
    );
}
