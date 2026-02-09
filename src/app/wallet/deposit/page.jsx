'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

const QUICK_AMOUNTS = [50, 100, 200, 500, 1000, 2000];

export default function DepositPage() {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleDeposit = async () => {
    const amt = parseInt(amount);
    if (!amt || amt < 10) {
      setError('Minimum deposit amount is ₹10');
      return;
    }
    if (amt > 50000) {
      setError('Maximum deposit amount is ₹50,000');
      return;
    }

    setProcessing(true);
    setError('');
    setSuccess('');

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError('Failed to load payment gateway. Please try again.');
        setProcessing(false);
        return;
      }

      const data = await api.createDeposit(amt);

      const options = {
        key: data.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency || 'INR',
        name: 'BattleZone',
        description: `Wallet Deposit of ₹${amt}`,
        order_id: data.order.id,
        handler: async function (response) {
          try {
            await api.verifyPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            setSuccess(`₹${amt} added to your wallet successfully!`);
            setAmount('');
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('wallet-updated'));
            }
          } catch (err) {
            setError(err?.response?.data?.message || 'Payment verification failed. Contact support if money was deducted.');
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: {
          color: '#F59E0B',
          backdrop_color: 'rgba(0,0,0,0.7)',
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          },
          escape: true,
          animation: true,
        },
        notes: {
          userId: user?._id || '',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        setError(`Payment failed: ${response.error.description}`);
        setProcessing(false);
      });
      razorpay.open();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to initiate payment');
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Current Balance */}
      <div className="card p-4 text-center bg-gradient-to-r from-green-900/30 to-green-800/20">
        <p className="text-dark-400 text-xs mb-1">Current Balance</p>
        <p className="text-2xl font-bold text-green-400">{formatCurrency(user?.walletBalance || 0)}</p>
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

      {/* Deposit Form */}
      <div className="card p-5 sm:p-6">
        <h2 className="text-lg font-semibold mb-4">➕ Add Money to Wallet</h2>

        {/* Quick Amounts */}
        <div className="mb-4">
          <p className="text-sm text-dark-400 mb-2">Quick Select</p>
          <div className="grid grid-cols-3 gap-2">
            {QUICK_AMOUNTS.map((qa) => (
              <button
                key={qa}
                onClick={() => { setAmount(qa.toString()); setError(''); }}
                className={`py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
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

        {/* Custom Amount */}
        <div className="mb-4">
          <label className="block text-sm text-dark-400 mb-2">Or enter custom amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 text-lg font-medium">₹</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setError(''); }}
              placeholder="Enter amount"
              min="10"
              max="50000"
              className="input w-full pl-10 text-lg"
              autoFocus
            />
          </div>
          <p className="text-xs text-dark-500 mt-1.5">Min ₹10 • Max ₹50,000</p>
        </div>

        {/* Summary */}
        {amount && parseInt(amount) >= 10 && (
          <div className="bg-dark-800/50 rounded-xl p-4 mb-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-dark-400">Deposit Amount</span>
              <span className="text-white font-medium">{formatCurrency(parseInt(amount))}</span>
            </div>
            <div className="border-t border-dark-700 pt-2 flex justify-between font-semibold">
              <span className="text-dark-300">You&apos;ll Pay</span>
              <span className="text-primary-400 text-lg">{formatCurrency(parseInt(amount))}</span>
            </div>
          </div>
        )}

        {/* Pay Button */}
        <button
          onClick={handleDeposit}
          disabled={processing || !amount || parseInt(amount) < 10}
          className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-green-500/20 min-h-[48px]"
        >
          {processing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Processing...
            </span>
          ) : (
            `Pay ${amount ? formatCurrency(parseInt(amount)) : '₹0'}`
          )}
        </button>

        <p className="text-xs text-dark-500 text-center mt-4">
          🔒 Payments secured by Razorpay • UPI, Cards, Net Banking accepted
        </p>
      </div>
    </div>
  );
}
