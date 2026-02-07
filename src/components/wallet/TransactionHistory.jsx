'use client';

import { formatCurrency, formatDateTime } from '@/lib/utils';

const TYPE_CONFIG = {
  deposit: { icon: '💳', color: 'text-green-400', prefix: '+' },
  prize: { icon: '🏆', color: 'text-yellow-400', prefix: '+' },
  refund: { icon: '↩️', color: 'text-blue-400', prefix: '+' },
  bonus: { icon: '🎁', color: 'text-purple-400', prefix: '+' },
  referral: { icon: '👥', color: 'text-cyan-400', prefix: '+' },
  entry_fee: { icon: '🎮', color: 'text-red-400', prefix: '-' },
  withdrawal: { icon: '💸', color: 'text-orange-400', prefix: '-' },
  penalty: { icon: '⚠️', color: 'text-red-500', prefix: '-' },
  adjustment: { icon: '🔧', color: 'text-gray-400', prefix: '' },
};

const STATUS_BADGE = {
  completed: 'bg-green-500/10 text-green-400',
  pending: 'bg-yellow-500/10 text-yellow-400',
  failed: 'bg-red-500/10 text-red-400',
  processing: 'bg-blue-500/10 text-blue-400',
};

export default function TransactionHistory({ transactions = [], loading = false }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-xl p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-700 rounded w-1/4" />
              </div>
              <div className="h-5 bg-gray-700 rounded w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="text-4xl mb-3">📋</div>
        <p className="font-medium">No transactions yet</p>
        <p className="text-sm mt-1">Your transaction history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map((tx) => {
        const config = TYPE_CONFIG[tx.type] || TYPE_CONFIG.adjustment;
        const statusClass = STATUS_BADGE[tx.status] || STATUS_BADGE.completed;
        const isCredit = ['deposit', 'prize', 'refund', 'bonus', 'referral'].includes(tx.type);

        return (
          <div
            key={tx._id}
            className="bg-gray-800/60 hover:bg-gray-800 border border-gray-700/50 rounded-xl p-4 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl w-10 h-10 flex items-center justify-center bg-gray-700/50 rounded-full">
                {config.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white capitalize">
                    {tx.type?.replace(/_/g, ' ')}
                  </p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusClass}`}>
                    {tx.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatDateTime(tx.createdAt)}
                  {tx.description && ` • ${tx.description}`}
                </p>
              </div>
              <div className="text-right">
                <p className={`font-bold ${isCredit ? 'text-green-400' : 'text-red-400'}`}>
                  {isCredit ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                </p>
                {tx.balanceAfter !== undefined && (
                  <p className="text-[10px] text-gray-500">
                    Bal: {formatCurrency(tx.balanceAfter)}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
