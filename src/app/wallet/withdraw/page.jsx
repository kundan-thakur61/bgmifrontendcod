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
  const [animateIn, setAnimateIn] = useState(false);
  
  // Saved payment methods state
  const [savedMethods, setSavedMethods] = useState([]);
  const [loadingSavedMethods, setLoadingSavedMethods] = useState(true);
  const [selectedSavedMethod, setSelectedSavedMethod] = useState(null);
  const [showAddMethodForm, setShowAddMethodForm] = useState(false);
  const [saveNewMethod, setSaveNewMethod] = useState(true);
  const [deletingMethodId, setDeletingMethodId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchWithdrawals();
    fetchSavedMethods();
    setAnimateIn(true);
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

  const fetchSavedMethods = async () => {
    try {
      const data = await api.getSavedPaymentMethods();
      setSavedMethods(data.paymentMethods || []);
    } catch (err) {
      console.error('Failed to fetch saved payment methods:', err);
    } finally {
      setLoadingSavedMethods(false);
    }
  };

  const handleDeleteMethod = async (methodId) => {
    setDeletingMethodId(methodId);
    try {
      await api.deleteSavedPaymentMethod(methodId);
      setSavedMethods(prev => prev.filter(m => m._id !== methodId));
      if (selectedSavedMethod?._id === methodId) {
        setSelectedSavedMethod(null);
      }
      setShowDeleteConfirm(null);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete payment method');
    } finally {
      setDeletingMethodId(null);
    }
  };

  const handleSetDefault = async (methodId) => {
    try {
      await api.setDefaultPaymentMethod(methodId);
      setSavedMethods(prev => 
        prev.map(m => ({
          ...m,
          isDefault: m._id === methodId
        }))
      );
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to set default payment method');
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

    // If using saved payment method
    if (selectedSavedMethod) {
      setProcessing(true);
      try {
        await api.requestWithdrawal(amt, selectedSavedMethod.method, {
          savedPaymentMethodId: selectedSavedMethod._id
        });
        setSuccess('Withdrawal request submitted successfully! You will be notified once processed.');
        setAmount('');
        fetchWithdrawals();
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Failed to submit withdrawal request');
      } finally {
        setProcessing(false);
      }
      return;
    }

    // Manual entry validation
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
      ? { upiId, savePaymentMethod: saveNewMethod }
      : {
          bankDetails: {
            accountNumber: bankDetails.accountNumber,
            ifscCode: bankDetails.ifscCode.toUpperCase(),
            accountHolderName: bankDetails.accountHolderName,
          },
          savePaymentMethod: saveNewMethod
        };

    setProcessing(true);
    try {
      await api.requestWithdrawal(amt, method, details);
      setSuccess('Withdrawal request submitted successfully! You will be notified once processed.');
      setAmount('');
      setUpiId('');
      setBankDetails({ accountNumber: '', confirmAccountNumber: '', ifscCode: '', accountHolderName: '' });
      fetchWithdrawals();
      fetchSavedMethods(); // Refresh saved methods in case a new one was added
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to submit withdrawal request');
    } finally {
      setProcessing(false);
    }
  };

  const pendingWithdrawals = withdrawals.filter((w) => ['pending', 'processing'].includes(w.status));

  const getStatusConfig = (status) => {
    const configs = {
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: '⏳', label: 'Pending' },
      processing: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: '⚙️', label: 'Processing' },
      completed: { bg: 'bg-green-500/20', text: 'text-green-400', icon: '✅', label: 'Completed' },
      rejected: { bg: 'bg-red-500/20', text: 'text-red-400', icon: '❌', label: 'Rejected' },
      cancelled: { bg: 'bg-dark-600', text: 'text-dark-400', icon: '🚫', label: 'Cancelled' },
    };
    return configs[status] || configs.pending;
  };

  const getMethodIcon = (methodType) => {
    return methodType === 'upi' ? '📱' : '🏦';
  };

  return (
    <div className={`space-y-5 transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Withdraw Form */}
        <div className="lg:col-span-3 space-y-4">
          {/* Balance Card */}
          <div className="relative overflow-hidden rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-dark-300 text-xs sm:text-sm mb-1">Available to Withdraw</p>
                <p className="text-3xl sm:text-4xl font-bold text-blue-400">
                  {formatCurrency(user?.walletBalance || 0)}
                </p>
                <p className="text-xs text-blue-300/60 mt-1">Min withdrawal: ₹100</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
                <span className="text-3xl">💸</span>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm flex items-start gap-3">
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-sm flex items-start gap-3">
              <span className="text-lg">✅</span>
              <span>{success}</span>
            </div>
          )}

          {/* KYC Notice */}
          {user?.kycStatus !== 'verified' && user?.kycStatus !== 'approved' && (
            <div className="bg-gradient-to-r from-amber-900/30 to-amber-800/20 border border-amber-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">💡</span>
                <div className="flex-1">
                  <p className="font-medium text-amber-400 text-sm mb-1">Complete KYC for Faster Withdrawals</p>
                  <p className="text-xs text-dark-400 mb-2">
                    Verified accounts get priority processing and higher withdrawal limits.
                  </p>
                  <button
                    onClick={() => router.push('/kyc')}
                    className="text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Complete KYC →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Saved Payment Methods Section */}
          <div className="card p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <span>💳</span> Saved Payment Methods
              </h3>
              <button
                onClick={() => setShowAddMethodForm(!showAddMethodForm)}
                className="text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
              >
                <span>{showAddMethodForm ? '✕' : '+'}</span>
                {showAddMethodForm ? 'Cancel' : 'Add New'}
              </button>
            </div>

            {loadingSavedMethods ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="animate-pulse flex items-center gap-3 p-3 bg-dark-800/50 rounded-xl">
                    <div className="w-10 h-10 bg-dark-700 rounded-lg" />
                    <div className="flex-1">
                      <div className="h-4 bg-dark-700 rounded w-1/2 mb-2" />
                      <div className="h-3 bg-dark-700 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : savedMethods.length > 0 ? (
              <div className="space-y-2">
                {savedMethods.map((savedMethod) => (
                  <div
                    key={savedMethod._id}
                    className={`relative p-4 rounded-xl border transition-all duration-200 ${
                      selectedSavedMethod?._id === savedMethod._id
                        ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10'
                        : 'border-dark-600 bg-dark-700/30 hover:border-dark-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setSelectedSavedMethod(savedMethod);
                          setShowAddMethodForm(false);
                        }}
                        className="flex-1 flex items-center gap-3 text-left"
                      >
                        <span className="text-2xl">{getMethodIcon(savedMethod.method)}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className={`font-medium text-sm ${selectedSavedMethod?._id === savedMethod._id ? 'text-blue-400' : 'text-white'}`}>
                              {savedMethod.displayName}
                            </p>
                            {savedMethod.isDefault && (
                              <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-dark-400">
                            {savedMethod.method.toUpperCase()} • {savedMethod.maskedAccountNumber}
                          </p>
                        </div>
                      </button>
                      
                      {/* Action buttons */}
                      <div className="flex items-center gap-1">
                        {!savedMethod.isDefault && (
                          <button
                            onClick={() => handleSetDefault(savedMethod._id)}
                            className="p-2 text-dark-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                            title="Set as default"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => setShowDeleteConfirm(savedMethod._id)}
                          className="p-2 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Delete confirmation */}
                    {showDeleteConfirm === savedMethod._id && (
                      <div className="absolute inset-0 bg-dark-900/95 rounded-xl flex items-center justify-center p-4 z-10">
                        <div className="text-center">
                          <p className="text-sm text-dark-300 mb-3">Delete this payment method?</p>
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="px-3 py-1.5 text-xs bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleDeleteMethod(savedMethod._id)}
                              disabled={deletingMethodId === savedMethod._id}
                              className="px-3 py-1.5 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors flex items-center gap-1"
                            >
                              {deletingMethodId === savedMethod._id ? (
                                <>
                                  <span className="w-3 h-3 border border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                                  Deleting...
                                </>
                              ) : (
                                'Delete'
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-dark-700/50 flex items-center justify-center">
                  <span className="text-2xl">💳</span>
                </div>
                <p className="text-dark-400 text-sm">No saved payment methods</p>
                <p className="text-xs text-dark-500 mt-1">Add a payment method for faster withdrawals</p>
              </div>
            )}
          </div>

          {/* Add New Payment Method Form */}
          {showAddMethodForm && (
            <div className="card p-5 sm:p-6 border border-blue-500/30 animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <span>➕</span> Add Payment Method
                </h3>
                <button
                  onClick={() => setShowAddMethodForm(false)}
                  className="text-dark-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Method Selection */}
              <div className="mb-4">
                <label className="block text-sm text-dark-400 mb-2">Method Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setMethod('upi')}
                    className={`p-3 rounded-xl text-left transition-all duration-200 border ${
                      method === 'upi'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-dark-600 bg-dark-700/30 hover:border-dark-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📱</span>
                      <span className={`text-sm font-medium ${method === 'upi' ? 'text-blue-400' : 'text-white'}`}>
                        UPI
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={() => setMethod('bank')}
                    className={`p-3 rounded-xl text-left transition-all duration-200 border ${
                      method === 'bank'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-dark-600 bg-dark-700/30 hover:border-dark-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🏦</span>
                      <span className={`text-sm font-medium ${method === 'bank' ? 'text-blue-400' : 'text-white'}`}>
                        Bank
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* UPI Form */}
              {method === 'upi' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-dark-400 mb-1.5">UPI ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value.toLowerCase())}
                      placeholder="yourname@upi"
                      className="input w-full h-12"
                    />
                  </div>
                </div>
              )}

              {/* Bank Form */}
              {method === 'bank' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-dark-400 mb-1.5">Account Holder Name</label>
                    <input
                      type="text"
                      value={bankDetails.accountHolderName}
                      onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
                      placeholder="As per bank records"
                      className="input w-full h-12"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-dark-400 mb-1.5">Account Number</label>
                      <input
                        type="text"
                        value={bankDetails.accountNumber}
                        onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value.replace(/\D/g, '') })}
                        placeholder="Account number"
                        className="input w-full h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-dark-400 mb-1.5">Confirm Account</label>
                      <input
                        type="text"
                        value={bankDetails.confirmAccountNumber}
                        onChange={(e) => setBankDetails({ ...bankDetails, confirmAccountNumber: e.target.value.replace(/\D/g, '') })}
                        placeholder="Re-enter"
                        className="input w-full h-12"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-dark-400 mb-1.5">IFSC Code</label>
                    <input
                      type="text"
                      value={bankDetails.ifscCode}
                      onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value.toUpperCase() })}
                      placeholder="e.g., SBIN0001234"
                      className="input w-full h-12"
                      maxLength={11}
                    />
                  </div>
                </div>
              )}

              {/* Save checkbox */}
              <label className="flex items-center gap-2 mt-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveNewMethod}
                  onChange={(e) => setSaveNewMethod(e.target.checked)}
                  className="w-4 h-4 rounded border-dark-600 bg-dark-700 text-blue-500 focus:ring-blue-500/20"
                />
                <span className="text-sm text-dark-300">Save for future withdrawals</span>
              </label>
            </div>
          )}

          {/* Amount Section */}
          <div className="card p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xl">💸</span>
              <h2 className="text-lg font-semibold">Withdraw Money</h2>
            </div>

            {/* Quick Amounts */}
            <div className="mb-5">
              <p className="text-sm text-dark-400 mb-3">Quick Select</p>
              <div className="grid grid-cols-3 gap-2">
                {QUICK_AMOUNTS.map((qa) => {
                  const isDisabled = qa > (user?.walletBalance || 0);
                  const isSelected = parseInt(amount) === qa;
                  return (
                    <button
                      key={qa}
                      onClick={() => !isDisabled && setAmount(qa.toString())}
                      disabled={isDisabled}
                      className={`py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25 scale-[1.02]'
                          : isDisabled
                          ? 'bg-dark-800/50 text-dark-600 cursor-not-allowed'
                          : 'bg-dark-700/80 text-dark-300 hover:bg-dark-600 hover:text-white border border-dark-600 hover:border-blue-500/30'
                      }`}
                    >
                      {formatCurrency(qa)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Amount Input */}
            <div className="mb-5">
              <label className="block text-sm text-dark-400 mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-300 text-xl font-semibold">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value); setError(''); }}
                  placeholder="Enter amount"
                  min="100"
                  className="input w-full pl-10 pr-4 text-xl font-medium h-14"
                />
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-xs text-dark-500">Min ₹100</p>
                <p className="text-xs text-dark-500">Max {formatCurrency(user?.walletBalance || 0)}</p>
              </div>
            </div>

            {/* Summary */}
            {amount && parseInt(amount) >= 100 && (
              <div className="bg-dark-800/60 rounded-xl p-4 mb-5 border border-dark-700/50">
                <p className="text-xs text-dark-400 mb-3 font-medium">Withdrawal Summary</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-400">Withdrawal Amount</span>
                    <span className="text-white font-medium">{formatCurrency(parseInt(amount))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-400">Processing Fee</span>
                    <span className="text-green-400 font-medium">FREE</span>
                  </div>
                  <div className="border-t border-dark-600 pt-3 mt-3 flex justify-between">
                    <span className="text-dark-300 font-medium">You'll Receive</span>
                    <span className="text-xl font-bold text-blue-400">{formatCurrency(parseInt(amount))}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleWithdraw}
              disabled={processing || !amount || parseInt(amount) < 100}
              className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-dark-600 disabled:to-dark-600 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 disabled:shadow-none min-h-[56px]"
            >
              {processing ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Processing...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span className="text-lg">💸</span>
                  <span>Withdraw {amount && parseInt(amount) >= 100 ? formatCurrency(parseInt(amount)) : '₹0'}</span>
                </span>
              )}
            </button>

            <p className="text-xs text-dark-500 text-center mt-4">
              UPI withdrawals are processed within 24 hours • Bank transfers take 2-3 business days
            </p>
          </div>
        </div>

        {/* Sidebar - Withdrawal History */}
        <div className="lg:col-span-2 space-y-4">
          {/* Pending Withdrawals */}
          {pendingWithdrawals.length > 0 && (
            <div className="card border-l-4 border-l-yellow-500">
              <div className="p-4 border-b border-dark-700">
                <h3 className="font-semibold flex items-center gap-2">
                  <span>⏳</span> Active Requests
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                    {pendingWithdrawals.length}
                  </span>
                </h3>
              </div>
              <div className="divide-y divide-dark-700">
                {pendingWithdrawals.map((wd) => {
                  const statusConfig = getStatusConfig(wd.status);
                  return (
                    <div key={wd._id} className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-lg">{formatCurrency(wd.amount)}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                          {statusConfig.icon} {statusConfig.label}
                        </span>
                      </div>
                      <p className="text-xs text-dark-400">
                        {wd.method?.toUpperCase()} • {formatDateTime(wd.createdAt)}
                      </p>
                      {wd.method === 'upi' && wd.details?.upiId && (
                        <p className="text-xs text-dark-500 mt-1">To: {wd.details.upiId}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* History */}
          <div className="card">
            <div className="p-4 border-b border-dark-700">
              <h3 className="font-semibold flex items-center gap-2">
                <span>📋</span> Withdrawal History
              </h3>
            </div>
            {loadingHistory ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-dark-700 rounded w-2/3 mb-2" />
                    <div className="h-3 bg-dark-700 rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : withdrawals.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-dark-700/50 flex items-center justify-center">
                  <span className="text-3xl">📄</span>
                </div>
                <p className="text-dark-400 text-sm">No withdrawal history</p>
                <p className="text-xs text-dark-500 mt-1">Your withdrawals will appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-dark-700 max-h-[400px] overflow-y-auto">
                {withdrawals.slice(0, 10).map((wd) => {
                  const statusConfig = getStatusConfig(wd.status);
                  return (
                    <div key={wd._id} className="p-4 hover:bg-dark-800/30 transition-colors">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold">{formatCurrency(wd.amount)}</span>
                        <span className={`text-[10px] px-2 py-1 rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                          {statusConfig.icon} {statusConfig.label}
                        </span>
                      </div>
                      <p className="text-xs text-dark-400">
                        {wd.method?.toUpperCase()} • {formatDateTime(wd.createdAt)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Help Card */}
          <div className="card p-4 bg-gradient-to-r from-dark-800/50 to-dark-700/30">
            <div className="flex items-start gap-3">
              <span className="text-xl">❓</span>
              <div>
                <p className="font-medium text-sm mb-1">Need Help?</p>
                <p className="text-xs text-dark-400">
                  Having trouble with withdrawals? Our support team is available 24/7.
                </p>
                <button
                  onClick={() => router.push('/support')}
                  className="text-xs text-blue-400 hover:text-blue-300 mt-2"
                >
                  Contact Support →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
