'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AuthWelcomeBanner() {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading || !isAuthenticated || !user) return null;

  return (
    <div className="bg-gradient-to-r from-cyan-950/60 to-purple-950/40 border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
        <div className="text-cyan-300">
          Welcome back, <span className="font-semibold text-white">{user.username || user.name}</span>! Ready to play?
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-medium border border-white/10 transition"
        >
          Go to Dashboard →
        </Link>
      </div>
    </div>
  );
}
