'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar, Footer } from '@/components/layout';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import BalanceCard from '@/components/wallet/BalanceCard';

const LEVEL_COLORS = {
  bronze: 'from-amber-700 to-yellow-800 text-amber-300 border-amber-600/50',
  silver: 'from-slate-400 to-slate-500 text-slate-200 border-slate-400/50',
  gold: 'from-yellow-400 to-amber-500 text-yellow-900 border-yellow-500/50',
  platinum: 'from-cyan-300 to-slate-300 text-slate-900 border-cyan-400/50',
  diamond: 'from-violet-400 to-fuchsia-400 text-white border-violet-400/50',
};

const LEVEL_LABELS = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
  diamond: 'Diamond ★',
};

export default function UserDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [transactions, setTransactions] = useState([]);
  const [myMatches, setMyMatches] = useState([]);
  const [recommendedMatches, setRecommendedMatches] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch dashboard data
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchDashboardData = async () => {
      setLoadingData(true);
      try {
        const [txRes, matchesRes] = await Promise.all([
          api.getTransactions(1, 6).catch(() => ({ transactions: [] })),
          api.getMatches({ status: 'upcoming,registration_open,live', limit: 20 }).catch(() => ({ matches: [] })),
        ]);

        const allTx = txRes.transactions || [];
        setTransactions(allTx.slice(0, 5));

        const allMatches = matchesRes.matches || [];

        // Find matches the current user has joined
        const userId = user?._id || user?.id;
        const joined = allMatches.filter((m) => {
          const joinedUsers = m.joinedUsers || [];
          return joinedUsers.some((ju) => {
            const juId = ju.user?._id || ju.user?.id || ju.user || ju._id;
            return juId?.toString() === userId?.toString();
          });
        });
        setMyMatches(joined.slice(0, 4));

        // Recommended: upcoming challenges (not joined by user)
        const recommended = allMatches
          .filter((m) => {
            const joinedUsers = m.joinedUsers || [];
            const isJoined = joinedUsers.some((ju) => {
              const juId = ju.user?._id || ju.user?.id || ju.user || ju._id;
              return juId?.toString() === userId?.toString();
            });
            return !isJoined && (m.isChallenge || m.status === 'registration_open');
          })
          .slice(0, 6);
        setRecommendedMatches(recommended);
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, user]);

  if (authLoading || !isAuthenticated) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
        </div>
      </>
    );
  }

  const level = user?.level || 'bronze';
  const levelClass = LEVEL_COLORS[level] || LEVEL_COLORS.bronze;
  const levelLabel = LEVEL_LABELS[level] || 'Bronze';

  const stats = [
    { label: 'Matches Played', value: user?.matchesPlayed || 0, icon: '🎮' },
    { label: 'Matches Won', value: user?.matchesWon || 0, icon: '🏆' },
    {
      label: 'Win Rate',
      value: user?.matchesPlayed
        ? `${Math.round(((user.matchesWon || 0) / user.matchesPlayed) * 100)}%`
        : '0%',
      icon: '📈',
    },
    { label: 'Total Earnings', value: `₹${user?.totalEarnings || 0}`, icon: '💰' },
  ];

  const quickActions = [
    { href: '/matches', label: 'Browse Matches', icon: '🔎', desc: 'Find & join' },
    { href: '/create-match', label: 'Create Challenge', icon: '➕', desc: 'Host a match' },
    { href: '/wallet/deposit', label: 'Add Money', icon: '💳', desc: 'Top up wallet' },
    { href: '/missions', label: 'Missions', icon: '🎯', desc: 'Earn XP & rewards' },
    { href: '/leaderboard', label: 'Leaderboard', icon: '🥇', desc: 'See rankings' },
    { href: '/profile/history', label: 'Match History', icon: '📜', desc: 'Past results' },
  ];

  const handleAddMoney = () => router.push('/wallet/deposit');
  const handleWithdraw = () => router.push('/wallet/withdraw');

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 pt-16 md:pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                    Welcome back, <span className="text-white">{user?.username || user?.name || 'Player'}</span>
                  </h1>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border bg-gradient-to-r ${levelClass}`}
                  >
                    {levelLabel}
                  </span>
                </div>
                <p className="text-dark-400">
                  {user?.xp ? `${user.xp} XP` : 'Ready to dominate?'} • Level up by playing and completing missions
                </p>
              </div>

              <Link
                href="/profile"
                className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 self-start sm:self-auto"
              >
                View full profile →
              </Link>
            </div>
          </div>

          {/* Wallet + Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
            {/* Wallet */}
            <div className="lg:col-span-2">
              <BalanceCard
                wallet={user?.walletBalance || 0}
                bonus={user?.bonusBalance || 0}
                winnings={user?.totalEarnings || 0}
                onAddMoney={handleAddMoney}
                onWithdraw={handleWithdraw}
              />
            </div>

            {/* Quick Stats */}
            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="card p-4 sm:p-5 flex flex-col justify-between hover:border-cyan-500/30 transition-colors"
                >
                  <div className="text-2xl mb-3 opacity-80">{stat.icon}</div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-white tracking-tighter">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-dark-400 mt-0.5">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {quickActions.map((action, i) => (
                <Link
                  key={i}
                  href={action.href}
                  className="group card-hover p-4 rounded-2xl border border-white/5 bg-gray-900/60 hover:bg-gray-900/90 hover:border-cyan-500/30 flex flex-col justify-center min-h-[92px] transition-all active:scale-[0.985]"
                >
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{action.icon}</div>
                  <div className="font-semibold text-white text-sm">{action.label}</div>
                  <div className="text-[11px] text-dark-400">{action.desc}</div>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* My Active / Upcoming Matches */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-lg font-semibold text-white">My Matches</h2>
                <Link href="/profile/history" className="text-xs text-cyan-400 hover:underline">
                  View all →
                </Link>
              </div>

              <div className="card p-1">
                {loadingData ? (
                  <div className="p-8 text-center text-dark-400">Loading your matches...</div>
                ) : myMatches.length > 0 ? (
                  <div className="divide-y divide-white/5">
                    {myMatches.map((match) => {
                      const status = match.status || 'upcoming';
                      return (
                        <Link
                          key={match._id}
                          href={`/matches/${match._id}`}
                          className="flex items-center justify-between p-4 hover:bg-white/5 rounded-xl transition-colors group"
                        >
                          <div className="min-w-0 pr-4">
                            <div className="font-medium text-white group-hover:text-cyan-400 transition-colors truncate">
                              {match.title}
                            </div>
                            <div className="text-xs text-dark-400 mt-0.5">
                              {match.mode?.toUpperCase()} • {match.gameType?.replace('_', ' ')} • {formatDateTime(match.scheduledAt)}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-sm font-semibold text-emerald-400">
                              ₹{match.prizePool || 0}
                            </div>
                            <div className="text-[10px] uppercase tracking-wider text-dark-400">
                              {status === 'live' ? 'LIVE' : 'UPCOMING'}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="text-4xl mb-3 opacity-60">🎯</div>
                    <p className="text-dark-400 mb-4">You haven&apos;t joined any upcoming matches yet.</p>
                    <Link href="/matches" className="btn-primary inline-block px-6 py-2 text-sm">
                      Browse Matches
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                <Link href="/wallet/transactions" className="text-xs text-cyan-400 hover:underline">
                  Full history →
                </Link>
              </div>

              <div className="card p-1">
                {loadingData ? (
                  <div className="p-8 text-center text-dark-400">Loading activity...</div>
                ) : transactions.length > 0 ? (
                  <div className="divide-y divide-white/5">
                    {transactions.map((tx, index) => {
                      const isCredit = ['credit', 'deposit', 'winning', 'match_prize', 'tournament_prize', 'refund', 'referral_bonus'].includes(
                        tx.category || tx.type
                      );
                      return (
                        <div key={index} className="flex items-center justify-between p-4 text-sm">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0 ${isCredit ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                              {isCredit ? '↑' : '↓'}
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-white truncate">
                                {tx.description || tx.category || 'Transaction'}
                              </div>
                              <div className="text-xs text-dark-400">{formatDateTime(tx.createdAt || tx.date)}</div>
                            </div>
                          </div>
                          <div className={`font-semibold tabular-nums flex-shrink-0 ${isCredit ? 'text-emerald-400' : 'text-red-400'}`}>
                            {isCredit ? '+' : ''}{formatCurrency(tx.amount)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center text-dark-400">
                    No recent transactions yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Discover / Recommended */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-lg font-semibold text-white">Recommended for You</h2>
              <Link href="/matches" className="text-xs text-cyan-400 hover:underline">See all matches →</Link>
            </div>

            {loadingData ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card h-28 animate-pulse bg-gray-900/60" />
                ))}
              </div>
            ) : recommendedMatches.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendedMatches.map((match) => (
                  <Link
                    key={match._id}
                    href={`/matches/${match._id}`}
                    className="card p-4 hover:border-cyan-500/40 group flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-1 pr-2">
                        {match.title}
                      </div>
                      <div className="text-emerald-400 font-bold text-sm whitespace-nowrap">₹{match.prizePool}</div>
                    </div>
                    <div className="text-xs text-dark-400 mb-auto">
                      {match.mode?.toUpperCase()} • {match.gameType?.replace(/_/g, ' ')} • {match.filledSlots || match.joinedUsers?.length || 0}/{match.maxSlots} joined
                    </div>
                    <div className="text-[11px] text-cyan-400 mt-3 font-medium">Join now →</div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="card p-6 text-center text-dark-400">
                No open challenges right now. Check back soon!
              </div>
            )}
          </div>

          {/* Bottom CTA */}
          <div className="mt-10 text-center">
            <Link
              href="/missions"
              className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full border border-white/10 hover:bg-white/5 transition-colors"
            >
              🎯 Complete today&apos;s missions to earn XP and rewards
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
