'use client';

import { useState } from 'react';
import { Navbar, Footer } from '@/components/layout';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function BattlePassPage() {
  const { user } = useAuth();
  const [selectedTier, setSelectedTier] = useState('premium');

  const tiers = {
    free: {
      name: 'Free Pass',
      price: '₹0',
      color: 'from-gray-700 to-gray-800',
      benefits: [
        'Basic XP from matches',
        'Standard achievements',
        'Public tournaments access',
        'Daily missions'
      ]
    },
    premium: {
      name: 'Premium Battle Pass',
      price: '₹99',
      period: '/month',
      color: 'from-yellow-400 via-amber-500 to-orange-500',
      popular: true,
      benefits: [
        '2× XP Boost on all matches',
        'Exclusive Premium Badges & Titles',
        '20% off tournament entry fees',
        'Access to Exclusive Scrims & Private Rooms',
        'Priority support & early access to new events',
        'Monthly premium reward drops (₹50-200 value)',
        'VIP badge on profile & leaderboards'
      ]
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      window.location.href = '/login?redirect=/battle-pass';
      return;
    }
    try {
      const data = await api.subscribePremiumPass({ paymentMethod: 'razorpay' });
      if (data.order) {
        // In real app: open Razorpay checkout with data.order + key
        // For demo, simulate success
        alert('Razorpay order created. In production: complete payment to activate 30-day Premium Pass (2x XP, discounts, etc.)');
        // Example: window.Razorpay({...})
      } else {
        // Wallet path succeeded
        alert(data.message || 'Premium activated!');
        window.location.reload();
      }
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to start purchase');
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-16 sm:pt-20 bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="max-w-5xl mx-auto px-4 py-10">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-sm font-semibold tracking-wider mb-3">MONTHLY • RECURRING</div>
            <h1 className="text-5xl sm:text-6xl font-black tracking-tighter mb-3">
              BATTLE <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">PASS</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-md mx-auto">
              Level up faster. Unlock exclusive rewards. Dominate every season.
            </p>
          </div>

          {/* Current status */}
          {user && (
            <div className="mb-8 p-4 bg-gray-900/60 border border-gray-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-sm text-gray-400">Your current pass</div>
                <div className="font-bold text-lg text-white">{user.hasPremiumPass ? 'Premium Active' : 'Free Pass'}</div>
              </div>
              {user.hasPremiumPass && user.passExpiry && (
                <div className="text-sm text-green-400">Expires: {new Date(user.passExpiry).toLocaleDateString()}</div>
              )}
              {!user.hasPremiumPass && (
                <button onClick={handleSubscribe} className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold active:scale-[0.985]">
                  Upgrade to Premium • ₹99
                </button>
              )}
            </div>
          )}

          {/* Tiers */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {Object.entries(tiers).map(([key, tier]) => (
              <div
                key={key}
                onClick={() => setSelectedTier(key)}
                className={`relative rounded-3xl p-8 border transition cursor-pointer ${selectedTier === key ? 'border-yellow-400 scale-[1.01]' : 'border-gray-800 hover:border-gray-700'} bg-gray-900/40`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 right-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-black px-4 py-1 rounded-full">MOST POPULAR</div>
                )}

                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-black text-white">{tier.name}</span>
                </div>
                <div className="mb-6">
                  <span className={`text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r ${tier.color}`}>{tier.price}</span>
                  {tier.period && <span className="text-gray-400"> {tier.period}</span>}
                </div>

                <ul className="space-y-3 text-sm">
                  {tier.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300">
                      <span className="text-green-400 mt-0.5">✓</span> {b}
                    </li>
                  ))}
                </ul>

                {key === 'premium' && (
                  <button
                    onClick={handleSubscribe}
                    className="mt-8 w-full py-3.5 rounded-2xl font-bold text-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-black active:scale-[0.985] transition"
                  >
                    Get Premium Pass
                  </button>
                )}
                {key === 'free' && (
                  <Link href="/register" className="mt-8 block text-center py-3.5 rounded-2xl font-semibold border border-gray-700 text-gray-400 hover:text-white">
                    Start Free
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Perks highlight - matches user request */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-8 mb-10">
            <h3 className="font-bold text-xl mb-5 text-white">Premium Battle Pass Includes</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              {[
                { icon: '🏅', title: 'Premium Badges', desc: 'Exclusive Chicken Dinner Master, Tournament King, MVP & more' },
                { icon: '💸', title: 'Tournament Discounts', desc: '20% off all entry fees every month' },
                { icon: '🔒', title: 'Exclusive Scrims', desc: 'Private high-level rooms & custom lobbies' },
                { icon: '⚡', title: 'XP Boost', desc: 'Double XP on every match + bonus streak rewards' }
              ].map((p, idx) => (
                <div key={idx} className="p-4 bg-gray-800/50 rounded-2xl">
                  <div className="text-3xl mb-2">{p.icon}</div>
                  <div className="font-semibold text-white mb-1">{p.title}</div>
                  <div className="text-gray-400 text-xs leading-snug">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ style */}
          <div className="max-w-2xl mx-auto text-center text-gray-400 text-sm">
            <p>Cancel anytime. Premium perks are instantly activated after payment. Recurring revenue for the platform + massive retention lift.</p>
            <p className="mt-2">Already a top player? The XP boost + exclusive scrims will help you climb the leaderboards even faster.</p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
