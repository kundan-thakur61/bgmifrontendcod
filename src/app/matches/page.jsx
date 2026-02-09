'use client';

import { Suspense } from 'react';
import { Navbar, Footer } from '@/components/layout';
import MatchList from '@/components/matches/MatchList';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function MatchesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role && ['admin', 'super_admin'].includes(user.role);

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-16 sm:pt-20 bg-gradient-to-b from-dark-900 to-dark-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div>
                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                  {isAdmin && <span className="text-xl sm:text-2xl">👑</span>}
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display">
                    {isAdmin ? 'Match Management' : 'Official Matches'}
                  </h1>
                </div>
                <p className="text-dark-400 text-sm sm:text-base">
                  {isAdmin
                    ? 'Manage all admin-created matches and tournaments'
                    : 'Browse and join official admin-created matches'
                  }
                </p>
              </div>

              {/* Create Match Button */}
              <Link
                href="/create-match"
                className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto min-h-[44px]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Challenge
              </Link>
            </div>
          </div>

          {/* Info Banner - Only for non-admins */}
          {!isAdmin && (
            <div className="mb-4 sm:mb-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl flex-shrink-0">ℹ️</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-blue-400 mb-1 text-sm sm:text-base">Looking for user challenges?</h3>
                <p className="text-xs sm:text-sm text-dark-300">
                  Visit the <Link href="/" className="text-blue-400 hover:text-blue-300 underline">homepage</Link> to browse and join user-created challenges, or create your own!
                </p>
              </div>
            </div>
          )}

          {/* Match List */}
          <Suspense fallback={
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              <p className="mt-4 text-dark-400">Loading matches...</p>
            </div>
          }>
            <MatchList />
          </Suspense>
        </div>
      </main>

      <Footer />
    </>
  );
}
