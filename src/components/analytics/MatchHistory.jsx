'use client';

import { useState, useEffect } from 'react';

export default function MatchHistory({ matches = [], showAll = false }) {
    const [matchHistory, setMatchHistory] = useState(matches);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        if (matches.length > 0) {
            setMatchHistory(matches);
        } else {
            fetchMatchHistory();
        }
    }, []);

    const fetchMatchHistory = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/player-analytics/match-history?page=${page}&limit=${showAll ? 100 : 10}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            if (data.success) {
                setMatchHistory(prev => [...prev, ...data.data.matches]);
                setHasMore(page < data.data.pagination.pages);
            }
        } catch (error) {
            console.error('Error fetching match history:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        setPage(prev => prev + 1);
    };

    if (matchHistory.length === 0 && !loading) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-400">No match history available</p>
            </div>
        );
    }

    return (
        <div>
            <div className="space-y-3">
                {matchHistory.map((match, index) => (
                    <MatchCard key={index} match={match} />
                ))}
            </div>

            {hasMore && !showAll && (
                <div className="mt-6 text-center">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Loading...' : 'Load More'}
                    </button>
                </div>
            )}
        </div>
    );
}

function MatchCard({ match }) {
    const getPositionColor = (position) => {
        if (position === 1) return 'text-yellow-400';
        if (position === 2) return 'text-gray-300';
        if (position === 3) return 'text-amber-600';
        return 'text-gray-400';
    };

    const getPositionBadge = (position) => {
        if (position === 1) return '🥇';
        if (position === 2) return '🥈';
        if (position === 3) return '🥉';
        return `#${position}`;
    };

    return (
        <div className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold">{match.title}</h3>
                        <span className="text-xs px-2 py-1 bg-gray-600 rounded capitalize">
                            {match.gameType.replace('_', ' ')}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-600 rounded capitalize">
                            {match.mode}
                        </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>🗺️ {match.map || 'Unknown'}</span>
                        <span>📅 {new Date(match.date).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-red-400">{match.kills}</p>
                        <p className="text-xs text-gray-400">Kills</p>
                    </div>
                    <div className="text-center">
                        <p className={`text-2xl font-bold ${getPositionColor(match.position)}`}>
                            {getPositionBadge(match.position)}
                        </p>
                        <p className="text-xs text-gray-400">Position</p>
                    </div>
                    {match.prizeWon > 0 && (
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-400">₹{match.prizeWon}</p>
                            <p className="text-xs text-gray-400">Prize</p>
                        </div>
                    )}
                </div>
            </div>

            {match.screenshot && (
                <div className="mt-3 pt-3 border-t border-gray-600">
                    <a
                        href={match.screenshot}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-400 hover:text-purple-300"
                    >
                        View Screenshot →
                    </a>
                </div>
            )}
        </div>
    );
}
