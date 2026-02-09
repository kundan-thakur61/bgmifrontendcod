'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { formatCurrency, formatDateTime } from '@/lib/utils';

export default function WalletOverview() {
  const router = useRouter();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [txData, wdData] = await Promise.all([
        api.getTransactions(),
        api.getWithdrawals(),
      ]);
      setTransactions((txData.transactions || []).slice(0, 5));
      setWithdrawals((wdData.withdrawals || []).filter((w) => w.status === 'pending'));
    } catch (err) {
      console.error('Failed to fetch wallet data:', err);
    } finally {
      setLoading(false);
    }
  };

  const creditTypes = ['deposit', 'winning', 'refund', 'credit', 'referral_bonus', 'match_prize', 'tournament_prize', 'bonus', 'admin_credit', 'match_refund', 'match_auto_refund', 'tournament_refund'];

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="card p-5 sm:p-6 bg-gradient-to-br from-primary-900/50 to-gaming-purple/30">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-dark-400 text-xs sm:text-sm mb-1">Available Balance</p>
            <p className="text-3xl sm:text-4xl font-bold gradient-text">
              {formatCurrency(user?.walletBalance || 0)}
            </p>
            {user?.bonusBalance > 0 && (
              <p className="text-xs text-dark-400 mt-1">
                + {formatCurrency(user.bonusBalance)} bonus
              </p>
            )}
          </div>
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => router.push('/wallet/deposit')}
              className="btn-primary flex-1 sm:flex-initial min-h-[44px]"
            >
              ➕ Add Money
            </button>
            <button
              onClick={() => router.push('/wallet/withdraw')}
              className="btn-outline flex-1 sm:flex-initial min-h-[44px]"
            >
              💸 Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Wallet', value: user?.walletBalance || 0, icon: '💳', color: 'text-green-400' },
          { label: 'Bonus', value: user?.bonusBalance || 0, icon: '🎁', color: 'text-purple-400' },
          { label: 'Total Earnings', value: user?.totalEarnings || 0, icon: '🏆', color: 'text-yellow-400' },
          { label: 'Matches Won', value: user?.matchesWon || 0, icon: '🎮', color: 'text-cyan-400', raw: true },
        ].map((stat) => (
          <div key={stat.label} className="card p-3 sm:p-4 text-center">
            <p className="text-lg sm:text-xl mb-1">{stat.icon}</p>
            <p className={`text-lg sm:text-xl font-bold ${stat.color}`}>
              {stat.raw ? stat.value : formatCurrency(stat.value)}
            </p>
            <p className="text-xs text-dark-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Pending Withdrawals */}
      {withdrawals.length > 0 && (
        <div className="card">
          <div className="p-3 sm:p-4 border-b border-dark-700 flex items-center justify-between">
            <h2 className="font-semibold text-sm sm:text-base">⏳ Pending Withdrawals</h2>
            <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
              {withdrawals.length}
            </span>
          </div>
          <div className="divide-y divide-dark-700">
            {withdrawals.map((wd) => (
              <div key={wd._id} className="p-3 sm:p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">{formatCurrency(wd.amount)} via {wd.method?.toUpperCase()}</p>
                  <p className="text-xs text-dark-400">{formatDateTime(wd.createdAt)}</p>
                </div>
                <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400">pending</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="card">
        <div className="p-3 sm:p-4 border-b border-dark-700 flex items-center justify-between">
          <h2 className="font-semibold text-sm sm:text-base">Recent Transactions</h2>
          {transactions.length > 0 && (
            <button
              onClick={() => router.push('/wallet/transactions')}
              className="text-xs text-primary-400 hover:text-primary-300 transition"
            >
              View All →
            </button>
          )}
        </div>

        {loading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex justify-between">
                <div className="h-4 bg-dark-700 rounded w-1/2" />
                <div className="h-4 bg-dark-700 rounded w-20" />
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center text-dark-400">
            <p className="text-4xl mb-2">💰</p>
            <p>No transactions yet</p>
            <p className="text-sm mt-1">Add money to your wallet to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-dark-700">
            {transactions.map((tx) => {
              const cat = tx.category || tx.type;
              const isCredit = creditTypes.includes(cat);
              return (
                <div key={tx._id} className="p-3 sm:p-4 flex justify-between items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{tx.description}</p>
                    <p className="text-xs text-dark-400">{formatDateTime(tx.createdAt)}</p>
                  </div>
                  <div className={`font-semibold text-sm shrink-0 ${isCredit ? 'text-green-400' : 'text-red-400'}`}>
                    {isCredit ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
