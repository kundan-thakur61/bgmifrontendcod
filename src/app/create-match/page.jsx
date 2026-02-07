'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api, getMatches } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import UserOnly from '@/components/auth/UserOnly';

export default function CreateMatchPage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    gameType: 'pubg_mobile',
    matchType: 'tdm',
    mode: 'squad',
    map: 'erangel',
    entryFee: '',
    prizePool: '',
    perKillPrize: '0',
    maxSlots: '2', // Default to 1v1 challenge
    minLevelRequired: 'bronze',
    scheduledAt: '',
    roomId: '',
    roomPassword: '',
    rules: [],
    isFeatured: false,
    tags: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [activeMatches, setActiveMatches] = useState([]);
  const [checkingActiveMatch, setCheckingActiveMatch] = useState(true);
  const MAX_ACTIVE_MATCHES = 3;

  // Calculate costs
  const prizePool = parseInt(formData.prizePool) || 0;
  const creationFee = Math.max(Math.floor(prizePool * 0.10), prizePool > 0 ? 5 : 0);
  const totalCost = creationFee + prizePool;
  const entryFee = parseInt(formData.entryFee) || 0;

  useEffect(() => {
    setIsVisible(true);

    // Check if user already has an active match THEY CREATED
    const checkActiveMatch = async () => {
      try {
        // Use user.id or user._id (API returns 'id')
        const userId = user?.id || user?._id;
        if (!userId) {
          setCheckingActiveMatch(false);
          return;
        }

        const matches = await getMatches({
          createdBy: userId,
          status: 'upcoming,registration_open,registration_closed,room_revealed,live,result_pending'
        });

        // Find all matches created by this user
        const myActiveMatches = matches.matches.filter(match => {
          const matchCreatorId = match.createdBy?._id || match.createdBy?.id || match.createdBy;
          return matchCreatorId === userId || matchCreatorId?.toString() === userId?.toString();
        });

        setActiveMatches(myActiveMatches);
        if (myActiveMatches.length >= MAX_ACTIVE_MATCHES) {
          setError(`You already have ${myActiveMatches.length} active challenges. Maximum ${MAX_ACTIVE_MATCHES} allowed at a time.`);
        }
      } catch (err) {
        console.error('Error checking active matches:', err);
      } finally {
        setCheckingActiveMatch(false);
      }
    };

    if (user) {
      checkActiveMatch();
    } else {
      setCheckingActiveMatch(false);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRuleChange = (index, value) => {
    const newRules = [...formData.rules];
    newRules[index] = value;
    setFormData(prev => ({ ...prev, rules: newRules }));
  };

  const addRule = () => {
    setFormData(prev => ({ ...prev, rules: [...prev.rules, ''] }));
  };

  const removeRule = (index) => {
    const newRules = formData.rules.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, rules: newRules }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user already has max active matches
    if (activeMatches.length >= MAX_ACTIVE_MATCHES) {
      setError(`You already have ${activeMatches.length} active challenges. Maximum ${MAX_ACTIVE_MATCHES} allowed at a time.`);
      return;
    }

    // Validate room credentials
    if (!formData.roomId || !formData.roomPassword) {
      setError('Room ID and Password are required. You need to create a room in the game first.');
      return;
    }

    // Validate balance
    if (user.walletBalance < totalCost) {
      setError(`Insufficient balance. You need ₹${totalCost} but have ₹${user.walletBalance}`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const matchData = {
        ...formData,
        entryFee: parseInt(formData.entryFee),
        prizePool: parseInt(formData.prizePool),
        perKillPrize: parseInt(formData.perKillPrize),
        maxSlots: parseInt(formData.maxSlots),
        scheduledAt: new Date(formData.scheduledAt).toISOString(),
        roomId: formData.roomId,
        roomPassword: formData.roomPassword
      };

      const result = await api.createUserMatch(matchData);

      // Update user balance in context
      if (result.costs) {
        updateUser({ walletBalance: user.walletBalance - result.costs.totalDeducted });
      }

      if (result.match && result.match._id) {
        router.push(`/matches/${result.match._id}`);
      } else {
        router.push('/create-match');
      }
      router.refresh();
    } catch (err) {
      setError(err.message || 'Failed to create challenge');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900">
        {/* Animated background orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary-500/8 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-gaming-purple/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
        <div className="relative text-center p-10 sm:p-12 bg-dark-800/60 backdrop-blur-xl rounded-3xl border border-dark-700/80 shadow-2xl shadow-dark-900/50 max-w-md mx-4">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center border border-red-500/20">
            <span className="text-5xl">🔒</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-dark-300 mb-8">Sign in to your account to create and manage challenges</p>
          <button
            onClick={() => router.push('/login')}
            className="w-full px-6 py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary-500/25 active:scale-[0.98]"
          >
            Sign In to Continue
          </button>
          <p className="text-dark-500 text-sm mt-4">Don't have an account? <span className="text-primary-400 cursor-pointer hover:underline" onClick={() => router.push('/register')}>Create one</span></p>
        </div>
      </div>
    );
  }

  // Show loading state while checking for active match
  if (checkingActiveMatch) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary-500/8 rounded-full blur-3xl animate-pulse" />
        </div>
        <div className="relative text-center p-10 sm:p-12 bg-dark-800/60 backdrop-blur-xl rounded-3xl border border-dark-700/80 shadow-2xl max-w-md mx-4">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full border-4 border-dark-600"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-primary-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-gaming-purple border-b-transparent border-l-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">⚔️</span>
            </div>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Preparing Your Arena</h2>
          <p className="text-dark-400 text-sm">Checking your active matches...</p>
          <div className="mt-6 flex justify-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = {
    upcoming: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', dot: 'bg-blue-400', label: 'Upcoming' },
    registration_open: { color: 'bg-green-500/20 text-green-400 border-green-500/30', dot: 'bg-green-400', label: 'Open' },
    registration_closed: { color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', dot: 'bg-orange-400', label: 'Closed' },
    room_revealed: { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', dot: 'bg-purple-400', label: 'Room Revealed' },
    live: { color: 'bg-red-500/20 text-red-400 border-red-500/30', dot: 'bg-red-400 animate-pulse', label: 'Live' },
    result_pending: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', dot: 'bg-yellow-400', label: 'Pending' },
  };

  // Show message if user already has max active matches
  if (activeMatches.length >= MAX_ACTIVE_MATCHES) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 py-10 px-4">
        {/* Animated background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative max-w-2xl mx-auto">
          {/* Header Card */}
          <div className="text-center mb-8 p-8 sm:p-10 bg-dark-800/60 backdrop-blur-xl rounded-3xl border border-yellow-500/20 shadow-2xl shadow-yellow-500/5">
            {/* Warning icon with glow */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center border-2 border-yellow-500/30">
                <span className="text-5xl">⚠️</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Match Limit Reached</h1>
            <p className="text-dark-300 text-base sm:text-lg mb-6">
              You've reached the maximum of <span className="text-yellow-400 font-semibold">{MAX_ACTIVE_MATCHES} active challenges</span>. Complete or cancel an existing match to create a new one.
            </p>

            {/* Progress Bar */}
            <div className="max-w-xs mx-auto">
              <div className="flex justify-between text-xs text-dark-400 mb-1.5">
                <span>Active Matches</span>
                <span className="text-yellow-400 font-semibold">{activeMatches.length}/{MAX_ACTIVE_MATCHES}</span>
              </div>
              <div className="h-3 bg-dark-700 rounded-full overflow-hidden border border-dark-600">
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min((activeMatches.length / MAX_ACTIVE_MATCHES) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Active Matches List */}
          <div className="bg-dark-800/60 backdrop-blur-xl rounded-3xl border border-dark-700/80 shadow-xl overflow-hidden mb-8">
            <div className="p-5 sm:p-6 border-b border-dark-700/80">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="w-8 h-8 bg-primary-500/15 rounded-lg flex items-center justify-center text-lg">🎮</span>
                Your Active Matches
              </h3>
            </div>
            <div className="divide-y divide-dark-700/50">
              {activeMatches.map((match, index) => {
                const status = statusConfig[match.status] || statusConfig.upcoming;
                const fillPercentage = match.maxSlots ? Math.round((match.filledSlots / match.maxSlots) * 100) : 0;
                return (
                  <div
                    key={match._id}
                    className="p-4 sm:p-5 hover:bg-dark-700/30 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      {/* Match Number */}
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary-500/20 to-gaming-purple/20 rounded-xl flex items-center justify-center border border-primary-500/20">
                        <span className="text-primary-400 font-bold text-sm">{index + 1}</span>
                      </div>

                      {/* Match Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-semibold truncate">{match.title}</h4>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                            {status.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-dark-400">
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {match.filledSlots}/{match.maxSlots} players
                          </span>
                          {/* Player fill bar */}
                          <div className="w-16 h-1.5 bg-dark-600 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-500 ${fillPercentage >= 100 ? 'bg-green-500' : fillPercentage >= 50 ? 'bg-yellow-500' : 'bg-primary-500'}`} style={{ width: `${fillPercentage}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* View Button */}
                      <button
                        onClick={() => router.push(`/matches/${match._id}`)}
                        className="flex-shrink-0 px-4 py-2 bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 text-sm font-medium rounded-xl border border-primary-500/20 hover:border-primary-500/40 transition-all duration-300 group-hover:scale-105 active:scale-95"
                      >
                        <span className="flex items-center gap-1.5">
                          View
                          <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push('/matches')}
              className="px-6 py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary-500/25 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
              Browse All Matches
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3.5 bg-dark-700 hover:bg-dark-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-dark-600 hover:border-dark-500 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Go to Dashboard
            </button>
          </div>

          {/* Tip */}
          <div className="mt-6 text-center">
            <p className="text-xs text-dark-500 flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Tip: Complete or cancel a match to free up a slot
            </p>
          </div>
        </div>
      </div>
    );
  }

  const gameIcons = {
    pubg_mobile: '🎯',
    free_fire: '🔥'
  };

  const modeIcons = {
    squad: '👥',
    duo: '👤👤',
    solo: '👤'
  };

  const levelColors = {
    bronze: 'from-orange-600 to-orange-800',
    silver: 'from-gray-400 to-gray-600',
    gold: 'from-yellow-500 to-yellow-700',
    platinum: 'from-cyan-400 to-cyan-600',
    diamond: 'from-blue-400 to-purple-500'
  };

  return (
    <UserOnly>
      <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 py-8 px-4 sm:px-6 lg:px-8">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gaming-purple/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        <div className={`relative max-w-5xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-500 to-gaming-purple rounded-2xl mb-4 sm:mb-6 shadow-lg shadow-primary-500/30 animate-float">
              <span className="text-3xl sm:text-4xl">⚔️</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-dark-400">
              Create Challenge
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-dark-400 max-w-2xl mx-auto">
              Challenge opponents to a TDM match! Set your prize pool and wait for challengers.
            </p>

            {/* Wallet Balance Card */}
            <div className="mt-5 inline-flex items-center gap-3 px-5 py-3 bg-dark-800/70 rounded-2xl border border-dark-700/80 backdrop-blur-sm shadow-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg flex items-center justify-center">
                <span className="text-lg">💳</span>
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wider text-dark-500 font-medium">Wallet Balance</p>
                <p className={`text-lg font-bold leading-tight ${user?.walletBalance >= totalCost ? 'text-green-400' : 'text-red-400'}`}>
                  ₹{user?.walletBalance?.toLocaleString() || 0}
                </p>
              </div>
              {totalCost > 0 && (
                <div className="ml-1 pl-3 border-l border-dark-600">
                  <p className="text-[10px] uppercase tracking-wider text-dark-500 font-medium">Required</p>
                  <p className="text-lg font-bold leading-tight text-yellow-400">₹{totalCost.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Form Step Indicator */}
          <div className="mb-8 hidden sm:block">
            <div className="flex items-center justify-center max-w-3xl mx-auto">
              {[
                { icon: '📝', label: 'Basic Info' },
                { icon: '🎮', label: 'Match Details' },
                { icon: '💰', label: 'Pricing' },
                { icon: '🔐', label: 'Room Credentials' },
                { icon: '⏰', label: 'Schedule' },
              ].map((step, idx) => (
                <div key={idx} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500/15 to-gaming-purple/15 rounded-xl flex items-center justify-center border border-primary-500/20 text-lg">
                      {step.icon}
                    </div>
                    <span className="text-[10px] text-dark-500 mt-1.5 font-medium">{step.label}</span>
                  </div>
                  {idx < 4 && <div className="w-8 lg:w-14 h-px bg-gradient-to-r from-primary-500/30 to-dark-600 mx-1 mb-5" />}
                </div>
              ))}
            </div>
          </div>

          {/* How It Works Banner */}
          <div className="mb-8 p-5 sm:p-6 bg-gradient-to-br from-primary-500/8 via-dark-800/50 to-gaming-purple/8 border border-primary-500/20 rounded-2xl backdrop-blur-sm">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-primary-500/15 rounded-lg flex items-center justify-center text-sm">🎮</span>
              How Challenge Matches Work
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                { num: '1', text: 'You pay', highlight: 'Creation Fee + Prize Pool', sub: 'upfront', color: 'from-blue-500/15 to-blue-500/5 border-blue-500/20' },
                { num: '2', text: 'Challenge goes', highlight: 'live for everyone', sub: 'to see', color: 'from-green-500/15 to-green-500/5 border-green-500/20' },
                { num: '3', text: 'Opponent pays', highlight: 'Entry Fee', sub: 'to accept', color: 'from-yellow-500/15 to-yellow-500/5 border-yellow-500/20' },
                { num: '4', text: '', highlight: 'Room ID & Password', sub: 'revealed to both', color: 'from-purple-500/15 to-purple-500/5 border-purple-500/20' },
              ].map((item, idx) => (
                <div key={idx} className={`p-3 rounded-xl bg-gradient-to-br ${item.color} border`}>
                  <div className="flex items-start gap-2.5">
                    <span className="bg-white/10 text-white rounded-lg w-6 h-6 flex items-center justify-center shrink-0 text-xs font-bold">{item.num}</span>
                    <p className="text-dark-300 text-sm leading-relaxed">
                      {item.text}{item.text ? ' ' : ''}<strong className="text-white">{item.highlight}</strong> {item.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/8 border border-red-500/30 text-red-400 rounded-2xl backdrop-blur-md animate-shake">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-500/15 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-red-300">Something went wrong</p>
                  <p className="text-sm text-red-400/80 mt-0.5">{error}</p>
                </div>
                <button onClick={() => setError('')} className="text-red-400/60 hover:text-red-400 transition-colors p-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="group relative">
              <div className="absolute -inset-px bg-gradient-to-br from-primary-500/20 to-gaming-purple/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-700" />
              <div className="relative bg-dark-800/50 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-dark-700/80 hover:border-primary-500/30 transition-all duration-500">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500/15 to-gaming-purple/15 rounded-xl flex items-center justify-center mr-4 border border-primary-500/20">
                    <span className="text-xl sm:text-2xl">📝</span>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-white">Basic Information</h2>
                    <p className="text-xs text-dark-500 mt-0.5">Set up your challenge details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-dark-300">
                      Weapon Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-dark-700/50 border-2 border-dark-600 rounded-xl text-white placeholder-dark-400 focus:border-primary-500 focus:outline-none transition-all duration-300"
                        placeholder="Enter an exciting match title"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-dark-300">
                      Game Type <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="gameType"
                        value={formData.gameType}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-dark-700/50 border-2 border-dark-600 rounded-xl text-white focus:border-primary-500 focus:outline-none transition-all duration-300 appearance-none cursor-pointer"
                      >
                        <option value="pubg_mobile">🎯 PUBG Mobile</option>
                        <option value="free_fire">🔥 Free Fire</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>


              </div>
            </div>

            {/* Match Details */}
            <div className="group relative">
              <div className="absolute -inset-px bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-700" />
              <div className="relative bg-dark-800/50 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-dark-700/80 hover:border-blue-500/30 transition-all duration-500">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500/15 to-cyan-500/15 rounded-xl flex items-center justify-center mr-4 border border-blue-500/20">
                    <span className="text-xl sm:text-2xl">🎮</span>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-white">Match Details</h2>
                    <p className="text-xs text-dark-500 mt-0.5">Configure map, mode and format</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-dark-300">
                      Select Map <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value="TDM /CUSTOM"
                        disabled
                        className="w-full px-4 py-3 bg-dark-700/30 border-2 border-dark-600 rounded-xl text-dark-400 cursor-not-allowed"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">

                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-dark-300">
                      Mode <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="mode"
                        value={formData.mode}
                        onChange={handleChange}
                        className="w-full px-4 py-3 pl-12 bg-dark-700/50 border-2 border-dark-600 rounded-xl text-white focus:border-primary-500 focus:outline-none transition-all duration-300 appearance-none cursor-pointer"
                      >
                        <option value="squad">Squad (4 players)</option>
                        <option value="duo">Duo (2 players)</option>
                        <option value="solo">Solo (1 player)</option>
                      </select>
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                        {modeIcons[formData.mode]}
                      </div>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>


                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div className="group relative">
              <div className="absolute -inset-px bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-700" />
              <div className="relative bg-dark-800/50 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-dark-700/80 hover:border-green-500/30 transition-all duration-500">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500/15 to-emerald-500/15 rounded-xl flex items-center justify-center mr-4 border border-green-500/20">
                    <span className="text-xl sm:text-2xl">💰</span>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-white">Challenge Pricing</h2>
                    <p className="text-xs text-dark-500 mt-0.5">Set prize pool and entry fees</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-dark-300">
                      Prize Pool (₹) <span className="text-red-400">*</span>
                      <span className="text-xs text-dark-500 ml-2">(Winner takes all)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400 font-semibold">₹</span>
                      <input
                        type="number"
                        name="prizePool"
                        value={formData.prizePool}
                        onChange={handleChange}
                        required
                        min="10"
                        className="w-full px-4 py-3 pl-10 bg-dark-700/50 border-2 border-dark-600 rounded-xl text-white placeholder-dark-400 focus:border-primary-500 focus:outline-none transition-all duration-300"
                        placeholder="Min ₹10"
                      />
                    </div>
                    <p className="text-xs text-dark-500">This amount goes to the winner</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-dark-300">
                      Entry Fee for Opponents (₹) <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400 font-semibold">₹</span>
                      <input
                        type="number"
                        name="entryFee"
                        value={formData.entryFee}
                        onChange={handleChange}
                        required
                        min="0"
                        className="w-full px-4 py-3 pl-10 bg-dark-700/50 border-2 border-dark-600 rounded-xl text-white placeholder-dark-400 focus:border-primary-500 focus:outline-none transition-all duration-300"
                        placeholder="0"
                      />
                    </div>
                    <p className="text-xs text-dark-500">Opponents pay this to accept your challenge</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-dark-300">
                      Max Players <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="maxSlots"
                        value={formData.maxSlots}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-dark-700/50 border-2 border-dark-600 rounded-xl text-white focus:border-primary-500 focus:outline-none transition-all duration-300 appearance-none cursor-pointer"
                      >
                        <option value="2">1v1 (2 players)</option>
                        <option value="4">2v2 (4 players)</option>
                        <option value="8">4v4 (8 players)</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                {prizePool > 0 && (
                  <div className="mt-6 p-5 bg-gradient-to-br from-dark-900/60 to-dark-800/60 rounded-2xl border border-dark-600/80">
                    <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 bg-yellow-500/15 rounded-md flex items-center justify-center text-xs">💳</span>
                      Cost Breakdown
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-dark-400 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-yellow-500/60"></span>
                          Prize Pool <span className="text-dark-600 text-xs">(goes to winner)</span>
                        </span>
                        <span className="text-yellow-400 font-semibold">₹{prizePool.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-dark-400 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-orange-500/60"></span>
                          Creation Fee <span className="text-dark-600 text-xs">(10%, min ₹5)</span>
                        </span>
                        <span className="text-orange-400 font-semibold">₹{creationFee.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-dark-600/60 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-bold">Total You Pay</span>
                          <span className={`text-lg font-bold ${totalCost <= (user?.walletBalance || 0) ? 'text-green-400' : 'text-red-400'}`}>₹{totalCost.toLocaleString()}</span>
                        </div>
                      </div>
                      {totalCost > (user?.walletBalance || 0) && (
                        <div className="mt-2 p-3 bg-red-500/8 border border-red-500/20 rounded-xl flex items-center gap-2">
                          <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <p className="text-red-400 text-xs">Insufficient balance! Add <strong>₹{(totalCost - (user?.walletBalance || 0)).toLocaleString()}</strong> to your wallet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Room Credentials */}
            <div className="group relative">
              <div className="absolute -inset-px bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-700" />
              <div className="relative bg-dark-800/50 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-dark-700/80 hover:border-indigo-500/30 transition-all duration-500">
                <div className="flex items-center mb-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500/15 to-cyan-500/15 rounded-xl flex items-center justify-center mr-4 border border-indigo-500/20">
                    <span className="text-xl sm:text-2xl">🔐</span>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-white">Room Credentials</h2>
                    <p className="text-xs text-dark-500 mt-0.5">Create a room in-game first, then enter details here</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-500/8 to-orange-500/8 border border-yellow-500/20 rounded-xl p-4 mb-5 flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-500/15 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <div>
                    <p className="text-yellow-300 text-sm font-medium">Secure & Hidden</p>
                    <p className="text-yellow-400/70 text-xs mt-0.5">Room ID & Password are encrypted and only revealed to both players after the match is full.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-dark-300">
                      Room ID <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 text-lg">#</span>
                      <input
                        type="text"
                        name="roomId"
                        value={formData.roomId}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 pl-10 bg-dark-700/50 border-2 border-dark-600 rounded-xl text-white placeholder-dark-400 focus:border-primary-500 focus:outline-none transition-all duration-300"
                        placeholder="Enter room ID from game"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-dark-300">
                      Room Password <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 text-lg">🔑</span>
                      <input
                        type="text"
                        name="roomPassword"
                        value={formData.roomPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 pl-10 bg-dark-700/50 border-2 border-dark-600 rounded-xl text-white placeholder-dark-400 focus:border-primary-500 focus:outline-none transition-all duration-300"
                        placeholder="Enter room password"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule & Requirements */}
            <div className="group relative">
              <div className="absolute -inset-px bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-700" />
              <div className="relative bg-dark-800/50 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-dark-700/80 hover:border-purple-500/30 transition-all duration-500">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-xl flex items-center justify-center mr-4 border border-purple-500/20">
                    <span className="text-xl sm:text-2xl">⏰</span>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-white">Schedule & Requirements</h2>
                    <p className="text-xs text-dark-500 mt-0.5">Set timing and level requirements</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-dark-300">
                      Scheduled Time <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 text-lg">📅</span>
                      <input
                        type="datetime-local"
                        name="scheduledAt"
                        value={formData.scheduledAt}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 pl-12 bg-dark-700/50 border-2 border-dark-600 rounded-xl text-white focus:border-primary-500 focus:outline-none transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-dark-300">Minimum Level Required</label>
                    <div className="relative">
                      <select
                        name="minLevelRequired"
                        value={formData.minLevelRequired}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-dark-700/50 border-2 border-dark-600 rounded-xl text-white focus:border-primary-500 focus:outline-none transition-all duration-300 appearance-none cursor-pointer"
                      >
                        <option value="bronze">🥉 Bronze</option>
                        <option value="silver">🥈 Silver</option>
                        <option value="gold">🥇 Gold</option>
                        <option value="platinum">💎 Platinum</option>
                        <option value="diamond">💠 Diamond</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <div className={`h-2 rounded-full bg-gradient-to-r ${levelColors[formData.minLevelRequired]} transition-all duration-300`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Rules */}
            <div className="group relative">
              <div className="absolute -inset-px bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-700" />
              <div className="relative bg-dark-800/50 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-dark-700/80 hover:border-orange-500/30 transition-all duration-500">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500/15 to-red-500/15 rounded-xl flex items-center justify-center mr-4 border border-orange-500/20">
                      <span className="text-xl sm:text-2xl">📜</span>
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-semibold text-white">Match Rules</h2>
                      <p className="text-xs text-dark-500 mt-0.5">Optional custom rules for your match</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addRule}
                    className="px-4 py-2 bg-gradient-to-r from-primary-500/15 to-gaming-purple/15 border border-primary-500/30 rounded-xl font-medium text-sm text-primary-400 hover:from-primary-500/25 hover:to-gaming-purple/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add Rule
                  </button>
                </div>

                {formData.rules.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-dark-600 rounded-2xl">
                    <div className="text-5xl mb-4">📝</div>
                    <p className="text-dark-400 mb-4">No rules added yet</p>
                    <button
                      type="button"
                      onClick={addRule}
                      className="px-6 py-3 bg-dark-700 hover:bg-dark-600 rounded-xl font-semibold transition-all duration-300"
                    >
                      Add Your First Rule
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.rules.map((rule, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-4 bg-dark-700/30 rounded-xl border border-dark-600 hover:border-dark-500 transition-all duration-300 group/rule"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center mt-1">
                          <span className="text-primary-400 font-bold text-sm">{index + 1}</span>
                        </div>
                        <input
                          type="text"
                          value={rule}
                          onChange={(e) => handleRuleChange(index, e.target.value)}
                          className="flex-1 px-4 py-3 bg-dark-700/50 border-2 border-dark-600 rounded-xl text-white placeholder-dark-400 focus:border-primary-500 focus:outline-none transition-all duration-300"
                          placeholder={`Rule ${index + 1}: e.g., No teaming allowed`}
                        />
                        <button
                          type="button"
                          onClick={() => removeRule(index)}
                          className="flex-shrink-0 w-10 h-10 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all duration-300 flex items-center justify-center group-hover/rule:scale-110"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Section */}
            <div className="sticky bottom-4 z-10">
              <div className="bg-dark-800/95 backdrop-blur-xl p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-dark-700/80 shadow-2xl shadow-dark-900/60">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left w-full sm:w-auto">
                    <div className="flex items-center gap-3 justify-center sm:justify-start">
                      <div className="hidden sm:flex w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl items-center justify-center border border-green-500/20">
                        <span className="text-lg">💰</span>
                      </div>
                      <div>
                        <p className="text-xs text-dark-500 uppercase tracking-wider font-medium">Total Cost</p>
                        <p className="text-xl sm:text-2xl font-bold">
                          <span className={totalCost <= (user?.walletBalance || 0) ? 'text-green-400' : 'text-red-400'}>₹{totalCost.toLocaleString()}</span>
                        </p>
                      </div>
                      {entryFee > 0 && (
                        <div className="pl-3 border-l border-dark-600 hidden sm:block">
                          <p className="text-xs text-dark-500 uppercase tracking-wider font-medium">Opponent Pays</p>
                          <p className="text-lg font-bold text-yellow-400">₹{entryFee.toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5 justify-center sm:justify-start">
                      <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      <p className="text-[11px] text-dark-400">Room credentials revealed only after opponent joins</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="flex-1 sm:flex-none px-5 py-3 bg-dark-700 hover:bg-dark-600 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-dark-600 hover:border-dark-500 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || totalCost > (user?.walletBalance || 0) || !formData.roomId || !formData.roomPassword}
                      className="flex-1 sm:flex-none px-6 sm:px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-green-500/30 relative overflow-hidden group text-sm sm:text-base"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <span>⚔️</span>
                          <span>Create Challenge</span>
                          <span className="bg-white/15 px-2 py-0.5 rounded-md text-xs font-bold">₹{totalCost}</span>
                        </span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-15 transition-opacity duration-300" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-5px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(5px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #1f2937;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #8b5cf6, #ec4899);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #a78bfa, #f472b6);
        }

        /* Remove number input spinners */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }

        /* Custom date input styling */
        input[type="datetime-local"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }
      `}</style>
      </div>
    </UserOnly>
  );
}