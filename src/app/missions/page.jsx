'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function MissionsPage() {
    const [activeTab, setActiveTab] = useState('missions'); // 'missions', 'seasonpass'
    const [missions, setMissions] = useState([]);
    const [userProgress, setUserProgress] = useState(null);
    const [seasonPass, setSeasonPass] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [missionsRes, progressRes, passRes] = await Promise.all([
                axios.get('/api/gamification/missions', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }),
                axios.get('/api/gamification/progress', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }),
                axios.get('/api/gamification/season-pass', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
            ]);

            setMissions(missionsRes.data.data || []);
            setUserProgress(progressRes.data.data);
            setSeasonPass(passRes.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const claimMissionReward = async (missionId) => {
        try {
            await axios.post(`/api/gamification/missions/${missionId}/claim`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchData();
            alert('Reward claimed! 🎉');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to claim reward');
        }
    };

    const claimPassReward = async (tier) => {
        try {
            await axios.post('/api/gamification/season-pass/claim',
                { tier },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            fetchData();
            alert('Season Pass reward claimed! 🎁');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to claim reward');
        }
    };

    const purchasePremium = async () => {
        if (!confirm('Purchase Premium Season Pass for 999 coins?')) return;
        try {
            await axios.post('/api/gamification/season-pass/purchase', {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchData();
            alert('Premium Season Pass activated! 🌟');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to purchase');
        }
    };

    const getMissionIcon = (type) => {
        const icons = {
            daily: '📅',
            weekly: '📆',
            special: '⭐',
            seasonal: '🎯'
        };
        return icons[type] || '🎮';
    };

    const getCategoryIcon = (category) => {
        const icons = {
            matches: '🎮',
            kills: '💀',
            tournaments: '🏆',
            social: '👥',
            wallet: '💰'
        };
        return icons[category] || '🎯';
    };

    const MissionCard = ({ mission }) => {
        const progress = userProgress?.missionProgress?.find(p => p.mission === mission._id);
        const isCompleted = progress?.completed || false;
        const currentProgress = progress?.progress || 0;
        const progressPercent = (currentProgress / mission.requirement.count) * 100;

        return (
            <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 transition-all ${isCompleted
                    ? 'border-green-500/50 bg-green-500/10'
                    : 'border-white/20 hover:border-purple-500/50'
                }`}>
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl ${isCompleted ? 'bg-green-500/20' : 'bg-purple-500/20'
                        }`}>
                        {getMissionIcon(mission.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h3 className="text-white font-bold text-lg">{mission.title}</h3>
                                <p className="text-gray-400 text-sm">{mission.description}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${mission.type === 'daily' ? 'bg-blue-500/20 text-blue-400' :
                                    mission.type === 'weekly' ? 'bg-purple-500/20 text-purple-400' :
                                        mission.type === 'special' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-red-500/20 text-red-400'
                                }`}>
                                {mission.type.toUpperCase()}
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">Progress</span>
                                <span className="text-white font-semibold">
                                    {currentProgress} / {mission.requirement.count}
                                </span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-3">
                                <div
                                    className={`h-3 rounded-full transition-all ${isCompleted ? 'bg-green-500' : 'bg-purple-500'
                                        }`}
                                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Rewards & Actions */}
                        <div className="flex items-center justify-between">
                            <div className="flex gap-4">
                                {mission.rewards.xp > 0 && (
                                    <div className="flex items-center gap-1 text-blue-400">
                                        <span>⚡</span>
                                        <span className="font-bold">{mission.rewards.xp} XP</span>
                                    </div>
                                )}
                                {mission.rewards.coins > 0 && (
                                    <div className="flex items-center gap-1 text-yellow-400">
                                        <span>💰</span>
                                        <span className="font-bold">{mission.rewards.coins} Coins</span>
                                    </div>
                                )}
                            </div>

                            {isCompleted && !progress?.claimed && (
                                <button
                                    onClick={() => claimMissionReward(mission._id)}
                                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all"
                                >
                                    🎁 Claim
                                </button>
                            )}
                            {progress?.claimed && (
                                <span className="px-6 py-2 bg-green-600/20 text-green-400 rounded-lg font-semibold">
                                    ✓ Claimed
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const PassTier = ({ tier, rewards, isCurrent, isPassed, hasPremium }) => {
        const canClaimFree = isPassed && !rewards.free.claimed;
        const canClaimPremium = isPassed && hasPremium && !rewards.premium?.claimed;

        return (
            <div className={`relative bg-white/10 backdrop-blur-md rounded-xl p-4 border-2 transition-all ${isCurrent ? 'border-purple-500 scale-105' : 'border-white/20'
                }`}>
                {/* Tier Number */}
                <div className="text-center mb-3">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold ${isCurrent ? 'bg-purple-600 text-white' : 'bg-white/20 text-gray-400'
                        }`}>
                        {tier}
                    </div>
                </div>

                {/* Free Reward */}
                <div className="mb-2 p-3 bg-white/5 rounded-lg">
                    <div className="text-gray-400 text-xs mb-1">FREE</div>
                    <div className="text-white text-sm font-semibold">{rewards.free.item}</div>
                    {canClaimFree && (
                        <button
                            onClick={() => claimPassReward(tier)}
                            className="mt-2 w-full px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded font-semibold"
                        >
                            Claim
                        </button>
                    )}
                    {rewards.free.claimed && (
                        <div className="mt-2 text-green-400 text-xs text-center">✓ Claimed</div>
                    )}
                </div>

                {/* Premium Reward */}
                <div className="p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/30">
                    <div className="text-yellow-400 text-xs mb-1">PREMIUM</div>
                    <div className={`text-sm font-semibold ${hasPremium ? 'text-white' : 'text-gray-500'}`}>
                        {rewards.premium?.item || 'Locked'}
                    </div>
                    {hasPremium && canClaimPremium && (
                        <button
                            onClick={() => claimPassReward(tier)}
                            className="mt-2 w-full px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded font-semibold"
                        >
                            Claim
                        </button>
                    )}
                    {hasPremium && rewards.premium?.claimed && (
                        <div className="mt-2 text-green-400 text-xs text-center">✓ Claimed</div>
                    )}
                    {!hasPremium && (
                        <div className="mt-2 text-gray-500 text-xs text-center">🔒 Premium Only</div>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 flex items-center justify-center">
                <div className="animate-spin text-6xl">🎮</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
                        Missions & Rewards
                    </h1>
                    <p className="text-gray-300 text-lg">Complete challenges and unlock exclusive rewards</p>
                </div>

                {/* Progress Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-700/20 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30">
                        <div className="text-blue-300 text-sm mb-2">Current Level</div>
                        <div className="text-4xl font-bold text-white mb-1">{userProgress?.level || 1}</div>
                        <div className="text-blue-300 text-xs">
                            {userProgress?.xp || 0} / {userProgress?.xpToNextLevel || 100} XP
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2 mt-3">
                            <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${((userProgress?.xp || 0) / (userProgress?.xpToNextLevel || 100)) * 100}%` }}
                            />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500/20 to-purple-700/20 backdrop-blur-md rounded-2xl p-6 border border-purple-500/30">
                        <div className="text-purple-300 text-sm mb-2">Login Streak</div>
                        <div className="text-4xl font-bold text-white mb-1">🔥 {userProgress?.dailyLoginStreak?.current || 0}</div>
                        <div className="text-purple-300 text-xs">
                            Longest: {userProgress?.dailyLoginStreak?.longest || 0} days
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-700/20 backdrop-blur-md rounded-2xl p-6 border border-yellow-500/30">
                        <div className="text-yellow-300 text-sm mb-2">Season Pass Tier</div>
                        <div className="text-4xl font-bold text-white mb-1">{userProgress?.seasonPass?.currentTier || 1}</div>
                        <div className="text-yellow-300 text-xs">
                            {userProgress?.seasonPass?.isPremium ? '👑 Premium' : 'Free Pass'}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('missions')}
                        className={`px-8 py-3 rounded-xl font-semibold transition-all ${activeTab === 'missions'
                                ? 'bg-purple-600 text-white'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                    >
                        📋 Missions
                    </button>
                    <button
                        onClick={() => setActiveTab('seasonpass')}
                        className={`px-8 py-3 rounded-xl font-semibold transition-all ${activeTab === 'seasonpass'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                    >
                        🎁 Season Pass
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'missions' && (
                    <div className="space-y-4">
                        {missions.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📭</div>
                                <p className="text-gray-400 text-lg">No active missions right now</p>
                            </div>
                        ) : (
                            missions.map((mission) => <MissionCard key={mission._id} mission={mission} />)
                        )}
                    </div>
                )}

                {activeTab === 'seasonpass' && (
                    <div>
                        {/* Season Pass Header */}
                        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-3xl p-8 mb-8 shadow-2xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-2">
                                        {seasonPass?.name || 'Season 1 Pass'}
                                    </h2>
                                    <p className="text-white/80">
                                        Ends: {seasonPass?.endDate ? new Date(seasonPass.endDate).toLocaleDateString() : 'TBA'}
                                    </p>
                                </div>
                                {!userProgress?.seasonPass?.isPremium && (
                                    <button
                                        onClick={purchasePremium}
                                        className="px-8 py-4 bg-white text-yellow-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all"
                                    >
                                        👑 Unlock Premium - 999 Coins
                                    </button>
                                )}
                                {userProgress?.seasonPass?.isPremium && (
                                    <div className="px-8 py-4 bg-white/20 text-white rounded-xl font-bold text-lg">
                                        ✓ Premium Active
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Pass Tiers Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
                            {seasonPass?.tiers?.slice(0, 50).map((tierData, idx) => {
                                const tier = idx + 1;
                                return (
                                    <PassTier
                                        key={tier}
                                        tier={tier}
                                        rewards={tierData}
                                        isCurrent={tier === userProgress?.seasonPass?.currentTier}
                                        isPassed={tier <= (userProgress?.seasonPass?.currentTier || 0)}
                                        hasPremium={userProgress?.seasonPass?.isPremium || false}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
