'use client';

import { useState, useEffect } from 'react';
import { WhatsappShareButton, TwitterShareButton, FacebookShareButton, TelegramShareButton } from 'react-share';
import axios from 'axios';

export default function EnhancedReferralPage() {
    const [referralData, setReferralData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchReferralData();
    }, []);

    const fetchReferralData = async () => {
        try {
            const response = await axios.get('/api/users/referral-stats', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setReferralData(response.data.data);
        } catch (error) {
            console.error('Error fetching referral data:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getTierInfo = (tier) => {
        const tiers = {
            bronze: { name: 'Bronze', color: 'from-amber-700 to-amber-900', icon: '🥉', next: 'Silver', required: 10 },
            silver: { name: 'Silver', color: 'from-gray-400 to-gray-600', icon: '🥈', next: 'Gold', required: 25 },
            gold: { name: 'Gold', color: 'from-yellow-400 to-yellow-600', icon: '🥇', next: 'Platinum', required: 50 },
            platinum: { name: 'Platinum', color: 'from-cyan-400 to-cyan-600', icon: '💎', next: 'Diamond', required: 100 },
            diamond: { name: 'Diamond', color: 'from-purple-400 to-purple-600', icon: '👑', next: 'Max', required: 0 }
        };
        return tiers[tier] || tiers.bronze;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
                <div className="animate-spin text-6xl">⚡</div>
            </div>
        );
    }

    const tierInfo = getTierInfo(referralData?.stats?.tier);
    const progress = referralData?.stats?.tierProgress?.current || 0;
    const required = referralData?.stats?.tierProgress?.required || 10;
    const progressPercent = (progress / required) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
                        Referral Program
                    </h1>
                    <p className="text-gray-300 text-lg">
                        Invite friends and earn rewards together!
                    </p>
                </div>

                {/* Current Tier */}
                <div className={`bg-gradient-to-r ${tierInfo.color} rounded-3xl p-8 mb-8 shadow-2xl`}>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <span className="text-6xl">{tierInfo.icon}</span>
                            <div>
                                <h2 className="text-3xl font-bold text-white">{tierInfo.name} Tier</h2>
                                <p className="text-white/80">
                                    {tierInfo.next !== 'Max' ? `Next: ${tierInfo.next}` : 'Maximum Tier Reached!'}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-bold text-white">{referralData?.stats?.activeReferrals || 0}</div>
                            <div className="text-white/80">Active Referrals</div>
                        </div>
                    </div>

                    {tierInfo.next !== 'Max' && (
                        <div>
                            <div className="flex justify-between text-white/90 mb-2">
                                <span>Progress to {tierInfo.next}</span>
                                <span>{progress} / {required}</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-4">
                                <div
                                    className="bg-white rounded-full h-4 transition-all duration-500"
                                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                        <div className="text-gray-400 text-sm mb-2">Total Referrals</div>
                        <div className="text-3xl font-bold text-white">{referralData?.stats?.totalReferrals || 0}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                        <div className="text-gray-400 text-sm mb-2">Total Earnings</div>
                        <div className="text-3xl font-bold text-green-400">₹{referralData?.stats?.totalEarnings || 0}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                        <div className="text-gray-400 text-sm mb-2">Conversion Rate</div>
                        <div className="text-3xl font-bold text-blue-400">{referralData?.stats?.conversionRate?.toFixed(1) || 0}%</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                        <div className="text-gray-400 text-sm mb-2">This Month</div>
                        <div className="text-3xl font-bold text-purple-400">
                            {referralData?.stats?.referralsByMonth?.[0]?.count || 0}
                        </div>
                    </div>
                </div>

                {/* Share Section */}
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 mb-8">
                    <h3 className="text-2xl font-bold text-white mb-6">Share Your Referral Link</h3>

                    {/* Referral Code */}
                    <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="text-gray-400 text-sm mb-1">Your Referral Code</div>
                                <div className="text-2xl font-mono font-bold text-white">{referralData?.referralCode}</div>
                            </div>
                            <button
                                onClick={() => copyToClipboard(referralData?.referralCode)}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                            >
                                {copied ? '✓ Copied!' : 'Copy Code'}
                            </button>
                        </div>
                    </div>

                    {/* Referral Link */}
                    <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="text-gray-400 text-sm mb-1">Referral Link</div>
                                <div className="text-sm font-mono text-white break-all">{referralData?.shareable?.link}</div>
                            </div>
                            <button
                                onClick={() => copyToClipboard(referralData?.shareable?.link)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all ml-4"
                            >
                                Copy Link
                            </button>
                        </div>
                    </div>

                    {/* Social Share Buttons */}
                    <div className="flex gap-4 justify-center flex-wrap">
                        <WhatsappShareButton url={referralData?.shareable?.link} title={referralData?.shareable?.message}>
                            <div className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all cursor-pointer">
                                <span>📱</span> WhatsApp
                            </div>
                        </WhatsappShareButton>

                        <TwitterShareButton url={referralData?.shareable?.link} title={referralData?.shareable?.message}>
                            <div className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all cursor-pointer">
                                <span>🐦</span> Twitter
                            </div>
                        </TwitterShareButton>

                        <FacebookShareButton url={referralData?.shareable?.link} quote={referralData?.shareable?.message}>
                            <div className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all cursor-pointer">
                                <span>📘</span> Facebook
                            </div>
                        </FacebookShareButton>

                        <TelegramShareButton url={referralData?.shareable?.link} title={referralData?.shareable?.message}>
                            <div className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all cursor-pointer">
                                <span>✈️</span> Telegram
                            </div>
                        </TelegramShareButton>
                    </div>
                </div>

                {/* Milestones */}
                {referralData?.stats?.milestones?.length > 0 && (
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                        <h3 className="text-2xl font-bold text-white mb-6">🏆 Milestones Achieved</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {referralData.stats.milestones.map((milestone, index) => (
                                <div key={index} className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-xl p-4 border border-yellow-400/30">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">🎯</span>
                                        <div>
                                            <div className="text-white font-semibold">{milestone.type.replace(/_/g, ' ').toUpperCase()}</div>
                                            <div className="text-green-400 font-bold">+₹{milestone.reward}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
