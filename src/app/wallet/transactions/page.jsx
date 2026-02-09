'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { formatCurrency, formatDateTime } from '@/lib/utils';

const CATEGORY_CONFIG = {
  deposit:             { icon: '💳', label: 'Deposit',           credit: true },
  withdrawal:          { icon: '💸', label: 'Withdrawal',        credit: false },
  match_entry:         { icon: '🎮', label: 'Match Entry',       credit: false },
  match_prize:         { icon: '🏆', label: 'Match Prize',       credit: true },
  match_refund:        { icon: '↩️', label: 'Match Refund',      credit: true },
  match_auto_refund:   { icon: '↩️', label: 'Auto Refund',       credit: true },
  match_creation:      { icon: '🎮', label: 'Match Creation',    credit: false },
  match_creation_fee:  { icon: '🎮', label: 'Creation Fee',      credit: false },
  prize_pool_escrow:   { icon: '🔒', label: 'Prize Pool',        credit: false },
  challenge_entry:     { icon: '⚔️', label: 'Challenge Entry',   credit: false },
  tournament_entry:    { icon: '🏟️', label: 'Tournament Entry',  credit: false },
  tournament_prize:    { icon: '🏆', label: 'Tournament Prize',  credit: true },
  tournament_refund:   { icon: '↩️', label: 'Tournament Refund', credit: true },
  referral_bonus:      { icon: '👥', label: 'Referral Bonus',    credit: true },
  bonus:               { icon: '🎁', label: 'Bonus',             credit: true },
  admin_credit:        { icon: '🛡️', label: 'Admin Credit',      credit: true },
  admin_debit:         { icon: '🛡️', label: 'Admin Debit',       credit: false },
  penalty:             { icon: '⚠️', label: 'Penalty',           credit: false },
};

const STATUS_BADGE = {
  completed: 'bg-green-500/15 text-green-400',
  pending:   'bg-yellow-500/15 text-yellow-400',
  failed:    'bg-red-500/15 text-red-400',
  reversed:  'bg-dark-600 text-dark-400',
};

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Credits', value: 'credit' },
  { label: 'Debits', value: 'debit' },
  { label: 'Deposits', value: 'deposit' },
  { label: 'Prizes', value: 'prize' },
  { label: 'Refunds', value: 'refund' },
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getTransactions();
      const all = data.transactions || [];
      setTotal(all.length);
      setTransactions(all);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Filtered list
  const filtered = transactions.filter((tx) => {
    if (filter === 'all') return true;
    if (filter === 'credit') return tx.type === 'credit';
    if (filter === 'debit') return tx.type === 'debit';
    if (filter === 'deposit') return tx.category === 'deposit';
    if (filter === 'prize') return ['match_prize', 'tournament_prize'].includes(tx.category);
    if (filter === 'refund') return ['match_refund', 'match_auto_refund', 'tournament_refund'].includes(tx.category);
    return true;
  });

  const paginated = filtered.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil(filtered.length / limit);

  // Summary stats
  const totalCredits = transactions.filter((t) => t.type === 'credit' && t.status === 'completed').reduce((s, t) => s + t.amount, 0);
  const totalDebits = transactions.filter((t) => t.type === 'debit' && t.status === 'completed').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-3 sm:p-4 text-center">
          <p className="text-xs text-dark-400 mb-1">Total In</p>
          <p className="text-lg font-bold text-green-400">+{formatCurrency(totalCredits)}</p>
        </div>
        <div className="card p-3 sm:p-4 text-center">
          <p className="text-xs text-dark-400 mb-1">Total Out</p>
          <p className="text-lg font-bold text-red-400">-{formatCurrency(totalDebits)}</p>
        </div>
        <div className="card p-3 sm:p-4 text-center">
          <p className="text-xs text-dark-400 mb-1">Transactions</p>
          <p className="text-lg font-bold text-white">{transactions.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => { setFilter(f.value); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              filter === f.value
                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/40'
                : 'text-dark-400 hover:text-white hover:bg-dark-700/50 border border-transparent'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="card">
        <div className="p-3 sm:p-4 border-b border-dark-700 flex items-center justify-between">
          <h2 className="font-semibold text-sm sm:text-base">
            {filter === 'all' ? 'All Transactions' : FILTERS.find((f) => f.value === filter)?.label || 'Transactions'}
          </h2>
          <span className="text-xs text-dark-400">{filtered.length} results</span>
        </div>

        {loading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-3">
                <div className="w-9 h-9 bg-dark-700 rounded-full shrink-0" />
                <div className="flex-1">
                  <div className="h-4 bg-dark-700 rounded w-1/3 mb-1.5" />
                  <div className="h-3 bg-dark-700 rounded w-1/4" />
                </div>
                <div className="h-4 bg-dark-700 rounded w-16" />
              </div>
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="p-10 text-center text-dark-400">
            <p className="text-4xl mb-2">📋</p>
            <p className="font-medium">No transactions found</p>
            <p className="text-sm mt-1">
              {filter !== 'all' ? 'Try a different filter' : 'Your transactions will appear here'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-dark-700">
            {paginated.map((tx) => {
              const cat = tx.category || tx.type;
              const config = CATEGORY_CONFIG[cat] || { icon: '📄', label: cat?.replace(/_/g, ' '), credit: tx.type === 'credit' };
              const isCredit = config.credit || tx.type === 'credit';
              const statusClass = STATUS_BADGE[tx.status] || STATUS_BADGE.completed;

              return (
                <div key={tx._id} className="p-3 sm:p-4 flex items-center gap-3 hover:bg-dark-800/40 transition-colors">
                  {/* Icon */}
                  <div className="w-9 h-9 flex items-center justify-center bg-dark-700/60 rounded-full text-lg shrink-0">
                    {config.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white capitalize truncate">{config.label}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${statusClass}`}>
                        {tx.status}
                      </span>
                    </div>
                    <p className="text-xs text-dark-500 truncate mt-0.5">
                      {formatDateTime(tx.createdAt)}
                      {tx.description && ` • ${tx.description}`}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="text-right shrink-0">
                    <p className={`font-bold text-sm ${isCredit ? 'text-green-400' : 'text-red-400'}`}>
                      {isCredit ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                    </p>
                    {tx.balanceAfter !== undefined && (
                      <p className="text-[10px] text-dark-500">Bal: {formatCurrency(tx.balanceAfter)}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-3 border-t border-dark-700 flex items-center justify-between">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-xs px-3 py-1.5 rounded-lg bg-dark-700 text-dark-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-600 transition"
            >
              ← Previous
            </button>
            <span className="text-xs text-dark-400">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="text-xs px-3 py-1.5 rounded-lg bg-dark-700 text-dark-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-600 transition"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
