'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';

export default function WithdrawalForm({ balance = 0, kycStatus, onWithdraw, onClose, processing = false }) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    accountHolderName: '',
  });
  const [error, setError] = useState('');

  const isKycApproved = kycStatus === 'approved';
  const minWithdraw = 100;
  const maxWithdraw = Math.min(balance, 50000);

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = parseInt(amount);

    if (!value || value < minWithdraw) {
      setError(`Minimum withdrawal is ${formatCurrency(minWithdraw)}`);
      return;
    }
    if (value > balance) {
      setError('Insufficient balance');
      return;
    }
    if (method === 'upi' && !upiId.includes('@')) {
      setError('Enter a valid UPI ID (e.g., name@upi)');
      return;
    }
    if (method === 'bank') {
      if (!bankDetails.accountNumber || !bankDetails.ifscCode || !bankDetails.accountHolderName) {
        setError('All bank details are required');
        return;
      }
      if (bankDetails.accountNumber !== bankDetails.confirmAccountNumber) {
        setError('Account numbers do not match');
        return;
      }
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankDetails.ifscCode.toUpperCase())) {
        setError('Enter a valid IFSC code');
        return;
      }
    }

    setError('');
    onWithdraw({
      amount: value,
      method,
      ...(method === 'upi' ? { upiId } : {
        accountNumber: bankDetails.accountNumber,
        ifscCode: bankDetails.ifscCode.toUpperCase(),
        accountHolderName: bankDetails.accountHolderName,
      }),
    });
  };

  if (!isKycApproved) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full p-6">
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🔐</div>
            <h3 className="text-xl font-bold text-white mb-2">KYC Required</h3>
            <p className="text-gray-400 mb-6">Complete your KYC verification to withdraw funds.</p>
            <div className="flex gap-3 justify-center">
              <a
                href="/kyc"
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 py-2 rounded-xl transition"
              >
                Complete KYC
              </a>
              <button onClick={onClose} className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-xl transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">💸 Withdraw</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>

        <div className="bg-gray-800/60 rounded-xl p-3 mb-4 text-center">
          <p className="text-xs text-gray-400">Available Balance</p>
          <p className="text-xl font-bold text-yellow-400">{formatCurrency(balance)}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Amount */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setError(''); }}
                placeholder={`Min ${formatCurrency(minWithdraw)}`}
                min={minWithdraw}
                max={maxWithdraw}
                className="w-full bg-gray-800 border border-gray-600 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-yellow-500 transition"
              />
            </div>
          </div>

          {/* Method Selection */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Withdrawal Method</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMethod('upi')}
                className={`py-3 rounded-xl font-medium transition ${
                  method === 'upi'
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                📱 UPI
              </button>
              <button
                type="button"
                onClick={() => setMethod('bank')}
                className={`py-3 rounded-xl font-medium transition ${
                  method === 'bank'
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                🏦 Bank Transfer
              </button>
            </div>
          </div>

          {/* UPI Details */}
          {method === 'upi' && (
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">UPI ID</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@upi"
                className="w-full bg-gray-800 border border-gray-600 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-yellow-500 transition"
              />
            </div>
          )}

          {/* Bank Details */}
          {method === 'bank' && (
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Account Holder Name</label>
                <input
                  type="text"
                  value={bankDetails.accountHolderName}
                  onChange={(e) => setBankDetails(prev => ({ ...prev, accountHolderName: e.target.value }))}
                  placeholder="Full name"
                  className="w-full bg-gray-800 border border-gray-600 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-yellow-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Account Number</label>
                <input
                  type="text"
                  value={bankDetails.accountNumber}
                  onChange={(e) => setBankDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                  placeholder="Account number"
                  className="w-full bg-gray-800 border border-gray-600 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-yellow-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Confirm Account Number</label>
                <input
                  type="text"
                  value={bankDetails.confirmAccountNumber}
                  onChange={(e) => setBankDetails(prev => ({ ...prev, confirmAccountNumber: e.target.value }))}
                  placeholder="Re-enter account number"
                  className="w-full bg-gray-800 border border-gray-600 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-yellow-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={bankDetails.ifscCode}
                  onChange={(e) => setBankDetails(prev => ({ ...prev, ifscCode: e.target.value.toUpperCase() }))}
                  placeholder="ABCD0123456"
                  maxLength={11}
                  className="w-full bg-gray-800 border border-gray-600 rounded-xl py-2.5 px-4 text-white uppercase focus:outline-none focus:border-yellow-500 transition"
                />
              </div>
            </div>
          )}

          {/* Fee Info */}
          {amount && parseInt(amount) >= minWithdraw && (
            <div className="bg-gray-800/50 rounded-xl p-4 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Withdrawal Amount</span>
                <span className="text-white">{formatCurrency(parseInt(amount))}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-400">TDS (30% on net winnings)</span>
                <span className="text-red-400">-{formatCurrency(Math.round(parseInt(amount) * 0.3))}</span>
              </div>
              <div className="border-t border-gray-700 mt-2 pt-2 flex justify-between font-semibold">
                <span className="text-gray-300">You&apos;ll Receive</span>
                <span className="text-green-400">{formatCurrency(Math.round(parseInt(amount) * 0.7))}</span>
              </div>
            </div>
          )}

          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

          <button
            type="submit"
            disabled={processing || !amount}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200"
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span> Processing...
              </span>
            ) : (
              'Request Withdrawal'
            )}
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          Withdrawals are processed within 24-48 hours
        </p>
      </div>
    </div>
  );
}
