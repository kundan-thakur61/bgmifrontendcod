'use client';

import { useState } from 'react';

/**
 * Next.js Performance Optimizer for Esports Gaming Platform
 * Provides specific technical optimizations to increase engagement time and reduce bounce rates
 */
export default function NextJsOptimizer() {
  const [activeTab, setActiveTab] = useState('ui-ux');
  const [implementedOptimizations, setImplementedOptimizations] = useState(new Set());

  const optimizations = {
    'ui-ux': [
      {
        id: 'progressive-loading',
        title: 'Progressive Content Loading',
        description: 'Load tournament details and gameplay content as users scroll to keep them engaged longer',
        impact: 'High',
        effort: 'Medium',
        implementation: `
// Implement Intersection Observer for progressive loading
import { useEffect, useRef } from 'react';

export default function TournamentList() {
  const observer = useRef();
  
  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Load tournament details when in viewport
          loadTournamentData(entry.target.dataset.tournamentId);
        }
      });
    });
  }, []);

  return (
    <div className="tournament-grid">
      {tournaments.map(tournament => (
        <div 
          key={tournament.id}
          data-tournament-id={tournament.id}
          ref={el => el && observer.current?.observe(el)}
          className="tournament-card"
        >
          <div className="tournament-preview">
            {/* Base content loaded immediately */}
            <h3>{tournament.name}</h3>
            <div className="tournament-meta">
              <span>₹{tournament.prizePool}</span>
              <span>{tournament.playerCount} players</span>
            </div>
          </div>
          {/* Detailed content loaded on scroll */}
          <div className="tournament-details hidden">
            <MatchReplayPreview matchId={tournament.featuredMatch} />
            <PlayerStats stats={tournament.stats} />
          </div>
        </div>
      ))}
    </div>
  );
}`
      },
      {
        id: 'sticky-navigation',
        title: 'Sticky Tournament Navigation',
        description: 'Keep tournament navigation visible during gameplay content browsing',
        impact: 'Medium',
        effort: 'Low',
        implementation: `
// Sticky navigation with game mode filters
export default function StickyTournamentNav() {
  const [activeFilter, setActiveFilter] = useState('all');
  
  return (
    <div className="sticky top-16 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2 overflow-x-auto">
            {['All', 'Solo', 'Duo', 'Squad'].map(mode => (
              <button
                key={mode}
                onClick={() => setActiveFilter(mode.toLowerCase())}
                className={\`px-4 py-2 rounded-lg transition-all \${
                  activeFilter === mode.toLowerCase()
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }\`}
              >
                {mode}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Live: {liveTournaments} tournaments</span>
          </div>
        </div>
      </div>
    </div>
  );
}`
      },
      {
        id: 'engagement-widgets',
        title: 'Interactive Engagement Widgets',
        description: 'Add real-time engagement elements like live chat, tournament countdowns, and player leaderboards',
        impact: 'High',
        effort: 'High',
        implementation: `
// Real-time engagement components
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

export default function EngagementWidgets() {
  const [onlinePlayers, setOnlinePlayers] = useState(0);
  const [tournamentCountdown, setTournamentCountdown] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);
    
    socket.on('tournamentUpdate', data => {
      setTournamentCountdown(data.countdown);
      setOnlinePlayers(data.playersOnline);
    });
    
    socket.on('leaderboardUpdate', data => {
      setLeaderboard(data.slice(0, 5));
    });
    
    return () => socket.disconnect();
  }, []);
  
  return (
    <div className="fixed bottom-4 right-4 space-y-3 z-50">
      {/* Live Player Counter */}
      <div className="bg-gray-900 border border-purple-500/30 rounded-lg p-3 shadow-xl">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-300">{onlinePlayers} players online</span>
        </div>
      </div>
      
      {/* Tournament Countdown */}
      {tournamentCountdown && (
        <div className="bg-gradient-to-r from-purple-900/80 to-blue-900/80 border border-purple-500/50 rounded-lg p-3 shadow-xl">
          <div className="text-center">
            <div className="text-xs text-purple-300 mb-1">Next Tournament</div>
            <div className="text-lg font-bold text-white">{tournamentCountdown}</div>
            <button className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white text-xs py-1 px-2 rounded">
              Join Now
            </button>
          </div>
        </div>
      )}
      
      {/* Mini Leaderboard */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl max-h-48 overflow-y-auto">
        <div className="text-xs text-gray-400 mb-2">Top Players</div>
        {leaderboard.map((player, index) => (
          <div key={player.id} className="flex items-center justify-between py-1 text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">#{index + 1}</span>
              <span className="text-white">{player.name}</span>
            </div>
            <span className="text-purple-400">{player.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}`
      }
    ],
    'technical': [
      {
        id: 'image-optimization',
        title: 'Next.js Image Optimization',
        description: 'Optimize gameplay screenshots and tournament images for faster loading',
        impact: 'High',
        effort: 'Low',
        implementation: `
// Optimized image component for gameplay content
import Image from 'next/image';

export default function OptimizedGameplayImage({ src, alt, priority = false }) {
  return (
    <div className="relative aspect-video rounded-lg overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={priority}
        quality={85}
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,..."
        className="object-cover transition-transform hover:scale-105"
        onLoadingComplete={(img) => {
          // Track image load performance
          if ('performance' in window) {
            const loadTime = performance.now() - img.dataset.loadStart;
            gtag('event', 'image_load_time', {
              value: Math.round(loadTime),
              event_category: 'performance',
              image_src: src
            });
          }
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity">
        <div className="absolute bottom-2 left-2 text-white text-sm">
          Click to view full replay
        </div>
      </div>
    </div>
  );
}`
      },
      {
        id: 'dynamic-imports',
        title: 'Dynamic Component Imports',
        description: 'Split heavy components like 3D viewers and video players for faster initial load',
        impact: 'High',
        effort: 'Medium',
        implementation: `
// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

// Heavy 3D replay viewer - only loads when needed
const ReplayViewer = dynamic(
  () => import('@/components/replay/ReplayViewer'),
  { 
    loading: () => (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Loading replay viewer...</p>
      </div>
    ),
    ssr: false // Disable SSR for client-only components
  }
);

// Video player component
const VideoPlayer = dynamic(
  () => import('@/components/media/VideoPlayer'),
  { 
    loading: () => <div className="bg-gray-800 aspect-video rounded-lg animate-pulse"></div>,
    ssr: false 
  }
);

export default function TournamentDetail({ tournament }) {
  const [showReplay, setShowReplay] = useState(false);
  
  return (
    <div className="space-y-6">
      {/* Main content loads immediately */}
      <div className="tournament-header">
        <h1 className="text-3xl font-bold">{tournament.name}</h1>
        <div className="tournament-meta">
          <span>Prize: ₹{tournament.prizePool}</span>
          <span>{tournament.playerCount} players</span>
        </div>
      </div>
      
      {/* Heavy components load on demand */}
      <div className="replay-section">
        <button 
          onClick={() => setShowReplay(true)}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
        >
          View Match Replay
        </button>
        
        {showReplay && <ReplayViewer matchId={tournament.featuredMatch} />}
      </div>
      
      <VideoPlayer src={tournament.highlightVideo} />
    </div>
  );
}`
      },
      {
        id: 'isr-implementation',
        title: 'ISR for Tournament Data',
        description: 'Use Incremental Static Regeneration for frequently updated tournament information',
        impact: 'Medium',
        effort: 'Medium',
        implementation: `
// pages/tournaments/[id].js - ISR implementation
export async function getStaticPaths() {
  // Get popular/active tournament IDs
  const tournaments = await fetchTournaments({ limit: 100 });
  
  return {
    paths: tournaments.map(tournament => ({
      params: { id: tournament.id.toString() }
    })),
    fallback: 'blocking' // Generate new pages on-demand
  };
}

export async function getStaticProps({ params }) {
  const tournament = await fetchTournament(params.id);
  const relatedTournaments = await fetchRelatedTournaments(params.id);
  
  return {
    props: {
      tournament,
      relatedTournaments,
      lastUpdated: new Date().toISOString()
    },
    // Revalidate every 5 minutes for active tournaments
    revalidate: tournament.status === 'active' ? 300 : 3600
  };
}

export default function TournamentPage({ tournament, relatedTournaments, lastUpdated }) {
  // Revalidate in browser for real-time updates
  useEffect(() => {
    const interval = setInterval(async () => {
      const freshData = await fetch(\`/api/tournaments/\${tournament.id}\`);
      if (freshData.updatedAt > lastUpdated) {
        router.replace(router.asPath); // Force refresh
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [tournament.id, lastUpdated]);
  
  return (
    <div>
      <div className="text-sm text-gray-400 mb-4">
        Last updated: {new Date(lastUpdated).toLocaleTimeString()}
      </div>
      {/* Tournament content */}
    </div>
  );
}`
      }
    ]
  };

  const toggleOptimization = (id) => {
    const newSet = new Set(implementedOptimizations);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setImplementedOptimizations(newSet);
  };

  const getImpactColor = (impact) => {
    switch(impact) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getEffortColor = (effort) => {
    switch(effort) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Next.js Performance Optimizer</h2>
        <p className="text-gray-400">Technical optimizations to increase engagement time and reduce bounce rates</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        <button
          onClick={() => setActiveTab('ui-ux')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'ui-ux'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          UI/UX Enhancements
        </button>
        <button
          onClick={() => setActiveTab('technical')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'technical'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Technical Optimizations
        </button>
      </div>

      {/* Optimizations List */}
      <div className="space-y-4">
        {optimizations[activeTab].map((optimization) => (
          <div 
            key={optimization.id}
            className="bg-gray-800 rounded-lg p-5 border border-gray-700 hover:border-purple-500/50 transition-colors"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{optimization.title}</h3>
                <p className="text-gray-400 text-sm">{optimization.description}</p>
              </div>
              <div className="flex space-x-2">
                <span className={`text-xs px-2 py-1 rounded ${getImpactColor(optimization.impact)}`}>
                  Impact: {optimization.impact}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${getEffortColor(optimization.effort)}`}>
                  Effort: {optimization.effort}
                </span>
                <button
                  onClick={() => toggleOptimization(optimization.id)}
                  className={`text-xs px-2 py-1 rounded ${
                    implementedOptimizations.has(optimization.id)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {implementedOptimizations.has(optimization.id) ? '✓ Implemented' : 'Mark Done'}
                </button>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-300">Implementation Code:</h4>
                <button className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded">
                  Copy Code
                </button>
              </div>
              <pre className="bg-gray-900 rounded-lg p-4 text-xs overflow-x-auto text-gray-300">
                <code>{optimization.implementation.trim()}</code>
              </pre>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 pt-6 border-t border-gray-700">
        <div className="flex justify-between items-center">
          <div className="text-gray-400">
            {implementedOptimizations.size} of {optimizations.ui-ux.length + optimizations.technical.length} optimizations implemented
          </div>
          <div className="text-sm text-purple-400">
            Estimated impact: +{implementedOptimizations.size * 15}-25% engagement time
          </div>
        </div>
      </div>
    </div>
  );
}