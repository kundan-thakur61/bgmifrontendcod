'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Navbar, Footer } from '@/components/layout';
import { useAuth } from '@/context/AuthContext';

const TABS = [
  { label: 'Overview', href: '/wallet', icon: '💰', description: 'Balance & stats' },
  { label: 'Deposit', href: '/wallet/deposit', icon: '➕', description: 'Add money' },
  { label: 'Withdraw', href: '/wallet/withdraw', icon: '💸', description: 'Cash out' },
  { label: 'History', href: '/wallet/transactions', icon: '📋', description: 'All transactions' },
];

export default function WalletLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (authLoading || !isAuthenticated) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-dark-900">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-dark-400 text-sm">Loading wallet...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 sm:pt-20 bg-dark-900">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl sm:text-4xl">💳</span>
              <h1 className="text-2xl sm:text-3xl font-bold font-display">Wallet</h1>
            </div>
            <p className="text-dark-400 text-sm sm:text-base">
              Manage your funds, deposits, and withdrawals
            </p>
          </div>

          {/* Tab Navigation - Enhanced */}
          <div className="mb-6 sm:mb-8">
            {/* Desktop Tabs */}
            <div className="hidden sm:flex gap-2 p-1.5 bg-dark-800/50 rounded-2xl border border-dark-700/50 overflow-x-auto">
              {TABS.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                  <button
                    key={tab.href}
                    onClick={() => router.push(tab.href)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-500/20 to-primary-600/20 text-primary-400 border border-primary-500/30 shadow-lg shadow-primary-500/10'
                        : 'text-dark-400 hover:text-white hover:bg-dark-700/50 border border-transparent'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Tabs - Scrollable */}
            <div className="sm:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-3 px-3">
              {TABS.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                  <button
                    key={tab.href}
                    onClick={() => router.push(tab.href)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/40'
                        : 'text-dark-400 hover:text-white bg-dark-800/50 border border-dark-700/50'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Page Content with Animation */}
          <div 
            className={`transition-all duration-300 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
