'use client';

import { formatCurrency, formatDateTime } from '@/lib/utils';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', icon: '⏳' },
  processing: { label: 'Processing', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30', icon: '⚙️' },
  approved: { label: 'Approved', color: 'bg-green-500/10 text-green-400 border-green-500/30', icon: '✅' },
  completed: { label: 'Completed', color: 'bg-green-500/10 text-green-400 border-green-500/30', icon: '✅' },
  rejected: { label: 'Rejected', color: 'bg-red-500/10 text-red-400 border-red-500/30', icon: '❌' },
  cancelled: { label: 'Cancelled', color: 'bg-gray-500/10 text-gray-400 border-gray-500/30', icon: '🚫' },
};

export default function PendingWithdrawals({ withdrawals = [], onCancel, loading = false }) {
  const pendingWithdrawals = withdrawals.filter(
    (w) => ['pending', 'processing', 'approved'].includes(w.status)
  );

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-xl p-4 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-1/3 mb-2" />
            <div className="h-3 bg-gray-700 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!pendingWithdrawals.length) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
        Active Withdrawals
      </h3>
      {pendingWithdrawals.map((wd) => {
        const status = STATUS_CONFIG[wd.status] || STATUS_CONFIG.pending;

        return (
          <div
            key={wd._id}
            className={`border rounded-xl p-4 ${status.color}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span>{status.icon}</span>
                <span className="font-semibold text-white">{formatCurrency(wd.amount)}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full border ${status.color}`}>
                {status.label}
              </span>
            </div>
            <div className="text-xs text-gray-400 space-y-1">
              <p>Method: {wd.method === 'upi' ? `UPI (${wd.upiId})` : 'Bank Transfer'}</p>
              <p>Requested: {formatDateTime(wd.createdAt)}</p>
              {wd.estimatedCompletion && (
                <p>Est. completion: {formatDateTime(wd.estimatedCompletion)}</p>
              )}
            </div>
            {wd.status === 'pending' && onCancel && (
              <button
                onClick={() => onCancel(wd._id)}
                className="mt-3 text-xs text-red-400 hover:text-red-300 border border-red-500/30 px-3 py-1 rounded-lg transition"
              >
                Cancel Request
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
