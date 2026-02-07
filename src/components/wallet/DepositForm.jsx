'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';

const QUICK_AMOUNTS = [50, 100, 200, 500, 1000, 2000];

export default function DepositForm({ onDeposit, onClose, processing = false }) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = parseInt(amount);
    if (!value || value < 10) {
      setError('Minimum deposit is ₹10');
      return;
    }
    if (value > 50000) {
      setError('Maximum deposit is ₹50,000');
      return;
    }
    setError('');
    onDeposit(value);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full p-6 animate-in fade-in zoom-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">💳 Add Money</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Enter Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setError(''); }}
                placeholder="Enter amount"
                min="10"
                max="50000"
                className="w-full bg-gray-800 border border-gray-600 rounded-xl py-3 pl-10 pr-4 text-white text-lg focus:outline-none focus:border-yellow-500 transition"
                autoFocus
              />
            </div>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-2">Quick Select</p>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_AMOUNTS.map((qa) => (
                <button
                  key={qa}
                  type="button"
                  onClick={() => { setAmount(qa.toString()); setError(''); }}
                  className={`py-2 rounded-lg text-sm font-medium transition ${
                    parseInt(amount) === qa
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {formatCurrency(qa)}
                </button>
              ))}
            </div>
          </div>

          {amount && parseInt(amount) >= 10 && (
            <div className="bg-gray-800/50 rounded-xl p-4 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Amount</span>
                <span className="text-white">{formatCurrency(parseInt(amount))}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-400">GST (28%)</span>
                <span className="text-white">{formatCurrency(Math.round(parseInt(amount) * 0.28))}</span>
              </div>
              <div className="border-t border-gray-700 mt-2 pt-2 flex justify-between font-semibold">
                <span className="text-gray-300">Total</span>
                <span className="text-yellow-400">{formatCurrency(Math.round(parseInt(amount) * 1.28))}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={processing || !amount}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200"
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span> Processing...
              </span>
            ) : (
              'Proceed to Pay'
            )}
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          Payments powered by Razorpay • 100% Secure
        </p>
      </div>
    </div>
  );
}
