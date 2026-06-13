'use client';

import { useState, useEffect } from 'react';

// Bracket visualization for tournament formats
export default function TournamentBracket({ tournament }) {
    const [rounds, setRounds] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);

    useEffect(() => {
        if (tournament) {
            generateBracket();
        }
    }, [tournament]);

    const generateBracket = () => {
        // For single elimination bracket
        if (tournament.format === 'single_elimination' && tournament.rounds) {
            setRounds(tournament.rounds);
        } else if (tournament.participants) {
            // Generate virtual bracket from participants if no rounds defined
            const numTeams = tournament.participants.length;
            const numRounds = Math.ceil(Math.log2(numTeams));

            const generatedRounds = [];
            let matchesInRound = Math.ceil(numTeams / 2);

            for (let r = 0; r < numRounds; r++) {
                const roundMatches = [];
                for (let m = 0; m < matchesInRound; m++) {
                    if (r === 0) {
                        // First round - pair participants
                        const team1Index = m * 2;
                        const team2Index = m * 2 + 1;
                        roundMatches.push({
                            id: `${r}-${m}`,
                            team1: tournament.participants[team1Index] || null,
                            team2: tournament.participants[team2Index] || null,
                            winner: null,
                            status: 'upcoming'
                        });
                    } else {
                        roundMatches.push({
                            id: `${r}-${m}`,
                            team1: null,
                            team2: null,
                            winner: null,
                            status: 'upcoming'
                        });
                    }
                }
                generatedRounds.push({
                    roundNumber: r + 1,
                    title: getRoundName(r, numRounds),
                    matches: roundMatches
                });
                matchesInRound = Math.ceil(matchesInRound / 2);
            }

            setRounds(generatedRounds);
        }
    };

    const getRoundName = (roundIndex, totalRounds) => {
        const remaining = totalRounds - roundIndex;
        if (remaining === 1) return 'Final';
        if (remaining === 2) return 'Semi Final';
        if (remaining === 3) return 'Quarter Final';
        if (remaining === 4) return 'Round of 16';
        return `Round ${roundIndex + 1}`;
    };

    if (!tournament) {
        return (
            <div className="text-center py-8 text-gray-400">
                No tournament data available
            </div>
        );
    }

    // For Battle Royale format, show leaderboard instead
    if (tournament.format === 'battle_royale') {
        return (
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-4">Battle Royale Format</h3>
                <p className="text-gray-400 mb-6">
                    This tournament uses Battle Royale format. Rankings are determined by points from each match.
                </p>

                {/* Show leaderboard if available */}
                {tournament.leaderboard && tournament.leaderboard.length > 0 ? (
                    <div className="space-y-2">
                        {tournament.leaderboard.slice(0, 10).map((entry, index) => (
                            <div
                                key={index}
                                className={`flex items-center justify-between p-3 rounded-lg ${index < 3 ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' : 'bg-gray-800/50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${index === 0 ? 'bg-yellow-500 text-black' :
                                            index === 1 ? 'bg-gray-300 text-black' :
                                                index === 2 ? 'bg-orange-500 text-black' :
                                                    'bg-gray-700 text-white'
                                        }`}>
                                        {index + 1}
                                    </span>
                                    <span className="font-medium text-white">{entry.teamName || 'Team'}</span>
                                </div>
                                <div className="flex gap-6 text-sm">
                                    <span className="text-gray-400">{entry.totalKills || 0} kills</span>
                                    <span className="text-cyan-400 font-bold">{entry.totalPoints || 0} pts</span>
                                    {entry.prize > 0 && (
                                        <span className="text-green-400 font-bold">₹{entry.prize}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">Tournament has not started yet</p>
                )}
            </div>
        );
    }

    // Elimination bracket view - Professional Live Bracket
    return (
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 overflow-x-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white">Live Tournament Brackets</h3>
                    <p className="text-xs text-gray-400">Quarter Final → Semi Final → Final → Winner</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 rounded bg-gray-800 text-gray-400">Single Elimination</span>
                </div>
            </div>

            <div className="flex gap-6 md:gap-10 min-w-max pb-4">
                {rounds.map((round, roundIndex) => (
                    <div key={roundIndex} className="flex flex-col min-w-[170px]">
                        {/* Stage Header - explicit as requested */}
                        <div className="text-center mb-3">
                            <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30">
                                <span className="text-sm font-bold text-cyan-400 tracking-widest uppercase">
                                    {round.title || getRoundName(roundIndex, rounds.length)}
                                </span>
                            </div>
                        </div>

                        {/* Matches in round */}
                        <div className="flex flex-col justify-around flex-1" style={{ gap: `${Math.max(1.25, Math.pow(2, roundIndex) * 0.9)}rem` }}>
                            {(round.matches || []).map((match, matchIndex) => {
                                const isLive = match.status === 'live';
                                const isDone = match.status === 'completed' || match.winner;

                                return (
                                    <div
                                        key={match.id || matchIndex}
                                        onClick={() => setSelectedMatch(match)}
                                        className={`group w-full bg-gray-800/70 hover:bg-gray-800 border rounded-xl overflow-hidden transition cursor-pointer ${isLive ? 'border-red-500 shadow shadow-red-500/30' : isDone ? 'border-green-500/60' : 'border-gray-700 hover:border-gray-500'}`}
                                    >
                                        {/* Match header */}
                                        <div className="px-3 py-1 text-[10px] flex items-center justify-between bg-gray-900/60">
                                            <span className="text-gray-500">Match {matchIndex + 1}</span>
                                            {isLive && <span className="text-red-400 text-[10px] font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> LIVE</span>}
                                            {isDone && <span className="text-green-400 text-[10px]">✓ DONE</span>}
                                        </div>

                                        {/* Team 1 */}
                                        <div className={`px-3 py-2.5 flex items-center justify-between border-b border-gray-700/70 ${isDone && match.winner && match.team1 && match.winner.toString?.() === match.team1?.id?.toString?.() ? 'bg-green-500/10' : ''}`}>
                                            <div className="flex items-center gap-2 min-w-0">
                                                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                                                    {match.team1 ? (match.team1.tag || (match.team1.teamName || match.team1.user?.name || 'T')[0]) : '?'}
                                                </div>
                                                <span className="text-sm text-white truncate font-medium">
                                                    {match.team1 ? (match.team1.teamName || match.team1.user?.name || 'Team 1') : 'TBD'}
                                                </span>
                                            </div>
                                            {match.team1?.score != null && <span className="font-mono text-sm font-bold text-white">{match.team1.score}</span>}
                                        </div>

                                        {/* Team 2 */}
                                        <div className={`px-3 py-2.5 flex items-center justify-between ${isDone && match.winner && match.team2 && match.winner.toString?.() === match.team2?.id?.toString?.() ? 'bg-green-500/10' : ''}`}>
                                            <div className="flex items-center gap-2 min-w-0">
                                                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                                                    {match.team2 ? (match.team2.tag || (match.team2.teamName || match.team2.user?.name || 'T')[0]) : '?'}
                                                </div>
                                                <span className="text-sm text-white truncate font-medium">
                                                    {match.team2 ? (match.team2.teamName || match.team2.user?.name || 'Team 2') : 'TBD'}
                                                </span>
                                            </div>
                                            {match.team2?.score != null && <span className="font-mono text-sm font-bold text-white">{match.team2.score}</span>}
                                        </div>

                                        {/* Winner line */}
                                        {isDone && match.winner && (
                                            <div className="px-3 py-1 text-[10px] bg-green-500/10 text-green-400 font-semibold flex items-center gap-1">
                                                <span>🏆</span> {match.winnerName || 'Winner advanced'}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Final Winner Column - prominent */}
                {(tournament.status === 'completed' || rounds.length > 0) && (
                    <div className="flex flex-col justify-center items-center pl-4 border-l border-gray-700 min-w-[140px]">
                        <div className="text-center">
                            <div className="text-4xl mb-1">🏆</div>
                            <div className="uppercase tracking-[2px] text-xs text-yellow-400 font-bold mb-2">Winner</div>

                            {tournament.winner || (tournament.leaderboard && tournament.leaderboard[0]) ? (
                                <div>
                                    <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 flex items-center justify-center text-3xl font-black text-black shadow-inner mb-2">
                                        {(tournament.winner?.tag || tournament.leaderboard?.[0]?.teamName || 'CHAMP')[0]}
                                    </div>
                                    <div className="font-bold text-white text-sm">
                                        {tournament.winner?.name || tournament.leaderboard?.[0]?.teamName || 'Champion'}
                                    </div>
                                    {tournament.leaderboard?.[0]?.prize > 0 && (
                                        <div className="text-green-400 font-bold mt-1">₹{tournament.leaderboard[0].prize}</div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-gray-500 text-xs py-6">Bracket in progress</div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Legend + Live note */}
            <div className="mt-5 pt-4 border-t border-gray-800 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
                <div className="flex items-center gap-2 text-gray-400">
                    <span className="inline-block w-2.5 h-2.5 bg-gray-600 rounded" /> Upcoming
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                    <span className="inline-block w-2.5 h-2.5 bg-red-500 rounded animate-pulse" /> Live
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                    <span className="inline-block w-2.5 h-2.5 bg-green-500/70 rounded" /> Completed
                </div>
                <div className="ml-auto text-[10px] text-gray-500">Real-time updates via socket • Click a match for details</div>
            </div>
        </div>
    );
}
