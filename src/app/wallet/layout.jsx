'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Navbar, Footer } from '@/components/layout';
import { useAuth } from '@/context/AuthContext';

const TABS = [
  { label: 'Overview', href: '/wallet', icon: '💰' },
  { label: 'Deposit', href: '/wallet/deposit', icon: '➕' },
  { label: 'Withdraw', href: '/wallet/withdraw', icon: '💸' },
  { label: 'Transactions', href: '/wallet/transactions', icon: '📋' },
];

export default function WalletLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || !isAuthenticated) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 sm:pt-20">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-bold font-display mb-4 sm:mb-6">Wallet</h1>

          {/* Tab Navigation */}
          <div className="flex gap-1 sm:gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {TABS.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <button
                  key={tab.href}
                  onClick={() => router.push(tab.href)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/40'
                      : 'text-dark-400 hover:text-white hover:bg-dark-700/50 border border-transparent'
                  }`}
                >
                  <span className="text-base">{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}
          </div>

          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
