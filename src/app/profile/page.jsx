'use client';

import { useState, useEffect } from 'react';
import { Navbar, Footer } from '@/components/layout';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import LevelBadge from '@/components/dashboard/LevelBadge';
import Link from 'next/link';
import { suggestPWAInstall, cacheCriticalUrls } from '@/lib/sw-register';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    gameId: '',
  });
  const [achievements, setAchievements] = useState([]);
  const [careerStats, setCareerStats] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.name || user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        gameId: user.gameProfiles?.pubgMobile?.inGameId || user.gameId || '',
        youtube: user.streaming?.youtube || '',
        twitch: user.streaming?.twitch || '',
      });

      // Load rich profile data
      loadProfileExtras();

      // PWA polish: pre-cache key app pages for offline + fast mobile experience
      cacheCriticalUrls(['/matches', '/wallet', '/profile', '/leaderboard', '/tournaments']);
    }
  }, [user]);

  const loadProfileExtras = async () => {
    try {
      // Achievements (top unlocked)
      const achData = await api.getUserAchievements().catch(() => ({}));
      const unlocked = Object.values(achData.achievements || {})
        .flat()
        .filter(a => a.isUnlocked)
        .sort((a, b) => new Date(b.unlockedAt || 0) - new Date(a.unlockedAt || 0))
        .slice(0, 6);
      setAchievements(unlocked);

      // Career stats (kills, earnings etc from matches)
      const hist = await api.getMatchHistory({ limit: 200 }).catch(() => ({}));
      const matches = hist.matches || [];
      const totalKills = matches.reduce((sum, m) => sum + (m.kills || m.joinedUser?.kills || 0), 0);
      const totalPrize = matches.reduce((sum, m) => sum + (m.prizewon || m.joinedUser?.prizewon || 0), 0);

      setCareerStats({
        totalKills,
        totalPrize: totalPrize || (user?.totalEarnings || 0),
        matchesAnalyzed: matches.length,
      });
    } catch (e) {
      // Non-fatal
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const data = await api.updateProfile(formData);
      // Also save streaming if changed
      if (formData.youtube !== undefined || formData.twitch !== undefined) {
        await api.updateStreaming({ 
          youtube: formData.youtube, 
          twitch: formData.twitch 
        });
      }
      updateUser(data.user);
      setIsEditing(false);
      // Polish: gently suggest PWA install after user has invested (profile complete)
      suggestPWAInstall();
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const displayUser = user || {};

  const matchesPlayed = displayUser.matchesPlayed || 0;
  const matchesWon = displayUser.matchesWon || 0;
  const winRate = matchesPlayed > 0 ? Math.round((matchesWon / matchesPlayed) * 100) : 0;

  const stats = [
    { label: 'Matches Played', value: matchesPlayed },
    { label: 'Chicken Dinners', value: matchesWon },
    { label: 'Win Rate', value: `${winRate}%` },
    { label: 'Total Earnings', value: `₹${(displayUser.totalEarnings || 0).toLocaleString()}` },
  ];

  const kd = careerStats && careerStats.matchesAnalyzed > 0
    ? (careerStats.totalKills / careerStats.matchesAnalyzed).toFixed(2)
    : (matchesWon > 0 ? (matchesWon * 3.2).toFixed(1) : '—'); // rough proxy if no kills data

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen pt-16 sm:pt-20">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-bold font-display mb-6 sm:mb-8">Profile</h1>

          {/* Profile Card */}
          <div className="card p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
              {/* Avatar */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-500 to-gaming-purple rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold flex-shrink-0">
                {(displayUser.username || 'U')[0].toUpperCase()}
              </div>
              
              <div className="flex-1 text-center sm:text-left min-w-0">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1 sm:mb-2">
                  <h2 className="text-xl sm:text-2xl font-bold truncate">{displayUser.username}</h2>
                  <LevelBadge level={displayUser.level} xp={displayUser.xp} />
                  {displayUser.kycStatus === 'verified' && (
                    <span className="badge badge-success">Verified</span>
                  )}
                </div>
                <p className="text-dark-400 text-sm">Member since {formatDate(displayUser.createdAt)}</p>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn-outline w-full sm:w-auto min-h-[44px]"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6 p-3 sm:p-4 bg-dark-700/50 rounded-lg">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-primary-400">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-dark-400">{stat.label}</div>
                </div>
              ))}
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-primary-400">{kd}</div>
                <div className="text-xs sm:text-sm text-dark-400">K/D Ratio</div>
              </div>
            </div>

            {/* Level & XP Progress */}
            <div className="mb-6 p-4 bg-dark-800/60 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <LevelBadge level={displayUser.level} xp={displayUser.xp} />
                  <span className="text-sm text-gray-400">Level Progress</span>
                </div>
                <span className="text-xs text-cyan-400">{displayUser.xp || 0} XP</span>
              </div>
              <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 transition-all"
                  style={{ width: `${Math.min(((displayUser.xp || 0) % 5000) / 50, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                <span>Current: {displayUser.level || 'bronze'}</span>
                <Link href="/achievements" className="hover:text-cyan-400">View all achievements →</Link>
              </div>
            </div>

            {/* Achievement Badges (top unlocked) */}
            {achievements.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2 px-1">
                  <div className="text-sm font-semibold text-white">Recent Badges</div>
                  <Link href="/achievements" className="text-xs text-cyan-400 hover:underline">All →</Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {achievements.map((a, idx) => (
                    <div key={idx} title={a.name} className="w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border border-yellow-500/30 flex items-center justify-center text-xl" >
                      {a.icon || '🏆'}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Form */}
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="label">Username</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="input"
                    />
                  ) : (
                    <p className="px-4 py-2.5 bg-dark-700/50 rounded-lg">{displayUser.username}</p>
                  )}
                </div>

                <div>
                  <label className="label">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input"
                    />
                  ) : (
                    <p className="px-4 py-2.5 bg-dark-700/50 rounded-lg">{displayUser.email}</p>
                  )}
                </div>

                <div>
                  <label className="label">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input"
                    />
                  ) : (
                    <p className="px-4 py-2.5 bg-dark-700/50 rounded-lg">{displayUser.phone}</p>
                  )}
                </div>

                <div>
                  <label className="label">Game ID</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.gameId}
                      onChange={(e) => setFormData({ ...formData, gameId: e.target.value })}
                      className="input"
                    />
                  ) : (
                    <p className="px-4 py-2.5 bg-dark-700/50 rounded-lg">{displayUser.gameId}</p>
                  )}
                </div>

                {/* Streaming Links for Hub + SEO */}
                <div className="md:col-span-2">
                  <label className="label">Streaming (YouTube / Twitch) — appears in Streaming Hub</label>
                  {isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input type="text" placeholder="YouTube channel URL" value={formData.youtube || displayUser.streaming?.youtube || ''} onChange={(e) => setFormData({ ...formData, youtube: e.target.value })} className="input" />
                      <input type="text" placeholder="Twitch username" value={formData.twitch || displayUser.streaming?.twitch || ''} onChange={(e) => setFormData({ ...formData, twitch: e.target.value })} className="input" />
                    </div>
                  ) : (
                    <div className="flex gap-3 text-sm">
                      {displayUser.streaming?.youtube && <a href={displayUser.streaming.youtube} target="_blank" className="text-red-400 hover:underline">YouTube</a>}
                      {displayUser.streaming?.twitch && <a href={`https://twitch.tv/${displayUser.streaming.twitch}`} target="_blank" className="text-purple-400 hover:underline">Twitch</a>}
                      {!displayUser.streaming?.youtube && !displayUser.streaming?.twitch && <span className="text-dark-400">Not linked</span>}
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* PWA Mobile App Polish - Install prompt + benefits (revenue + retention) */}
          <div className="mb-6 p-4 bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <div className="font-semibold text-white flex items-center gap-2">📱 Get the full mobile app</div>
              <div className="text-sm text-dark-400">Install for instant push alerts (room credentials, winnings), offline browsing, faster wallet access, and a true native feel on Android/iOS.</div>
            </div>
            <button
              onClick={() => suggestPWAInstall()}
              className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-xl text-sm whitespace-nowrap active:scale-[0.985] transition"
            >
              Install BattleXZone
            </button>
          </div>

          {/* Quick Links + History */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            <Link href="/profile/history" className="card-hover p-3 sm:p-4 text-center min-h-[80px] flex flex-col items-center justify-center">
              <span className="text-xl sm:text-2xl mb-1 sm:mb-2 block">📜</span>
              <span className="font-medium text-xs sm:text-base">Match History</span>
            </Link>
            <a href="/achievements" className="card-hover p-3 sm:p-4 text-center min-h-[80px] flex flex-col items-center justify-center">
              <span className="text-xl sm:text-2xl mb-1 sm:mb-2 block">🏆</span>
              <span className="font-medium text-xs sm:text-base">Achievements</span>
            </a>
            <a href="/kyc" className="card-hover p-3 sm:p-4 text-center min-h-[80px] flex flex-col items-center justify-center">
              <span className="text-xl sm:text-2xl mb-1 sm:mb-2 block">📋</span>
              <span className="font-medium text-xs sm:text-base">KYC Verification</span>
            </a>
            <a href="/referrals" className="card-hover p-3 sm:p-4 text-center min-h-[80px] flex flex-col items-center justify-center">
              <span className="text-xl sm:text-2xl mb-1 sm:mb-2 block">🤝</span>
              <span className="font-medium text-xs sm:text-base">Refer & Earn</span>
            </a>
            <a href="/battle-pass" className="card-hover p-3 sm:p-4 text-center min-h-[80px] flex flex-col items-center justify-center border border-yellow-500/30">
              <span className="text-xl sm:text-2xl mb-1 sm:mb-2 block">🎟️</span>
              <span className="font-medium text-xs sm:text-base">Battle Pass</span>
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
