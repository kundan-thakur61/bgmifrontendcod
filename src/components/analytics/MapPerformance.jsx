'use client';

import { useState, useEffect } from 'react';

export default function MapPerformance() {
    const [mapData, setMapData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMapData();
    }, []);

    const fetchMapData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/player-analytics/map-performance`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            if (data.success) {
                setMapData(data.data);
            }
        } catch (error) {
            console.error('Error fetching map data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-400">Loading map performance...</div>
                </div>
            </div>
        );
    }

    if (!mapData || mapData.length === 0) {
        return (
            <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-400">No map data available</div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Map Performance</h2>
            <div className="space-y-4">
                {mapData.map((map, index) => (
                    <MapCard key={index} map={map} />
                ))}
            </div>
        </div>
    );
}

function MapCard({ map }) {
    const mapColors = {
        erangel: 'from-green-500 to-green-600',
        miramar: 'from-yellow-500 to-yellow-600',
        sanhok: 'from-green-400 to-green-500',
        vikendi: 'from-blue-400 to-blue-500',
        livik: 'from-purple-400 to-purple-500',
        karakin: 'from-orange-400 to-orange-500',
        bermuda: 'from-pink-400 to-pink-500',
        purgatory: 'from-red-400 to-red-500',
        kalahari: 'from-amber-400 to-amber-500',
        alpine: 'from-cyan-400 to-cyan-500',
        nextera: 'from-indigo-400 to-indigo-500',
        other: 'from-gray-500 to-gray-600'
    };

    const gradient = mapColors[map.mapName.toLowerCase()] || mapColors.other;

    return (
        <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold`}>
                        {map.mapName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-semibold capitalize">{map.mapName}</h3>
                        <p className="text-sm text-gray-400">{map.matchesPlayed} matches</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-green-400">{map.winRate.toFixed(1)}%</p>
                    <p className="text-sm text-gray-400">Win Rate</p>
                </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
                <StatItem label="Kills" value={map.totalKills} />
                <StatItem label="Deaths" value={map.totalDeaths} />
                <StatItem label="K/D" value={map.kdRatio.toFixed(2)} />
            </div>

            {map.favoriteWeapon && (
                <div className="mt-3 pt-3 border-t border-gray-600">
                    <p className="text-sm text-gray-400">
                        Favorite Weapon: <span className="text-white font-medium">{map.favoriteWeapon}</span>
                    </p>
                </div>
            )}
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
