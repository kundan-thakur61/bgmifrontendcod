'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { formatCurrency, getCurrencySymbol } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MatchChat from '@/components/matches/MatchChat';
import { MatchSchema, BreadcrumbSchema } from '@/components/seo';
import { io } from 'socket.io-client';

// Countdown Timer Hook
function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    if (!targetDate) return;
    const update = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        expired: false,
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

// Helper: group joinedUsers by team based on slotNumber
function groupByTeam(joinedUsers, groupSize, maxSlots) {
  const totalGroups = Math.ceil(maxSlots / groupSize);
  const groups = Array.from({ length: totalGroups }, () => []);
  (joinedUsers || []).forEach((ju) => {
    const slot = ju.slotNumber || 1;
    const groupIdx = Math.floor((slot - 1) / groupSize);
    if (groups[groupIdx]) groups[groupIdx].push(ju);
  });
  return groups;
}

// Reusable player card component
function PlayerCard({ slot, idx, compact }) {
  const [copiedId, setCopiedId] = useState(false);
  const levelColors = {
    diamond: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    platinum: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    gold: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    silver: 'bg-gray-400/20 text-gray-300 border-gray-400/30',
    bronze: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  };
  const size = compact ? 'w-8 h-8' : 'w-10 h-10';

  const copyGameId = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(slot.inGameId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 1500);
  };

  return (
    <div className="bg-dark-700/50 hover:bg-dark-700/70 rounded-lg p-3 transition-colors group">
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <div className={`${size} rounded-full bg-dark-600 flex items-center justify-center overflow-hidden border-2 border-dark-500 group-hover:border-primary-500/40 transition-colors`}>
            {slot.user?.avatar ? (
              <img src={slot.user.avatar} alt={slot.user?.name} className="w-full h-full object-cover" />
            ) : (
              <span className={`${compact ? 'text-xs' : 'text-sm'} font-bold text-dark-300`}>
                {slot.user?.name?.charAt(0)?.toUpperCase() || '?'}
              </span>
            )}
          </div>
          <span className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-primary-500 rounded-full text-[10px] font-bold flex items-center justify-center shadow-lg">
            {slot.slotNumber || idx + 1}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm truncate">{slot.user?.name || 'Player'}</span>
            {slot.user?.level && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize border shrink-0 ${levelColors[slot.user.level] || levelColors.bronze}`}>
                {slot.user.level}
              </span>
            )}
          </div>
          {slot.inGameName && (
            <div className="text-xs text-dark-400 mt-0.5">🎮 IGN: {slot.inGameName}</div>
          )}
        </div>
      </div>
      {slot.inGameId && (
        <div className="mt-2 flex items-center gap-2 bg-dark-800/60 rounded-md px-2.5 py-1.5 border border-dark-600/40">
          <span className="text-[11px] text-dark-400 shrink-0">Game ID:</span>
          <span className="text-[11px] text-white font-mono font-medium flex-1">{slot.inGameId}</span>
          <button
            onClick={copyGameId}
            className="shrink-0 text-dark-400 hover:text-primary-400 transition-colors p-0.5"
            title="Copy Game ID"
          >
            {copiedId ? (
              <span className="text-gaming-green text-[10px] font-medium">✓</span>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default function MatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');
  const [joinForm, setJoinForm] = useState({ inGameId: '', inGameName: '', slotNumber: null });
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [myStatus, setMyStatus] = useState(null);
  const [roomCredentials, setRoomCredentials] = useState(null);
  const [copied, setCopied] = useState('');
  const [showAllPlayers, setShowAllPlayers] = useState(false);
  const [shareMsg, setShareMsg] = useState('');

  const countdown = useCountdown(match?.scheduledAt);

  useEffect(() => {
    fetchMatch();
  }, [params.id]);

  useEffect(() => {
    if (isAuthenticated && match) {
      fetchMyStatus();
    }
  }, [isAuthenticated, match]);

  const fetchMatch = async () => {
    try {
      const data = await api.getMatch(params.id);
      setMatch(data.match);
    } catch (err) {
      setError('Match not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyStatus = async () => {
    try {
      const data = await api.getMyMatchStatus(params.id);
      setMyStatus(data);
      // Fetch room credentials if joined
      if (data?.joined || data?.isJoined) {
        if (data?.roomId) {
          setRoomCredentials({
            roomId: data.roomId,
            roomPassword: data.roomPassword,
            scheduledAt: data.scheduledAt
          });
        } else {
          // If user has joined but no room credentials yet, try fetching
          await fetchRoomCredentials();
        }
      }
    } catch (err) {
      // Not joined
      console.error('Error fetching match status:', err);
    }
  };

  const fetchRoomCredentials = async () => {
    try {
      const data = await api.getRoomCredentials(params.id);
      if (data?.roomId) {
        setRoomCredentials(data);
      }
    } catch (err) {
      // Credentials not available yet
      console.log('Room credentials not available yet');
    }
  };

  // Auto-poll for room credentials when match status is room_revealed but we don't have them yet
  useEffect(() => {
    const isJoined = myStatus?.joined || myStatus?.isJoined;
    if (
      isJoined &&
      match?.status === 'room_revealed' &&
      !roomCredentials?.roomId
    ) {
      // Poll every 3 seconds for room credentials
      const intervalId = setInterval(() => {
        fetchMyStatus();
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [myStatus, match?.status, roomCredentials?.roomId]);

  // Socket.IO for real-time room credential updates
  useEffect(() => {
    if (!user || !params.id) return;

    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    // Join the match room to receive room_revealed events
    socket.on('connect', () => {
      console.log('Socket connected for room credentials');
      // Join the match room to receive updates
      socket.emit('join_match', params.id);
    });

    // Listen for room_revealed event
    socket.on('room_revealed', (data) => {
      console.log('Room revealed event received:', data);
      if (data.matchId === params.id) {
        // Update room credentials immediately
        setRoomCredentials({
          roomId: data.roomId,
          roomPassword: data.roomPassword
        });
        // Also refresh match status
        fetchMatch();
        fetchMyStatus();
      }
    });

    // Listen for slot updates
    socket.on('slot_update', (data) => {
      if (data.matchId === params.id && data.roomRevealed) {
        // Match is full, fetch latest data
        fetchMyStatus();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user, params.id]);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setJoining(true);
    setError('');
    try {
      await api.joinMatch(params.id, joinForm.inGameId, joinForm.inGameName, joinForm.slotNumber);
      setShowJoinModal(false);
      fetchMatch();
      fetchMyStatus();
    } catch (err) {
      // Extract error message from axios response
      const errorMessage = err.response?.data?.message || err.message || 'Failed to join match';
      setError(errorMessage);
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!confirm('Are you sure you want to leave this match?')) return;

    try {
      await api.leaveMatch(params.id);
      fetchMatch();
      setMyStatus(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelChallenge = async () => {
    if (!confirm('Are you sure you want to cancel this challenge? Your creation fee and prize pool will be refunded to your wallet.')) return;

    try {
      const result = await api.cancelUserMatch(params.id);
      alert(`Challenge cancelled! ₹${result.refund.total} has been refunded to your wallet.`);
      router.push('/matches');
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      upcoming: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      registration_open: 'bg-green-500/20 text-green-400 border border-green-500/30',
      registration_closed: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
      room_revealed: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
      live: 'bg-green-500/20 text-green-400 border border-green-500/30 animate-pulse',
      result_pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      completed: 'bg-dark-600 text-dark-300 border border-dark-500',
      cancelled: 'bg-red-500/20 text-red-400 border border-red-500/30',
    };
    return badges[status] || badges.upcoming;
  };

  const getStatusLabel = (status) => {
    const labels = {
      upcoming: '📅 Upcoming',
      registration_open: '✅ Registration Open',
      registration_closed: '🔒 Registration Closed',
      room_revealed: '🔑 Room Revealed',
      live: '🔴 LIVE',
      result_pending: '⏳ Result Pending',
      completed: '🏁 Completed',
      cancelled: '❌ Cancelled',
    };
    return labels[status] || status?.toUpperCase();
  };

  const handleShare = async () => {
    const url = window.location.href;
    const currencySymbol = getCurrencySymbol(match.prizePoolCurrency || 'INR');
    const text = `🎮 Join "${match.title}" on BattleZone! Prize Pool: ${formatCurrency(match.prizePool, match.prizePoolCurrency || 'INR')} | Entry: ${match.entryFee === 0 ? 'FREE' : `${currencySymbol}${match.entryFee}`}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: match.title, text, url });
      } catch {}
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`);
      setShareMsg('Link copied!');
      setTimeout(() => setShareMsg(''), 2000);
    }
  };

  const filledSlots = match?.filledSlots || match?.joinedUsers?.length || 0;
  const slotPercent = match ? Math.round((filledSlots / match.maxSlots) * 100) : 0;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-dark-900 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </>
    );
  }

  if (error && !match) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-dark-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-4">{error}</h1>
            <Link href="/matches" className="btn-primary">Back to Matches</Link>
          </div>
        </div>
      </>
    );
  }

  const isJoined = myStatus?.joined || myStatus?.isJoined;
  const slotsLeft = match.maxSlots - filledSlots;
  const isFull = slotsLeft <= 0;
  const isCreator = user && (match.createdBy?._id === user.id || match.createdBy?._id === user._id || match.createdBy === user.id || match.createdBy === user._id);
  const canCancel = isCreator && match.isChallenge && ['upcoming', 'registration_open'].includes(match.status) && filledSlots <= 1;
  const isAdmin = user && ['admin', 'super_admin', 'match_manager'].includes(user.role);
  const groupSize = match.mode === 'squad' ? 4 : match.mode === 'duo' ? 2 : 1;

  return (
    <>
      {match && (
        <>
          <MatchSchema match={match} />
          <BreadcrumbSchema items={[
            { name: 'Home', url: 'https://battlezone.com' },
            { name: 'Matches', url: 'https://battlezone.com/matches' },
            { name: match.title, url: `https://battlezone.com/matches/${params.id}` },
          ]} />
        </>
      )}
      <Navbar />
      <main className="min-h-screen bg-dark-900 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button + Share */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/matches" className="inline-flex items-center text-dark-400 hover:text-white transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Matches
            </Link>
            <button onClick={handleShare} className="inline-flex items-center gap-2 text-dark-400 hover:text-white transition-colors text-sm">
              {shareMsg ? (
                <span className="text-gaming-green font-medium">✓ {shareMsg}</span>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </>
              )}
            </button>
          </div>

          {/* Match Header Card */}
          <div className="card p-6 mb-6 relative overflow-hidden">
            {/* Background accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary-500 via-gaming-purple to-gaming-orange"></div>

            {/* Challenge Badge */}
            {match.isChallenge && (
              <div className="absolute top-0 right-0 bg-linear-to-r from-gaming-purple to-gaming-orange text-white text-xs font-bold px-4 py-1.5 rounded-bl-lg">
                🎯 CHALLENGE
              </div>
            )}

            {/* Status + Title */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-5">
              <div className="flex-1">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${getStatusBadge(match.status)}`}>
                  {getStatusLabel(match.status)}
                </span>
                <h1 className="text-2xl md:text-3xl font-bold leading-tight">{match.title}</h1>
                {match.isChallenge && (
                  <p className="text-gaming-orange text-sm mt-1.5 flex items-center gap-1">
                    ⚡ Created by a player • Winner takes the prize pool!
                  </p>
                )}
                {match.description && (
                  <p className="text-dark-400 text-sm mt-2">{match.description}</p>
                )}
              </div>
              <div className="text-right shrink-0">
                <div className="text-3xl font-bold text-gaming-green">{formatCurrency(match.prizePool, match.prizePoolCurrency || 'INR')}</div>
                <div className="text-dark-400 text-xs mt-0.5">Prize Pool</div>
              </div>
            </div>

            {/* Countdown Timer */}
            {!countdown.expired && ['upcoming', 'registration_open'].includes(match.status) && (
              <div className="bg-dark-800/60 rounded-xl p-4 mb-5 border border-dark-600/50">
                <div className="text-dark-400 text-xs text-center mb-2 font-medium uppercase tracking-wider">Match Starts In</div>
                <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
                  {[
                    { val: countdown.days, label: 'Days' },
                    { val: countdown.hours, label: 'Hours' },
                    { val: countdown.minutes, label: 'Min' },
                    { val: countdown.seconds, label: 'Sec' },
                  ].map((t) => (
                    <div key={t.label} className="text-center">
                      <div className="text-2xl font-bold font-mono text-white bg-dark-700 rounded-lg py-2">
                        {String(t.val ?? 0).padStart(2, '0')}
                      </div>
                      <div className="text-[10px] text-dark-400 mt-1 uppercase">{t.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {countdown.expired && match.status === 'live' && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 mb-5 text-center">
                <span className="text-green-400 font-bold animate-pulse">🔴 MATCH IS LIVE NOW!</span>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-dark-700/50 rounded-xl p-4 text-center border border-dark-600/30 hover:border-primary-500/20 transition-colors">
                <div className="text-dark-400 text-xs mb-1">Entry Fee</div>
                <div className="text-xl font-bold">{match.entryFee === 0 ? <span className="text-gaming-green">FREE</span> : `₹${match.entryFee}`}</div>
              </div>
              <div className="bg-dark-700/50 rounded-xl p-4 text-center border border-dark-600/30 hover:border-primary-500/20 transition-colors">
                <div className="text-dark-400 text-xs mb-1">Mode</div>
                <div className="text-xl font-bold capitalize">{match.mode}</div>
                <div className="text-[10px] text-dark-500 mt-0.5">
                  {match.mode === 'solo' ? `${match.maxSlots} players` : match.mode === 'duo' ? `${Math.ceil(match.maxSlots / 2)} teams` : `${Math.ceil(match.maxSlots / 4)} squads`}
                </div>
              </div>
              <div className="bg-dark-700/50 rounded-xl p-4 text-center border border-dark-600/30 hover:border-primary-500/20 transition-colors">
                <div className="text-dark-400 text-xs mb-1">Slots</div>
                <div className="text-xl font-bold">
                  <span className={isFull ? 'text-red-400' : slotsLeft <= 5 ? 'text-yellow-400' : 'text-white'}>
                    {filledSlots}
                  </span>
                  <span className="text-dark-400">/{match.maxSlots}</span>
                </div>
                {/* Slot progress bar */}
                <div className="w-full bg-dark-600 rounded-full h-1.5 mt-2">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${isFull ? 'bg-red-500' : slotPercent >= 80 ? 'bg-yellow-500' : 'bg-gaming-green'}`}
                    style={{ width: `${slotPercent}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-dark-700/50 rounded-xl p-4 text-center border border-dark-600/30 hover:border-primary-500/20 transition-colors">
                <div className="text-dark-400 text-xs mb-1">Map</div>
                <div className="text-xl font-bold capitalize">{match.map || 'Erangel'}</div>
              </div>
            </div>
          </div>

          {/* Match Info Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="card p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>📋</span> Match Details
              </h2>
              <dl className="space-y-3">
                <div className="flex justify-between items-center py-1 border-b border-dark-700/50">
                  <dt className="text-dark-400 text-sm">Game</dt>
                  <dd className="font-medium capitalize text-sm">{match.gameType?.replace('_', ' ')}</dd>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-dark-700/50">
                  <dt className="text-dark-400 text-sm">Match Type</dt>
                  <dd className="font-medium capitalize text-sm">{match.matchType?.replace('_', ' ')}</dd>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-dark-700/50">
                  <dt className="text-dark-400 text-sm">Scheduled</dt>
                  <dd className="font-medium text-sm">{new Date(match.scheduledAt).toLocaleString()}</dd>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-dark-700/50">
                  <dt className="text-dark-400 text-sm">Per Kill Prize</dt>
                  <dd className="font-medium text-sm text-gaming-green">₹{match.perKillPrize || 0}</dd>
                </div>
                {match.minLevelRequired && match.minLevelRequired !== 'bronze' && (
                  <div className="flex justify-between items-center py-1">
                    <dt className="text-dark-400 text-sm">Min Level</dt>
                    <dd className="font-medium capitalize text-sm">{match.minLevelRequired}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="card p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>🏆</span> Prize Distribution
              </h2>
              <div className="space-y-2">
                {match.prizeDistribution?.length > 0 ? (
                  match.prizeDistribution.map((prize, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-dark-700/30">
                      <span className="text-dark-300 text-sm flex items-center gap-2">
                        <span className="text-lg">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '🏅'}</span>
                        {prize.label || `Rank ${prize.position || idx + 1}`}
                      </span>
                      <span className="font-bold text-gaming-green">₹{(prize.prize ?? prize.amount ?? 0).toLocaleString()}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-dark-400">
                    <span className="text-2xl block mb-1">🎯</span>
                    Winner takes all!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rules Section */}
          {match.rules && match.rules.length > 0 && (
            <div className="card p-6 mb-6">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <span>📜</span> Match Rules
              </h2>
              <ul className="space-y-2">
                {match.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-dark-300">
                    <span className="text-primary-400 mt-0.5 shrink-0">•</span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Joined Players Section */}
          {(() => {
            const joinedUsers = match.joinedUsers || [];
            const sortedUsers = [...joinedUsers].sort((a, b) => (a.slotNumber || 0) - (b.slotNumber || 0));

            if (match.mode === 'solo') {
              // Solo: show all as individual slots
              const visibleUsers = showAllPlayers ? sortedUsers : sortedUsers.slice(0, 12);
              return sortedUsers.length > 0 ? (
                <div className="card p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <span className="text-xl">👥</span> Joined Players
                      <span className="text-sm font-normal text-dark-400 bg-dark-700/50 px-2 py-0.5 rounded-full">
                        {filledSlots}/{match.maxSlots}
                      </span>
                    </h2>
                    <div className="text-xs text-dark-400">
                      {slotsLeft > 0 ? `${slotsLeft} slots left` : <span className="text-red-400">Full</span>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {visibleUsers.map((slot, idx) => (
                      <PlayerCard key={slot._id || idx} slot={slot} idx={idx} />
                    ))}
                  </div>
                  {sortedUsers.length > 12 && (
                    <button
                      onClick={() => setShowAllPlayers(!showAllPlayers)}
                      className="w-full mt-3 py-2 text-sm text-primary-400 hover:text-primary-300 transition-colors rounded-lg hover:bg-dark-700/30"
                    >
                      {showAllPlayers ? '▲ Show Less' : `▼ Show All ${sortedUsers.length} Players`}
                    </button>
                  )}
                </div>
              ) : null;
            }

            // Duo / Squad mode: group by slotNumber
            const teams = groupByTeam(joinedUsers, groupSize, match.maxSlots);
            const filledTeams = teams.filter(t => t.length > 0);
            const visibleTeams = showAllPlayers ? teams.filter(t => t.length > 0) : filledTeams.slice(0, 6);
            const teamLabel = match.mode === 'duo' ? 'Team' : 'Squad';
            const teamIcon = match.mode === 'duo' ? '🎯' : '⚔️';
            const teamColor = match.mode === 'duo' ? 'text-primary-400' : 'text-gaming-orange';
            const totalTeams = Math.ceil(match.maxSlots / groupSize);

            return filledTeams.length > 0 ? (
              <div className="card p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <span className="text-xl">👥</span> Joined {teamLabel}s
                    <span className="text-sm font-normal text-dark-400 bg-dark-700/50 px-2 py-0.5 rounded-full">
                      {filledTeams.length}/{totalTeams}
                    </span>
                  </h2>
                  <div className="text-xs text-dark-400">
                    {totalTeams - filledTeams.length > 0
                      ? `${totalTeams - filledTeams.length} ${teamLabel.toLowerCase()}${totalTeams - filledTeams.length > 1 ? 's' : ''} left`
                      : <span className="text-red-400">All full</span>}
                  </div>
                </div>

                <div className="space-y-3">
                  {visibleTeams.map((team, _) => {
                    const teamIdx = teams.indexOf(team);
                    return (
                      <div key={teamIdx} className="bg-dark-700/30 rounded-xl p-3 border border-dark-600/40 hover:border-dark-500/60 transition-colors">
                        <div className={`text-xs font-semibold ${teamColor} mb-2 flex items-center justify-between`}>
                          <span className="flex items-center gap-1.5">
                            <span>{teamIcon}</span> {teamLabel} {teamIdx + 1}
                          </span>
                          <span className="text-dark-500 font-normal">{team.length}/{groupSize}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {team.map((slot, idx) => (
                            <PlayerCard key={slot._id || idx} slot={slot} idx={idx} compact />
                          ))}
                          {/* Empty slots in incomplete team */}
                          {team.length < groupSize && Array.from({ length: groupSize - team.length }).map((_, emptyIdx) => (
                            <div key={`empty-${emptyIdx}`} className="flex items-center gap-3 bg-dark-800/30 rounded-lg p-3 border border-dashed border-dark-600/50">
                              <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center">
                                <span className="text-dark-500 text-xs">?</span>
                              </div>
                              <span className="text-dark-500 text-sm">Open slot</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filledTeams.length > 6 && (
                  <button
                    onClick={() => setShowAllPlayers(!showAllPlayers)}
                    className="w-full mt-3 py-2 text-sm text-primary-400 hover:text-primary-300 transition-colors rounded-lg hover:bg-dark-700/30"
                  >
                    {showAllPlayers ? `▲ Show Less` : `▼ Show All ${filledTeams.length} ${teamLabel}s`}
                  </button>
                )}
              </div>
            ) : null;
          })()}

          {/* Room Credentials (if joined and credentials available) */}
          {isJoined && roomCredentials?.roomId && (
            <div className="card p-6 mb-6 border-2 border-gaming-green/50 bg-linear-to-r from-gaming-green/10 to-transparent">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gaming-green flex items-center gap-2">
                  <span className="text-2xl">🎮</span> Room Credentials
                </h2>
                <span className="text-xs bg-gaming-green/20 text-gaming-green px-2 py-1 rounded">READY</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-dark-800 rounded-lg p-4">
                  <div className="text-dark-400 text-sm mb-1">Room ID</div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-mono font-bold tracking-wider">{roomCredentials.roomId}</div>
                    <button
                      onClick={() => copyToClipboard(roomCredentials.roomId, 'roomId')}
                      className="ml-2 p-2 hover:bg-dark-700 rounded transition-colors"
                    >
                      {copied === 'roomId' ? (
                        <span className="text-gaming-green text-sm">✓ Copied</span>
                      ) : (
                        <svg className="w-5 h-5 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="bg-dark-800 rounded-lg p-4">
                  <div className="text-dark-400 text-sm mb-1">Password</div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-mono font-bold tracking-wider">{roomCredentials.roomPassword}</div>
                    <button
                      onClick={() => copyToClipboard(roomCredentials.roomPassword, 'roomPassword')}
                      className="ml-2 p-2 hover:bg-dark-700 rounded transition-colors"
                    >
                      {copied === 'roomPassword' ? (
                        <span className="text-gaming-green text-sm">✓ Copied</span>
                      ) : (
                        <svg className="w-5 h-5 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center text-dark-400 text-sm">
                Join the room and start the match. Good luck! 🏆
              </div>
            </div>
          )}


          {/* Waiting for opponent (Challenge matches) - match not full yet */}
          {isJoined && !roomCredentials?.roomId && match.matchType === 'tdm' && !isFull && (
            <div className="card p-6 mb-6 border border-yellow-500/30 bg-yellow-500/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-xl">⏳</span>
                </div>
                <div>
                  <h3 className="font-bold text-yellow-400">Waiting for Opponent</h3>
                  <p className="text-dark-400 text-sm">Room credentials will be revealed once an opponent accepts the challenge</p>
                </div>
              </div>
            </div>
          )}

          {/* Match full but room credentials loading - SIMPLIFIED CONDITION */}
          {(() => {
            const showLoading = isJoined && !roomCredentials?.roomId && isFull;
            console.log('🔍 Debug Room Credentials:', {
              isJoined,
              hasRoomId: !!roomCredentials?.roomId,
              isFull,
              matchStatus: match.status,
              showLoading,
              myStatus,
              roomCredentials
            });
            return showLoading;
          })() && (
              <div className="card p-6 mb-6 border border-blue-500/30 bg-blue-500/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-400">Loading Room Credentials...</h3>
                    <p className="text-dark-400 text-sm">Match is full! Fetching room details...</p>
                  </div>
                </div>
              </div>
            )}

          {/* Action Buttons */}
          <div className="card p-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {(match.status === 'upcoming' || match.status === 'registration_open') && (
              <>
                {isCreator ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gaming-purple/10 border border-gaming-purple/30 rounded-lg">
                      <div>
                        <div className="font-bold text-gaming-purple">👑 You created this challenge</div>
                        <p className="text-dark-400 text-sm">Waiting for an opponent to accept...</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-dark-400">Invested</div>
                        <div className="font-bold text-gaming-orange">₹{(match.creationFee || 0) + (match.prizePool || 0)}</div>
                      </div>
                    </div>

                    {canCancel && (
                      <button
                        onClick={handleCancelChallenge}
                        className="w-full py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors font-medium"
                      >
                        🚫 Cancel Challenge & Get Refund
                      </button>
                    )}

                    {!canCancel && match.isChallenge && (match.filledSlots > 1 || match.joinedUsers?.length > 1) && (
                      <div className="text-center text-yellow-400 text-sm p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        ⚠️ An opponent has joined. The match cannot be cancelled now.
                      </div>
                    )}
                  </div>
                ) : isJoined ? (
                  <div className="flex items-center justify-between">
                    <div className="text-gaming-green font-medium">✓ You have joined this match</div>
                    <button onClick={handleLeave} className="btn-secondary text-red-400 hover:text-red-300">
                      Leave Match
                    </button>
                  </div>
                ) : isAdmin ? (
                  <div className="text-center py-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <div className="text-purple-400 font-medium mb-2">👑 Administrator Account</div>
                    <p className="text-dark-400 text-sm">
                      Admins cannot join challenge matches. Use the <Link href="/matches" className="text-purple-400 hover:underline">Match Management Panel</Link> to manage matches.
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowJoinModal(true)}
                    disabled={isFull}
                    className="btn-primary w-full py-3 text-lg"
                  >
                    {isFull ? 'Match Full' : `Join Match - ₹${match.entryFee || 'FREE'}`}
                  </button>
                )}
              </>
            )}

            {match.status === 'room_revealed' && (
              <div className="text-center py-4">
                {isJoined ? (
                  <div className="space-y-2">
                    <div className="text-gaming-green text-xl font-bold">✓ You're In!</div>
                    <p className="text-dark-400">
                      {roomCredentials?.roomId
                        ? 'Room credentials are available above. Good luck!'
                        : 'Fetching room credentials...'}
                    </p>
                  </div>
                ) : (
                  <div className="text-dark-400">
                    Match is full - registration closed
                  </div>
                )}
              </div>
            )}

            {match.status === 'live' && (
              <div className="text-center py-4">
                <div className="text-gaming-green text-xl font-bold animate-pulse">Match is LIVE!</div>
              </div>
            )}

            {match.status === 'completed' && (
              <div className="text-center py-4 text-dark-400">
                This match has ended
              </div>
            )}
          </div>

          {/* Match Chat */}
          {isJoined && (
            <div className="mb-6">
              <MatchChat matchId={params.id} isJoined={isJoined} />
            </div>
          )}
        </div>
      </main>

      {/* Join Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && setShowJoinModal(false)}>
          <div className="card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">Join Match</h2>
              <button onClick={() => setShowJoinModal(false)} className="text-dark-400 hover:text-white p-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Match Summary */}
            <div className="bg-dark-700/40 rounded-lg p-3 mb-5 flex items-center justify-between text-sm border border-dark-600/40">
              <div>
                <div className="font-medium">{match.title}</div>
                <div className="text-dark-400 text-xs capitalize">{match.mode} • {match.map || 'Erangel'}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gaming-green">{match.entryFee === 0 ? 'FREE' : `₹${match.entryFee}`}</div>
                <div className="text-dark-400 text-xs">Entry Fee</div>
              </div>
            </div>

            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="label">In-Game ID</label>
                <input
                  type="text"
                  value={joinForm.inGameId}
                  onChange={(e) => setJoinForm({ ...joinForm, inGameId: e.target.value })}
                  className="input"
                  placeholder="Your BGMI ID"
                  required
                />
              </div>
              <div>
                <label className="label">In-Game Name</label>
                <input
                  type="text"
                  value={joinForm.inGameName}
                  onChange={(e) => setJoinForm({ ...joinForm, inGameName: e.target.value })}
                  className="input"
                  placeholder="Your BGMI username"
                  required
                />
              </div>

              {/* Slot Selection */}
              <div>
                <label className="label flex items-center justify-between">
                  <span>
                    {match.mode === 'solo' ? 'Choose Your Slot' : match.mode === 'duo' ? 'Choose Your Team' : 'Choose Your Squad'}
                  </span>
                  <span className="text-dark-400 text-xs font-normal">(Optional)</span>
                </label>
                <div className={`max-h-52 overflow-y-auto rounded-lg border border-dark-600 p-2.5 ${
                  match.mode === 'solo' ? 'grid grid-cols-10 gap-1' : 'grid grid-cols-5 gap-1.5'
                }`}>
                  {(() => {
                    const takenSlots = new Set(match.joinedUsers?.map(ju => ju.slotNumber) || []);
                    const totalSlots = match.maxSlots || 100;
                    const modeGroupSize = match.mode === 'duo' ? 2 : match.mode === 'squad' ? 4 : 1;
                    const label = match.mode === 'duo' ? 'T' : match.mode === 'squad' ? 'S' : '';
                    const totalGroups = match.mode === 'solo' ? totalSlots : Math.ceil(totalSlots / modeGroupSize);

                    if (match.mode === 'solo') {
                      return Array.from({ length: totalSlots }, (_, i) => {
                        const slot = i + 1;
                        const isTaken = takenSlots.has(slot);
                        const isSelected = joinForm.slotNumber === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={isTaken}
                            onClick={() => setJoinForm({ ...joinForm, slotNumber: isSelected ? null : slot })}
                            className={`py-1 rounded text-[11px] font-medium transition-all ${
                              isTaken
                                ? 'bg-red-500/15 text-red-400/50 cursor-not-allowed'
                                : isSelected
                                ? 'bg-primary-500 text-white ring-2 ring-primary-400 scale-110 shadow-lg shadow-primary-500/20'
                                : 'bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-white'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      });
                    } else {
                      return Array.from({ length: totalGroups }, (_, i) => {
                        const groupStart = i * modeGroupSize + 1;
                        const groupEnd = Math.min(groupStart + modeGroupSize - 1, totalSlots);
                        const groupSlots = Array.from({ length: groupEnd - groupStart + 1 }, (_, j) => groupStart + j);
                        const takenInGroup = groupSlots.filter(s => takenSlots.has(s)).length;
                        const isGroupFull = takenInGroup >= modeGroupSize;
                        const hasMembers = takenInGroup > 0;
                        const isSelected = joinForm.slotNumber === groupStart;
                        return (
                          <button
                            key={groupStart}
                            type="button"
                            disabled={isGroupFull}
                            onClick={() => setJoinForm({ ...joinForm, slotNumber: isSelected ? null : groupStart })}
                            className={`py-1.5 rounded text-xs font-medium transition-all relative ${
                              isGroupFull
                                ? 'bg-red-500/15 text-red-400/50 cursor-not-allowed'
                                : isSelected
                                ? 'bg-primary-500 text-white ring-2 ring-primary-400 scale-105 shadow-lg shadow-primary-500/20'
                                : hasMembers
                                ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                                : 'bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-white'
                            }`}
                            title={isGroupFull ? `${label}${i + 1} is full` : hasMembers ? `${label}${i + 1}: ${takenInGroup}/${modeGroupSize} joined` : `${label}${i + 1}: Empty`}
                          >
                            {label}{i + 1}
                            {hasMembers && !isGroupFull && (
                              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-yellow-500 rounded-full text-[8px] text-black font-bold flex items-center justify-center">
                                {takenInGroup}
                              </span>
                            )}
                          </button>
                        );
                      });
                    }
                  })()}
                </div>
                {/* Legend */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[10px] text-dark-400">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-dark-700 inline-block"></span> Available</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-primary-500 inline-block"></span> Selected</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red-500/20 inline-block"></span> Taken</span>
                  {match.mode !== 'solo' && (
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-yellow-500/20 inline-block"></span> Has members</span>
                  )}
                </div>
                {joinForm.slotNumber && (
                  <div className="mt-1.5 text-xs text-primary-400 font-medium">
                    ✓ {match.mode === 'solo' ? `Slot ${joinForm.slotNumber}` : match.mode === 'duo' ? `Team ${Math.ceil(joinForm.slotNumber / 2)}` : `Squad ${Math.ceil(joinForm.slotNumber / 4)}`} selected
                  </div>
                )}
              </div>

              {/* Error in modal */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowJoinModal(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={joining} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {joining ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Joining...
                    </>
                  ) : (
                    `Join${match.entryFee > 0 ? ` - ₹${match.entryFee}` : ''}`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
