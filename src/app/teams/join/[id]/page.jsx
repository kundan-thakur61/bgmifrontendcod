'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/layout';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import OptimizedImage from '@/components/seo/OptimizedImage';

export default function TeamJoinPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const teamId = params?.id;

  useEffect(() => {
    if (teamId) {
      fetchPublicTeam();
    }
  }, [teamId]);

  const fetchPublicTeam = async () => {
    setLoading(true);
    try {
      // Use public endpoint (no auth required)
      const data = await api.getPublicTeam(teamId);
      setTeam(data.team);
    } catch (err) {
      setError('Team not found or is no longer active.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!user) {
      // Redirect to login with return url
      router.push(`/login?redirect=/teams/join/${teamId}`);
      return;
    }

    setJoining(true);
    setError('');
    setMessage('');

    try {
      // Try to accept invite first (if captain sent direct invite)
      await api.acceptTeamInvite(teamId);
      setMessage('Successfully joined the team!');
      setTimeout(() => {
        router.push(`/teams/${teamId}`);
      }, 1200);
    } catch (acceptErr) {
      // If no pending invite, try a general "request" via update or fallback
      // For public teams we can attempt a direct add via backend invite flow or show guidance.
      // Current backend: if public, captain can invite; for share we can fallback to showing instructions or calling a simple join for public teams.
      // As enhancement, call a generic "join public" if available. For now, show useful message + link to team page after login.
      try {
        // Re-fetch with auth (to get full data and possibly auto join for public)
        const full = await api.getTeam(teamId);
        if (full.team?.isPublic) {
          // If public and not member, we can leave a hint or simulate by re-inviting self (captain flow not possible).
          // Better UX: tell user they can ask captain or if already member view team.
          setMessage('Team is public. If you have an active invite you can accept from My Teams. Redirecting...');
          setTimeout(() => router.push(`/teams/${teamId}`), 1400);
        } else {
          setError('This team requires an invite from the captain. Ask the captain to send you an invite, or use the link they shared directly.');
        }
      } catch (e) {
        setError(acceptErr.response?.data?.message || 'Unable to join. The captain may need to send you a direct invite first.');
      }
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-16 sm:pt-20 flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-pulse">👥</div>
            <p className="text-gray-400">Loading team invite...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error && !team) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-16 sm:pt-20 bg-gradient-to-b from-gray-900 via-black to-gray-900">
          <div className="max-w-md mx-auto px-4 py-16 text-center">
            <div className="text-6xl mb-6">❌</div>
            <h1 className="text-2xl font-bold text-white mb-3">Invite Link Issue</h1>
            <p className="text-gray-400 mb-6">{error}</p>
            <Link href="/teams" className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-semibold">Browse Teams</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const isAlreadyMember = user && team?.members?.some?.(m => (m.user?._id || m.user) === user._id);

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-16 sm:pt-20 bg-gradient-to-b from-gray-900 via-black to-gray-900">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-500 mb-4 overflow-hidden">
                {team?.logo?.url ? (
                  <OptimizedImage src={team.logo.url} alt={team.name} width={80} height={80} className="object-cover" />
                ) : (
                  <span className="text-white text-4xl font-black">{team?.tag?.[0] || 'T'}</span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">
                {team?.name} <span className="text-cyan-400">[{team?.tag}]</span>
              </h1>
              <p className="text-gray-400">You've been invited to join this squad</p>
            </div>

            {/* Team Info Card */}
            <div className="bg-gray-800/50 rounded-2xl p-5 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">Captain</div>
                  <div className="font-semibold text-white">{team?.captain?.name || '—'}</div>
                </div>
                <div>
                  <div className="text-gray-400">Members</div>
                  <div className="font-semibold text-white">{team?.memberCount || 0} / {team?.maxMembers || 4}</div>
                </div>
                <div>
                  <div className="text-gray-400">Game</div>
                  <div className="font-semibold text-white capitalize">{(team?.gameType || 'all').replace('_', ' ')}</div>
                </div>
                <div>
                  <div className="text-gray-400">Status</div>
                  <div className="font-semibold text-emerald-400">{team?.isPublic ? 'Public Team' : 'Invite Only'}</div>
                </div>
              </div>

              {team?.description && (
                <p className="mt-4 text-gray-300 text-sm border-t border-gray-700 pt-4">{team.description}</p>
              )}
            </div>

            {/* Messages */}
            {message && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/40 text-green-400 rounded-xl text-sm">{message}</div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/40 text-red-400 rounded-xl text-sm">{error}</div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3">
              {!user && !authLoading && (
                <button
                  onClick={handleJoin}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 font-semibold text-lg active:scale-[0.985] transition"
                >
                  Login to Accept Invite
                </button>
              )}

              {user && !isAlreadyMember && (
                <button
                  onClick={handleJoin}
                  disabled={joining}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 font-semibold text-lg disabled:opacity-60 active:scale-[0.985] transition"
                >
                  {joining ? 'Joining Team...' : 'Accept & Join Team'}
                </button>
              )}

              {isAlreadyMember && (
                <Link href={`/teams/${teamId}`} className="block text-center w-full py-4 rounded-2xl bg-green-600 font-semibold">
                  You're already a member — View Team
                </Link>
              )}

              <Link
                href="/teams"
                className="block text-center py-3 text-gray-400 hover:text-white text-sm"
              >
                ← Back to My Teams
              </Link>
            </div>

            <p className="text-center text-[11px] text-gray-500 mt-6">
              By joining you agree to the team rules and BattleXZone Terms.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
