'use client';

import { formatCurrency } from '@/lib/utils';

export default function BalanceCard({ wallet = 0, bonus = 0, winnings = 0, onAddMoney, onWithdraw }) {
  const total = wallet + bonus;

  return (
    <div className="bg-gradient-to-br from-yellow-500/20 via-orange-500/10 to-red-500/20 border border-yellow-500/30 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">💰 Wallet Balance</h2>
        <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">INR</span>
      </div>

      <div className="text-4xl font-bold text-yellow-400 mb-6">
        {formatCurrency(total)}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800/60 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Deposited</p>
          <p className="text-sm font-bold text-white">{formatCurrency(wallet)}</p>
        </div>
        <div className="bg-gray-800/60 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Bonus</p>
          <p className="text-sm font-bold text-green-400">{formatCurrency(bonus)}</p>
        </div>
        <div className="bg-gray-800/60 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Winnings</p>
          <p className="text-sm font-bold text-yellow-400">{formatCurrency(winnings)}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onAddMoney}
          className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-green-500/20"
        >
          ➕ Add Money
        </button>
        <button
          onClick={onWithdraw}
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20"
        >
          💸 Withdraw
        </button>
      </div>
    </div>
  );
}
