'use client';

import { useState, useEffect } from 'react';

export default function WeaponStats() {
    const [weaponData, setWeaponData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWeaponData();
    }, []);

    const fetchWeaponData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/player-analytics/weapon-stats`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            if (data.success) {
                setWeaponData(data.data);
            }
        } catch (error) {
            console.error('Error fetching weapon data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-400">Loading weapon stats...</div>
                </div>
            </div>
        );
    }

    if (!weaponData || weaponData.length === 0) {
        return (
            <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-400">No weapon data available</div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Weapon Statistics</h2>
            <div className="space-y-4">
                {weaponData.map((weapon, index) => (
                    <WeaponCard key={index} weapon={weapon} rank={index + 1} />
                ))}
            </div>
        </div>
    );
}

function WeaponCard({ weapon, rank }) {
    const rankColors = {
        1: 'from-yellow-400 to-yellow-500',
        2: 'from-gray-300 to-gray-400',
        3: 'from-amber-600 to-amber-700'
    };

    const rankBadge = rank <= 3 ? (
        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${rankColors[rank]} flex items-center justify-center text-sm font-bold text-gray-900`}>
            {rank}
        </div>
    ) : (
        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm font-bold text-gray-300">
            {rank}
        </div>
    );

    return (
        <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                    {rankBadge}
                    <div>
                        <h3 className="font-semibold capitalize">{weapon.weaponName}</h3>
                        <p className="text-sm text-gray-400">{weapon.usageCount} uses</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-red-400">{weapon.kills}</p>
                    <p className="text-sm text-gray-400">Kills</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <StatItem label="Damage" value={weapon.damage} />
                <StatItem label="Headshots" value={weapon.headshots} />
                <StatItem label="Accuracy" value={`${weapon.accuracy}%`} />
            </div>

            {weapon.lastUsed && (
                <div className="mt-3 pt-3 border-t border-gray-600">
                    <p className="text-sm text-gray-400">
                        Last used: <span className="text-white">{new Date(weapon.lastUsed).toLocaleDateString()}</span>
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
