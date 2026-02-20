'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { formatCurrency, formatDateTime } from '@/lib/utils';

const CATEGORY_CONFIG = {
  deposit:             { icon: '💳', label: 'Deposit',           credit: true, color: 'text-green-400', bg: 'bg-green-500/15' },
  withdrawal:          { icon: '💸', label: 'Withdrawal',        credit: false, color: 'text-red-400', bg: 'bg-red-500/15' },
  match_entry:         { icon: '🎮', label: 'Match Entry',       credit: false, color: 'text-orange-400', bg: 'bg-orange-500/15' },
  match_prize:         { icon: '🏆', label: 'Match Prize',       credit: true, color: 'text-yellow-400', bg: 'bg-yellow-500/15' },
  match_refund:        { icon: '↩️', label: 'Match Refund',      credit: true, color: 'text-blue-400', bg: 'bg-blue-500/15' },
  match_auto_refund:   { icon: '⚡', label: 'Auto Refund',       credit: true, color: 'text-blue-400', bg: 'bg-blue-500/15' },
  match_creation:      { icon: '🎮', label: 'Match Creation',    credit: false, color: 'text-orange-400', bg: 'bg-orange-500/15' },
  match_creation_fee:  { icon: '🎮', label: 'Creation Fee',      credit: false, color: 'text-orange-400', bg: 'bg-orange-500/15' },
  prize_pool_escrow:   { icon: '🔒', label: 'Prize Pool',        credit: false, color: 'text-purple-400', bg: 'bg-purple-500/15' },
  challenge_entry:     { icon: '⚔️', label: 'Challenge Entry',   credit: false, color: 'text-red-400', bg: 'bg-red-500/15' },
  tournament_entry:    { icon: '🏟️', label: 'Tournament Entry',  credit: false, color: 'text-orange-400', bg: 'bg-orange-500/15' },
  tournament_prize:    { icon: '🏅', label: 'Tournament Prize',  credit: true, color: 'text-amber-400', bg: 'bg-amber-500/15' },
  tournament_refund:   { icon: '↩️', label: 'Tournament Refund', credit: true, color: 'text-blue-400', bg: 'bg-blue-500/15' },
  referral_bonus:      { icon: '👥', label: 'Referral Bonus',    credit: true, color: 'text-purple-400', bg: 'bg-purple-500/15' },
  bonus:               { icon: '🎁', label: 'Bonus',             credit: true, color: 'text-pink-400', bg: 'bg-pink-500/15' },
  admin_credit:        { icon: '🛡️', label: 'Admin Credit',      credit: true, color: 'text-green-400', bg: 'bg-green-500/15' },
  admin_debit:         { icon: '🛡️', label: 'Admin Debit',       credit: false, color: 'text-red-400', bg: 'bg-red-500/15' },
  penalty:             { icon: '⚠️', label: 'Penalty',           credit: false, color: 'text-red-400', bg: 'bg-red-500/15' },
  credit:              { icon: '💰', label: 'Credit',            credit: true, color: 'text-green-400', bg: 'bg-green-500/15' },
  refund:              { icon: '↩️', label: 'Refund',            credit: true, color: 'text-blue-400', bg: 'bg-blue-500/15' },
  winning:             { icon: '🏆', label: 'Winning',           credit: true, color: 'text-yellow-400', bg: 'bg-yellow-500/15' },
};

const STATUS_CONFIG = {
  completed: { bg: 'bg-green-500/15', text: 'text-green-400', icon: '✓', label: 'Completed' },
  pending:   { bg: 'bg-yellow-500/15', text: 'text-yellow-400', icon: '⏳', label: 'Pending' },
  processing: { bg: 'bg-blue-500/15', text: 'text-blue-400', icon: '⚙️', label: 'Processing' },
  failed:    { bg: 'bg-red-500/15', text: 'text-red-400', icon: '✗', label: 'Failed' },
  reversed:  { bg: 'bg-dark-600', text: 'text-dark-400', icon: '↩', label: 'Reversed' },
  cancelled: { bg: 'bg-dark-600', text: 'text-dark-400', icon: '🚫', label: 'Cancelled' },
};

const FILTERS = [
  { label: 'All', value: 'all', icon: '📋' },
  { label: 'Credits', value: 'credit', icon: '💰' },
  { label: 'Debits', value: 'debit', icon: '💸' },
  { label: 'Deposits', value: 'deposit', icon: '💳' },
  { label: 'Prizes', value: 'prize', icon: '🏆' },
  { label: 'Refunds', value: 'refund', icon: '↩️' },
];

// Mini bar chart for transaction summary
function MiniBarChart({ credits, debits }) {
  const total = credits + debits;
  const creditPercent = total > 0 ? (credits / total) * 100 : 50;
  const debitPercent = total > 0 ? (debits / total) * 100 : 50;

  return (
    <div className="space-y-2">
      <div className="flex h-3 rounded-full overflow-hidden bg-dark-700">
        <div 
          className="bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
          style={{ width: `${creditPercent}%` }}
        />
        <div 
          className="bg-gradient-to-r from-red-400 to-red-500 transition-all duration-500"
          style={{ width: `${debitPercent}%` }}
        />
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-green-400">Credits {creditPercent.toFixed(0)}%</span>
        <span className="text-red-400">Debits {debitPercent.toFixed(0)}%</span>
      </div>
    </div>
  );
}

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [animateIn, setAnimateIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 15;

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
    setAnimateIn(true);
  }, [fetchTransactions]);

  // Filtered list
  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      // Category filter
      if (filter === 'all') return true;
      if (filter === 'credit') return tx.type === 'credit';
      if (filter === 'debit') return tx.type === 'debit';
      if (filter === 'deposit') return tx.category === 'deposit';
      if (filter === 'prize') return ['match_prize', 'tournament_prize', 'winning'].includes(tx.category);
      if (filter === 'refund') return ['match_refund', 'match_auto_refund', 'tournament_refund', 'refund'].includes(tx.category);
      return true;
    }).filter((tx) => {
      // Search filter
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      const config = CATEGORY_CONFIG[tx.category] || CATEGORY_CONFIG[tx.type] || {};
      return (
        (tx.description && tx.description.toLowerCase().includes(query)) ||
        (config.label && config.label.toLowerCase().includes(query)) ||
        (tx.amount && tx.amount.toString().includes(query))
      );
    });
  }, [transactions, filter, searchQuery]);

  const paginated = filtered.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil(filtered.length / limit);

  // Summary stats
  const stats = useMemo(() => {
    const completed = transactions.filter((t) => t.status === 'completed');
    const totalCredits = completed.filter((t) => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
    const totalDebits = completed.filter((t) => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
    const thisMonth = transactions.filter((t) => {
      const txDate = new Date(t.createdAt);
      const now = new Date();
      return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    });
    const monthlyCredits = thisMonth.filter((t) => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
    const monthlyDebits = thisMonth.filter((t) => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
    
    return { totalCredits, totalDebits, monthlyCredits, monthlyDebits, count: transactions.length };
  }, [transactions]);

  const getCategoryConfig = (tx) => {
    return CATEGORY_CONFIG[tx.category] || CATEGORY_CONFIG[tx.type] || { 
      icon: '📄', 
      label: (tx.category || tx.type || 'transaction')?.replace(/_/g, ' '), 
      credit: tx.type === 'credit',
      color: tx.type === 'credit' ? 'text-green-400' : 'text-red-400',
      bg: tx.type === 'credit' ? 'bg-green-500/15' : 'bg-red-500/15'
    };
  };

  const getStatusConfig = (status) => {
    return STATUS_CONFIG[status] || STATUS_CONFIG.completed;
  };

  return (
    <div className={`space-y-5 transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Summary Cards - Enhanced */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="card p-4 bg-gradient-to-br from-green-900/30 to-green-800/10 border border-green-500/20">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">💰</span>
            <p className="text-xs text-dark-400">Total Credits</p>
          </div>
          <p className="text-xl font-bold text-green-400">+{formatCurrency(stats.totalCredits)}</p>
        </div>
        <div className="card p-4 bg-gradient-to-br from-red-900/30 to-red-800/10 border border-red-500/20">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">💸</span>
            <p className="text-xs text-dark-400">Total Debits</p>
          </div>
          <p className="text-xl font-bold text-red-400">-{formatCurrency(stats.totalDebits)}</p>
        </div>
        <div className="card p-4 bg-gradient-to-br from-blue-900/30 to-blue-800/10 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">📊</span>
            <p className="text-xs text-dark-400">Net Balance</p>
          </div>
          <p className={`text-xl font-bold ${stats.totalCredits - stats.totalDebits >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {stats.totalCredits - stats.totalDebits >= 0 ? '+' : ''}{formatCurrency(stats.totalCredits - stats.totalDebits)}
          </p>
        </div>
        <div className="card p-4 bg-gradient-to-br from-purple-900/30 to-purple-800/10 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">📋</span>
            <p className="text-xs text-dark-400">Transactions</p>
          </div>
          <p className="text-xl font-bold text-white">{stats.count}</p>
        </div>
      </div>

      {/* Credit/Debit Ratio Chart */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <span>📈</span> Credit vs Debit Ratio
          </h3>
          <span className="text-xs text-dark-400">All time</span>
        </div>
        <MiniBarChart credits={stats.totalCredits} debits={stats.totalDebits} />
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Filter Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide flex-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => { setFilter(f.value); setPage(1); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                filter === f.value
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/40 shadow-lg shadow-primary-500/10'
                  : 'text-dark-400 hover:text-white hover:bg-dark-700/50 border border-transparent'
              }`}
            >
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </button>
          ))}
        </div>
        
        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            placeholder="Search..."
            className="input pl-9 pr-4 py-2 text-sm w-full sm:w-48"
          />
        </div>
      </div>

      {/* Transaction List */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-dark-700 flex items-center justify-between">
          <h2 className="font-semibold flex items-center gap-2">
            <span>📜</span>
            {filter === 'all' ? 'All Transactions' : FILTERS.find((f) => f.value === filter)?.label || 'Transactions'}
          </h2>
          <span className="text-xs text-dark-400 bg-dark-700/50 px-2 py-1 rounded-lg">
            {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
          </span>
        </div>

        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-4 p-3">
                <div className="w-12 h-12 bg-dark-700 rounded-xl shrink-0" />
                <div className="flex-1">
                  <div className="h-4 bg-dark-700 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-dark-700 rounded w-1/4" />
                </div>
                <div className="h-6 bg-dark-700 rounded w-20" />
              </div>
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-dark-700/50 flex items-center justify-center">
              <span className="text-4xl">📋</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
            <p className="text-dark-400 text-sm mb-4">
              {filter !== 'all' || searchQuery ? 'Try adjusting your filters or search query' : 'Your transactions will appear here'}
            </p>
            {(filter !== 'all' || searchQuery) && (
              <button
                onClick={() => { setFilter('all'); setSearchQuery(''); }}
                className="px-4 py-2 rounded-lg bg-dark-700 hover:bg-dark-600 text-sm font-medium transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-dark-700/50">
            {paginated.map((tx, index) => {
              const config = getCategoryConfig(tx);
              const statusConfig = getStatusConfig(tx.status);
              const isCredit = config.credit || tx.type === 'credit';

              return (
                <div
                  key={tx._id}
                  className="p-4 flex items-center gap-4 hover:bg-dark-800/40 transition-colors cursor-pointer group"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${config.bg} text-xl shrink-0 group-hover:scale-110 transition-transform`}>
                    {config.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm capitalize">{config.label}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                        {statusConfig.icon} {statusConfig.label}
                      </span>
                    </div>
                    <p className="text-xs text-dark-400 truncate mt-1">
                      {formatDateTime(tx.createdAt)}
                      {tx.description && <span className="text-dark-500"> • {tx.description}</span>}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="text-right shrink-0">
                    <p className={`font-bold text-lg ${isCredit ? 'text-green-400' : 'text-red-400'}`}>
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
          <div className="p-4 border-t border-dark-700 flex items-center justify-between bg-dark-800/30">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 text-xs px-4 py-2 rounded-lg bg-dark-700 text-dark-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-600 transition"
            >
              <span>←</span>
              <span>Previous</span>
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                      page === pageNum
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/40'
                        : 'text-dark-400 hover:text-white hover:bg-dark-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 text-xs px-4 py-2 rounded-lg bg-dark-700 text-dark-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-600 transition"
            >
              <span>Next</span>
              <span>→</span>
            </button>
          </div>
        )}
      </div>

      {/* Export/Help Section */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="card p-4 flex-1 bg-gradient-to-r from-dark-800/50 to-dark-700/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">📥</span>
              <div>
                <p className="font-medium text-sm">Need a statement?</p>
                <p className="text-xs text-dark-400">Download your transaction history</p>
              </div>
            </div>
            <button className="px-4 py-2 rounded-lg bg-dark-600 hover:bg-dark-500 text-sm font-medium transition-colors">
              Export
            </button>
          </div>
        </div>
        <div className="card p-4 flex-1 bg-gradient-to-r from-dark-800/50 to-dark-700/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">❓</span>
              <div>
                <p className="font-medium text-sm">Found an issue?</p>
                <p className="text-xs text-dark-400">Report transaction problems</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/support')}
              className="px-4 py-2 rounded-lg bg-dark-600 hover:bg-dark-500 text-sm font-medium transition-colors"
            >
              Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
