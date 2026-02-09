'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { formatCurrency, formatDateTime } from '@/lib/utils';

const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

export default function WithdrawPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    accountHolderName: '',
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [withdrawals, setWithdrawals] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const data = await api.getWithdrawals();
      setWithdrawals(data.withdrawals || []);
    } catch (err) {
      console.error('Failed to fetch withdrawals:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleWithdraw = async () => {
    setError('');
    setSuccess('');

    const amt = parseInt(amount);
    if (!amt || amt < 100) {
      setError('Minimum withdrawal is ₹100');
      return;
    }
    if (amt > (user?.walletBalance || 0)) {
      setError('Insufficient balance');
      return;
    }

    if (method === 'upi') {
      if (!upiId) {
        setError('Please enter UPI ID');
        return;
      }
      if (!/^[\w.-]+@[\w.-]+$/.test(upiId)) {
        setError('Invalid UPI ID format (e.g., name@upi)');
        return;
      }
    }

    if (method === 'bank') {
      if (!bankDetails.accountNumber || !bankDetails.ifscCode || !bankDetails.accountHolderName) {
        setError('Please fill all bank details');
        return;
      }
      if (bankDetails.accountNumber !== bankDetails.confirmAccountNumber) {
        setError('Account numbers do not match');
        return;
      }
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankDetails.ifscCode.toUpperCase())) {
        setError('Invalid IFSC code format');
        return;
      }
    }

    const details = method === 'upi'
      ? { upiId }
      : {
          accountNumber: bankDetails.accountNumber,
          ifscCode: bankDetails.ifscCode.toUpperCase(),
          accountHolderName: bankDetails.accountHolderName,
        };

    setProcessing(true);
    try {
      await api.requestWithdrawal(amt, method, details);
      setSuccess('Withdrawal request submitted successfully! You will be notified once processed.');
      setAmount('');
      setUpiId('');
      setBankDetails({ accountNumber: '', confirmAccountNumber: '', ifscCode: '', accountHolderName: '' });
      fetchWithdrawals();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to submit withdrawal request');
    } finally {
      setProcessing(false);
    }
  };

  const pendingWithdrawals = withdrawals.filter((w) => ['pending', 'processing'].includes(w.status));

  const getStatusBadge = (status) => {
    const map = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      processing: 'bg-blue-500/20 text-blue-400',
      completed: 'bg-green-500/20 text-green-400',
      rejected: 'bg-red-500/20 text-red-400',
      cancelled: 'bg-dark-600 text-dark-400',
    };
    return map[status] || map.pending;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Withdraw Form */}
        <div className="lg:col-span-3 space-y-4">
          {/* Balance */}
          <div className="card p-4 text-center bg-gradient-to-r from-blue-900/30 to-blue-800/20">
            <p className="text-dark-400 text-xs mb-1">Available to Withdraw</p>
            <p className="text-2xl font-bold text-blue-400">{formatCurrency(user?.walletBalance || 0)}</p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* KYC Tip */}
          {user?.kycStatus !== 'verified' && user?.kycStatus !== 'approved' && (
            <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-3 rounded-lg text-sm">
              <span className="font-medium">💡 Tip:</span> Complete KYC for faster withdrawal processing.
              <button onClick={() => router.push('/kyc')} className="ml-2 underline hover:text-blue-300">
                Complete KYC
              </button>
            </div>
          )}

          {/* Form Card */}
          <div className="card p-5 sm:p-6">
            <h2 className="text-lg font-semibold mb-4">💸 Withdraw Money</h2>

            {/* Quick Amounts */}
            <div className="mb-4">
              <p className="text-sm text-dark-400 mb-2">Quick Select</p>
              <div className="grid grid-cols-3 gap-2">
                {QUICK_AMOUNTS.map((qa) => (
                  <button
                    key={qa}
                    onClick={() => { setAmount(qa.toString()); setError(''); }}
                    disabled={qa > (user?.walletBalance || 0)}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed ${
                      parseInt(amount) === qa
                        ? 'bg-primary-500 text-black shadow-lg shadow-primary-500/20'
                        : 'bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-white'
                    }`}
                  >
                    {formatCurrency(qa)}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div className="mb-4">
              <label className="block text-sm text-dark-400 mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 text-lg font-medium">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value); setError(''); }}
                  placeholder="Enter amount (min ₹100)"
                  min="100"
                  className="input w-full pl-10 text-lg"
                />
              </div>
              <p className="text-xs text-dark-500 mt-1.5">Min ₹100 • Max {formatCurrency(user?.walletBalance || 0)}</p>
            </div>

            {/* Method */}
            <div className="mb-4">
              <label className="block text-sm text-dark-400 mb-2">Withdrawal Method</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMethod('upi')}
                  className={`py-3 rounded-xl text-sm font-medium transition-all border ${
                    method === 'upi'
                      ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                      : 'border-dark-600 text-dark-300 hover:border-dark-500'
                  }`}
                >
                  📱 UPI
                </button>
                <button
                  onClick={() => setMethod('bank')}
                  className={`py-3 rounded-xl text-sm font-medium transition-all border ${
                    method === 'bank'
                      ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                      : 'border-dark-600 text-dark-300 hover:border-dark-500'
                  }`}
                >
                  🏦 Bank Transfer
                </button>
              </div>
            </div>

            {/* UPI Details */}
            {method === 'upi' && (
              <div className="mb-4">
                <label className="block text-sm text-dark-400 mb-2">UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@upi"
                  className="input w-full"
                />
              </div>
            )}

            {/* Bank Details */}
            {method === 'bank' && (
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-sm text-dark-400 mb-1.5">Account Holder Name</label>
                  <input
                    type="text"
                    value={bankDetails.accountHolderName}
                    onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
                    placeholder="As per bank records"
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-dark-400 mb-1.5">Account Number</label>
                  <input
                    type="text"
                    value={bankDetails.accountNumber}
                    onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value.replace(/\D/g, '') })}
                    placeholder="Enter account number"
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-dark-400 mb-1.5">Confirm Account Number</label>
                  <input
                    type="text"
                    value={bankDetails.confirmAccountNumber}
                    onChange={(e) => setBankDetails({ ...bankDetails, confirmAccountNumber: e.target.value.replace(/\D/g, '') })}
                    placeholder="Re-enter account number"
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-dark-400 mb-1.5">IFSC Code</label>
                  <input
                    type="text"
                    value={bankDetails.ifscCode}
                    onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value.toUpperCase() })}
                    placeholder="e.g., SBIN0001234"
                    className="input w-full"
                    maxLength={11}
                  />
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleWithdraw}
              disabled={processing || !amount || parseInt(amount) < 100}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20 min-h-[48px]"
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Processing...
                </span>
              ) : (
                `Withdraw ${amount ? formatCurrency(parseInt(amount)) : '₹0'}`
              )}
            </button>

            <p className="text-xs text-dark-500 text-center mt-3">
              UPI withdrawals are processed within 24 hours
            </p>
          </div>
        </div>

        {/* Sidebar — Recent Withdrawals */}
        <div className="lg:col-span-2">
          {/* Pending */}
          {pendingWithdrawals.length > 0 && (
            <div className="card mb-4">
              <div className="p-3 border-b border-dark-700">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  ⏳ Active Requests
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full">
                    {pendingWithdrawals.length}
                  </span>
                </h3>
              </div>
              <div className="divide-y divide-dark-700">
                {pendingWithdrawals.map((wd) => (
                  <div key={wd._id} className="p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-sm">{formatCurrency(wd.amount)}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${getStatusBadge(wd.status)}`}>
                        {wd.status}
                      </span>
                    </div>
                    <p className="text-xs text-dark-400">
                      {wd.method?.toUpperCase()} • {formatDateTime(wd.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History */}
          <div className="card">
            <div className="p-3 border-b border-dark-700">
              <h3 className="text-sm font-semibold">Withdrawal History</h3>
            </div>
            {loadingHistory ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-3 bg-dark-700 rounded w-2/3 mb-1" />
                    <div className="h-3 bg-dark-700 rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : withdrawals.length === 0 ? (
              <div className="p-6 text-center text-dark-400 text-sm">
                <p className="text-2xl mb-1">📄</p>
                No withdrawal history
              </div>
            ) : (
              <div className="divide-y divide-dark-700 max-h-[400px] overflow-y-auto">
                {withdrawals.slice(0, 10).map((wd) => (
                  <div key={wd._id} className="p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">{formatCurrency(wd.amount)}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${getStatusBadge(wd.status)}`}>
                        {wd.status}
                      </span>
                    </div>
                    <p className="text-xs text-dark-400">
                      {wd.method?.toUpperCase()} • {formatDateTime(wd.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
