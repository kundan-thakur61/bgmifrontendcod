'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

const QUICK_AMOUNTS = [50, 100, 200, 500, 1000, 2000];
const RECOMMENDED_AMOUNT = 200;

export default function DepositPage() {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [animateIn, setAnimateIn] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

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
            setSelectedPromo(null);
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

  const handleQuickAmount = (value) => {
    setAmount(value.toString());
    setError('');
  };

  return (
    <div className={`max-w-lg mx-auto space-y-5 transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Current Balance Card */}
      <div className="relative overflow-hidden rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-500/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-dark-300 text-xs sm:text-sm mb-1">Current Balance</p>
            <p className="text-3xl sm:text-4xl font-bold text-green-400">
              {formatCurrency(user?.walletBalance || 0)}
            </p>
            {user?.bonusBalance > 0 && (
              <p className="text-xs text-green-300/70 mt-1">
                + {formatCurrency(user.bonusBalance)} bonus available
              </p>
            )}
          </div>
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
            <span className="text-3xl">💳</span>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm flex items-start gap-3 animate-shake">
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

      {/* Deposit Form Card */}
      <div className="card p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-xl">➕</span>
          <h2 className="text-lg font-semibold">Add Money to Wallet</h2>
        </div>

        {/* Quick Amounts Grid */}
        <div className="mb-5">
          <p className="text-sm text-dark-400 mb-3">Quick Select</p>
          <div className="grid grid-cols-3 gap-2">
            {QUICK_AMOUNTS.map((qa) => (
              <button
                key={qa}
                onClick={() => handleQuickAmount(qa)}
                className={`relative py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  parseInt(amount) === qa
                    ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/25 scale-[1.02]'
                    : 'bg-dark-700/80 text-dark-300 hover:bg-dark-600 hover:text-white border border-dark-600 hover:border-green-500/30'
                }`}
              >
                {qa === RECOMMENDED_AMOUNT && parseInt(amount) !== qa && (
                  <span className="absolute -top-2 -right-2 text-[10px] bg-primary-500 text-black px-1.5 py-0.5 rounded-full font-semibold">
                    Popular
                  </span>
                )}
                {formatCurrency(qa)}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Amount Input */}
        <div className="mb-5">
          <label className="block text-sm text-dark-400 mb-2">Or enter custom amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-300 text-xl font-semibold">₹</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setError(''); }}
              placeholder="Enter amount"
              min="10"
              max="50000"
              className="input w-full pl-10 pr-4 text-xl font-medium h-14"
              autoFocus
            />
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-xs text-dark-500">Min ₹10</p>
            <p className="text-xs text-dark-500">Max ₹50,000</p>
          </div>
        </div>

        {/* Order Summary */}
        {amount && parseInt(amount) >= 10 && (
          <div className="bg-dark-800/60 rounded-xl p-4 mb-5 border border-dark-700/50">
            <p className="text-xs text-dark-400 mb-3 font-medium">Order Summary</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-dark-400">Deposit Amount</span>
                <span className="text-white font-medium">{formatCurrency(parseInt(amount))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-400">Processing Fee</span>
                <span className="text-green-400 font-medium">FREE</span>
              </div>
              <div className="border-t border-dark-600 pt-3 mt-3 flex justify-between">
                <span className="text-dark-300 font-medium">Total to Pay</span>
                <span className="text-xl font-bold text-green-400">{formatCurrency(parseInt(amount))}</span>
              </div>
            </div>
          </div>
        )}

        {/* Pay Button */}
        <button
          onClick={handleDeposit}
          disabled={processing || !amount || parseInt(amount) < 10}
          className="w-full relative overflow-hidden bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:from-dark-600 disabled:to-dark-600 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-green-500/40 disabled:shadow-none min-h-[56px]"
        >
          {processing ? (
            <span className="flex items-center justify-center gap-3">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>Processing...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span className="text-lg">🔒</span>
              <span>Pay {amount && parseInt(amount) >= 10 ? formatCurrency(parseInt(amount)) : '₹0'}</span>
            </span>
          )}
        </button>

        {/* Payment Methods Info */}
        <div className="mt-5 pt-4 border-t border-dark-700/50">
          <p className="text-xs text-dark-500 text-center mb-3">Accepted Payment Methods</p>
          <div className="flex justify-center gap-4 flex-wrap">
            {[
              { icon: '📱', label: 'UPI' },
              { icon: '💳', label: 'Cards' },
              { icon: '🏦', label: 'Net Banking' },
              { icon: '📲', label: 'Wallets' },
            ].map((method) => (
              <div key={method.label} className="flex items-center gap-1.5 text-xs text-dark-400">
                <span>{method.icon}</span>
                <span>{method.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Info */}
      <div className="card p-4 bg-dark-800/30 border border-dark-700/30">
        <div className="flex items-start gap-3">
          <span className="text-xl">🛡️</span>
          <div>
            <p className="font-medium text-sm mb-1">Secure Payments</p>
            <p className="text-xs text-dark-400">
              All transactions are encrypted and processed through Razorpay's secure payment gateway. Your financial information is never stored on our servers.
            </p>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="card p-4 bg-gradient-to-r from-primary-900/20 to-primary-800/10 border border-primary-500/20">
        <div className="flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div>
            <p className="font-medium text-sm mb-1">Pro Tip</p>
            <p className="text-xs text-dark-400">
              Deposit ₹500 or more to unlock exclusive bonus matches and tournaments with higher prize pools!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
