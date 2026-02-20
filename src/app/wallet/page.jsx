'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { formatCurrency, formatDateTime } from '@/lib/utils';

// Transaction type configurations with icons and colors
const TRANSACTION_CONFIG = {
  deposit: { icon: '💳', label: 'Deposit', color: 'text-green-400', bg: 'bg-green-500/10' },
  winning: { icon: '🏆', label: 'Winning', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  refund: { icon: '↩️', label: 'Refund', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  credit: { icon: '💰', label: 'Credit', color: 'text-green-400', bg: 'bg-green-500/10' },
  referral_bonus: { icon: '👥', label: 'Referral Bonus', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  match_prize: { icon: '🎮', label: 'Match Prize', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  tournament_prize: { icon: '🏅', label: 'Tournament Prize', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  bonus: { icon: '🎁', label: 'Bonus', color: 'text-pink-400', bg: 'bg-pink-500/10' },
  admin_credit: { icon: '⚙️', label: 'Admin Credit', color: 'text-green-400', bg: 'bg-green-500/10' },
  match_refund: { icon: '🔄', label: 'Match Refund', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  match_auto_refund: { icon: '⚡', label: 'Auto Refund', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  tournament_refund: { icon: '🔄', label: 'Tournament Refund', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  withdrawal: { icon: '💸', label: 'Withdrawal', color: 'text-red-400', bg: 'bg-red-500/10' },
  match_entry: { icon: '🎮', label: 'Match Entry', color: 'text-red-400', bg: 'bg-red-500/10' },
  tournament_entry: { icon: '🏅', label: 'Tournament Entry', color: 'text-red-400', bg: 'bg-red-500/10' },
  default: { icon: '💵', label: 'Transaction', color: 'text-gray-400', bg: 'bg-gray-500/10' },
};

const CREDIT_TYPES = ['deposit', 'winning', 'refund', 'credit', 'referral_bonus', 'match_prize', 'tournament_prize', 'bonus', 'admin_credit', 'match_refund', 'match_auto_refund', 'tournament_refund'];

// Mini Chart Component for spending/earnings trend
function MiniTrendChart({ data }) {
  const max = Math.max(...data.map(d => Math.abs(d)), 1);
  
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((value, index) => {
        const height = Math.max((Math.abs(value) / max) * 100, 8);
        const isPositive = value >= 0;
        return (
          <div
            key={index}
            className={`flex-1 rounded-t transition-all duration-300 ${
              isPositive ? 'bg-green-500/60' : 'bg-red-500/60'
            }`}
            style={{ height: `${height}%` }}
          />
        );
      })}
    </div>
  );
}

// Animated Counter Component
function AnimatedCounter({ value, prefix = '₹', duration = 1000 }) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setDisplayValue(Math.floor(progress * value));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [value, duration]);
  
  return <span>{prefix}{displayValue.toLocaleString('en-IN')}</span>;
}

// Skeleton Loader
function SkeletonCard() {
  return (
    <div className="card p-4 animate-pulse">
      <div className="h-4 bg-dark-700 rounded w-1/2 mb-3" />
      <div className="h-8 bg-dark-700 rounded w-2/3" />
    </div>
  );
}

export default function WalletOverview() {
  const router = useRouter();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    fetchData();
    setTimeout(() => setAnimateIn(true), 100);
  }, []);

  const fetchData = async () => {
    try {
      const [txData, wdData] = await Promise.all([
        api.getTransactions(),
        api.getWithdrawals(),
      ]);
      setTransactions(txData.transactions || []);
      setWithdrawals((wdData.withdrawals || []).filter((w) => w.status === 'pending'));
    } catch (err) {
      console.error('Failed to fetch wallet data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = transactions.filter(tx => {
      const txDate = new Date(tx.createdAt);
      return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    });
    
    const totalCredits = thisMonth
      .filter(tx => CREDIT_TYPES.includes(tx.category || tx.type))
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    const totalDebits = thisMonth
      .filter(tx => !CREDIT_TYPES.includes(tx.category || tx.type))
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    // Last 7 days trend data
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (6 - i));
      const dayTransactions = transactions.filter(tx => {
        const txDate = new Date(tx.createdAt);
        return txDate.toDateString() === date.toDateString();
      });
      const credits = dayTransactions
        .filter(tx => CREDIT_TYPES.includes(tx.category || tx.type))
        .reduce((sum, tx) => sum + tx.amount, 0);
      const debits = dayTransactions
        .filter(tx => !CREDIT_TYPES.includes(tx.category || tx.type))
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
      return credits - debits;
    });

    return { totalCredits, totalDebits, last7Days };
  }, [transactions]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;
    if (selectedFilter === 'credits') {
      filtered = transactions.filter(tx => CREDIT_TYPES.includes(tx.category || tx.type));
    } else if (selectedFilter === 'debits') {
      filtered = transactions.filter(tx => !CREDIT_TYPES.includes(tx.category || tx.type));
    }
    return filtered.slice(0, 5);
  }, [transactions, selectedFilter]);

  // Group transactions by category for summary
  const categorySummary = useMemo(() => {
    const summary = {};
    transactions.forEach(tx => {
      const cat = tx.category || tx.type || 'default';
      if (!summary[cat]) {
        summary[cat] = { count: 0, total: 0 };
      }
      summary[cat].count++;
      summary[cat].total += Math.abs(tx.amount);
    });
    return summary;
  }, [transactions]);

  const getTransactionConfig = (tx) => {
    const cat = tx.category || tx.type || 'default';
    return TRANSACTION_CONFIG[cat] || TRANSACTION_CONFIG.default;
  };

  return (
    <div className={`space-y-6 transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Balance Card - Enhanced */}
      <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-primary-600/20 via-gaming-purple/20 to-primary-900/30 border border-primary-500/20">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gaming-purple/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">💎</span>
                <p className="text-dark-300 text-sm font-medium">Available Balance</p>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl sm:text-5xl font-bold text-white">
                  {loading ? (
                    <span className="inline-block w-32 h-12 bg-white/10 rounded-lg animate-pulse" />
                  ) : (
                    formatCurrency(user?.walletBalance || 0)
                  )}
                </p>
              </div>
              {user?.bonusBalance > 0 && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30">
                  <span className="text-sm">🎁</span>
                  <span className="text-purple-300 text-sm font-medium">
                    + {formatCurrency(user.bonusBalance)} Bonus
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 w-full lg:w-auto">
              <button
                onClick={() => router.push('/wallet/deposit')}
                className="flex-1 lg:flex-initial group relative overflow-hidden px-6 py-3.5 rounded-xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold transition-all duration-300 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span className="text-lg">➕</span>
                  Add Money
                </span>
              </button>
              <button
                onClick={() => router.push('/wallet/withdraw')}
                className="flex-1 lg:flex-initial group relative overflow-hidden px-6 py-3.5 rounded-xl bg-dark-700/80 hover:bg-dark-600 border border-dark-600 hover:border-primary-500/50 text-white font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="text-lg">💸</span>
                  Withdraw
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats - Enhanced with animations */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Wallet Balance', value: user?.walletBalance || 0, icon: '💳', color: 'from-green-600/20 to-green-800/10', textColor: 'text-green-400', border: 'border-green-500/20' },
          { label: 'Bonus Balance', value: user?.bonusBalance || 0, icon: '🎁', color: 'from-purple-600/20 to-purple-800/10', textColor: 'text-purple-400', border: 'border-purple-500/20' },
          { label: 'Total Earnings', value: user?.totalEarnings || 0, icon: '🏆', color: 'from-yellow-600/20 to-yellow-800/10', textColor: 'text-yellow-400', border: 'border-yellow-500/20' },
          { label: 'Matches Won', value: user?.matchesWon || 0, icon: '🎮', color: 'from-cyan-600/20 to-cyan-800/10', textColor: 'text-cyan-400', border: 'border-cyan-500/20', raw: true },
        ].map((stat, index) => (
          <div
            key={stat.label}
            className={`relative overflow-hidden rounded-xl p-4 sm:p-5 bg-gradient-to-br ${stat.color} border ${stat.border} transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-2xl sm:text-3xl mb-2">{stat.icon}</p>
                <p className={`text-xl sm:text-2xl font-bold ${stat.textColor}`}>
                  {loading ? (
                    <span className="inline-block w-16 h-6 bg-white/10 rounded animate-pulse" />
                  ) : stat.raw ? (
                    stat.value
                  ) : (
                    formatCurrency(stat.value)
                  )}
                </p>
                <p className="text-xs text-dark-400 mt-1">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Summary & Trend Chart */}
      {!loading && transactions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Monthly Summary */}
          <div className="lg:col-span-2 card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <span>📊</span> This Month
              </h2>
              <span className="text-xs text-dark-400">
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <p className="text-xs text-dark-400 mb-1">Total Credits</p>
                <p className="text-xl font-bold text-green-400">
                  +{formatCurrency(stats.totalCredits)}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-xs text-dark-400 mb-1">Total Debits</p>
                <p className="text-xl font-bold text-red-400">
                  -{formatCurrency(stats.totalDebits)}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-dark-400 mb-2">Last 7 Days Trend</p>
              <MiniTrendChart data={stats.last7Days} />
              <div className="flex justify-between mt-2 text-[10px] text-dark-500">
                <span>7d ago</span>
                <span>Today</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-5">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <span>⚡</span> Quick Actions
            </h2>
            <div className="space-y-2">
              <button
                onClick={() => router.push('/wallet/deposit')}
                className="w-full p-3 rounded-xl bg-dark-700/50 hover:bg-dark-600/50 border border-dark-600 hover:border-green-500/30 transition-all duration-200 flex items-center gap-3 group"
              >
                <span className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                  💳
                </span>
                <div className="text-left">
                  <p className="font-medium text-sm">Quick Deposit</p>
                  <p className="text-xs text-dark-400">Add money instantly</p>
                </div>
              </button>
              <button
                onClick={() => router.push('/matches')}
                className="w-full p-3 rounded-xl bg-dark-700/50 hover:bg-dark-600/50 border border-dark-600 hover:border-primary-500/30 transition-all duration-200 flex items-center gap-3 group"
              >
                <span className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                  🎮
                </span>
                <div className="text-left">
                  <p className="font-medium text-sm">Join Match</p>
                  <p className="text-xs text-dark-400">Find your next game</p>
                </div>
              </button>
              <button
                onClick={() => router.push('/wallet/transactions')}
                className="w-full p-3 rounded-xl bg-dark-700/50 hover:bg-dark-600/50 border border-dark-600 hover:border-blue-500/30 transition-all duration-200 flex items-center gap-3 group"
              >
                <span className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                  📋
                </span>
                <div className="text-left">
                  <p className="font-medium text-sm">Full History</p>
                  <p className="text-xs text-dark-400">View all transactions</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pending Withdrawals Alert */}
      {withdrawals.length > 0 && (
        <div className="card border-l-4 border-l-yellow-500 bg-yellow-500/5">
          <div className="p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⏳</span>
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-400 mb-1">
                  Pending Withdrawals ({withdrawals.length})
                </h3>
                <p className="text-sm text-dark-400 mb-3">
                  Your withdrawal requests are being processed
                </p>
                <div className="space-y-2">
                  {withdrawals.slice(0, 2).map((wd) => (
                    <div key={wd._id} className="flex justify-between items-center p-3 rounded-lg bg-dark-800/50">
                      <div>
                        <p className="font-medium text-sm">{formatCurrency(wd.amount)}</p>
                        <p className="text-xs text-dark-400">{wd.method?.toUpperCase()} • {formatDateTime(wd.createdAt)}</p>
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-400">
                        Processing
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Transactions - Enhanced */}
      <div className="card">
        <div className="p-4 sm:p-5 border-b border-dark-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-semibold flex items-center gap-2">
              <span>📜</span> Recent Transactions
            </h2>
            <div className="flex items-center gap-2">
              {/* Filter Tabs */}
              <div className="flex gap-1 p-1 bg-dark-800 rounded-lg">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'credits', label: 'Credits' },
                  { key: 'debits', label: 'Debits' },
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setSelectedFilter(filter.key)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                      selectedFilter === filter.key
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'text-dark-400 hover:text-white'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              {transactions.length > 5 && (
                <button
                  onClick={() => router.push('/wallet/transactions')}
                  className="text-xs text-primary-400 hover:text-primary-300 transition whitespace-nowrap"
                >
                  View All →
                </button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-4">
                <div className="w-10 h-10 bg-dark-700 rounded-lg" />
                <div className="flex-1">
                  <div className="h-4 bg-dark-700 rounded w-1/2 mb-2" />
                  <div className="h-3 bg-dark-700 rounded w-1/4" />
                </div>
                <div className="h-5 bg-dark-700 rounded w-16" />
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-dark-700/50 flex items-center justify-center">
              <span className="text-4xl">💰</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
            <p className="text-dark-400 text-sm mb-4">
              Add money to your wallet to start playing
            </p>
            <button
              onClick={() => router.push('/wallet/deposit')}
              className="px-6 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-400 text-black font-medium transition-all duration-200"
            >
              Add Money Now
            </button>
          </div>
        ) : (
          <div className="divide-y divide-dark-700/50">
            {filteredTransactions.map((tx, index) => {
              const config = getTransactionConfig(tx);
              const isCredit = CREDIT_TYPES.includes(tx.category || tx.type);
              
              return (
                <div
                  key={tx._id}
                  className="p-4 sm:p-5 flex items-center gap-4 hover:bg-dark-800/30 transition-colors duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center text-xl shrink-0`}>
                    {config.icon}
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{tx.description || config.label}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-dark-400">{formatDateTime(tx.createdAt)}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${config.bg} ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                  </div>
                  
                  {/* Amount */}
                  <div className="text-right shrink-0">
                    <p className={`font-semibold ${isCredit ? 'text-green-400' : 'text-red-400'}`}>
                      {isCredit ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                    </p>
                    {tx.balanceAfter !== undefined && (
                      <p className="text-[10px] text-dark-500 mt-0.5">
                        Bal: {formatCurrency(tx.balanceAfter)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="card p-5 bg-gradient-to-r from-dark-800/50 to-dark-700/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="font-medium text-sm">Need Help?</p>
              <p className="text-xs text-dark-400">Having issues with your wallet? Our support team is here to help.</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/support')}
            className="px-4 py-2 rounded-lg bg-dark-600 hover:bg-dark-500 text-sm font-medium transition-colors"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
