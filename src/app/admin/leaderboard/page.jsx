'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminLeaderboardPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('users');
    const [loading, setLoading] = useState(false);

    // User Stats Editor
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [userStats, setUserStats] = useState({
        totalEarnings: 0,
        totalKills: 0,
        matchesPlayed: 0,
        matchesWon: 0,
        xp: 0
    });

    // Archives
    const [archives, setArchives] = useState([]);
    const [selectedArchive, setSelectedArchive] = useState(null);

    // Messages
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            router.push('/admin');
        }
    }, [user, router]);

    // Search users
    const handleUserSearch = async () => {
        if (!searchQuery.trim()) return;
        setLoading(true);
        try {
            const data = await api.searchUsers(searchQuery);
            setSearchResults(data.users || []);
        } catch (error) {
            showMessage('error', 'Failed to search users');
        } finally {
            setLoading(false);
        }
    };

    // Select user to edit
    const selectUser = (user) => {
        setSelectedUser(user);
        setUserStats({
            totalEarnings: user.totalEarnings || 0,
            totalKills: user.totalKills || 0,
            matchesPlayed: user.matchesPlayed || 0,
            matchesWon: user.matchesWon || 0,
            xp: user.xp || 0
        });
        setSearchResults([]);
        setSearchQuery('');
    };

    // Update user stats
    const handleUpdateStats = async (e) => {
        e.preventDefault();
        if (!selectedUser) return;

        setLoading(true);
        try {
            await api.updateLeaderboardUserStats(selectedUser._id, userStats);
            showMessage('success', 'User stats updated successfully!');
            setSelectedUser(null);
        } catch (error) {
            showMessage('error', error.response?.data?.message || 'Failed to update stats');
        } finally {
            setLoading(false);
        }
    };

    // Add user to leaderboard
    const handleAddUser = async () => {
        if (!selectedUser) return;

        setLoading(true);
        try {
            await api.addUserToLeaderboard(selectedUser._id, userStats);
            showMessage('success', 'User added to leaderboard!');
            setSelectedUser(null);
        } catch (error) {
            showMessage('error', error.response?.data?.message || 'Failed to add user');
        } finally {
            setLoading(false);
        }
    };

    // Remove user from leaderboard
    const handleRemoveUser = async () => {
        if (!selectedUser) return;
        if (!confirm('Are you sure you want to remove this user from the leaderboard?')) return;

        setLoading(true);
        try {
            await api.removeUserFromLeaderboard(selectedUser._id);
            showMessage('success', 'User removed from leaderboard!');
            setSelectedUser(null);
        } catch (error) {
            showMessage('error', error.response?.data?.message || 'Failed to remove user');
        } finally {
            setLoading(false);
        }
    };

    // Reset weekly leaderboard
    const handleResetWeekly = async () => {
        if (!confirm('This will archive and reset the weekly leaderboard. Continue?')) return;

        setLoading(true);
        try {
            const data = await api.resetWeeklyLeaderboard();
            showMessage('success', data.message);
        } catch (error) {
            showMessage('error', error.response?.data?.message || 'Failed to reset weekly leaderboard');
        } finally {
            setLoading(false);
        }
    };

    // Reset monthly leaderboard
    const handleResetMonthly = async () => {
        if (!confirm('This will archive and reset the monthly leaderboard. Continue?')) return;

        setLoading(true);
        try {
            const data = await api.resetMonthlyLeaderboard();
            showMessage('success', data.message);
        } catch (error) {
            showMessage('error', error.response?.data?.message || 'Failed to reset monthly leaderboard');
        } finally {
            setLoading(false);
        }
    };

    // Archive leaderboard
    const handleArchive = async (type) => {
        const notes = prompt(`Add notes for this ${type} leaderboard archive (optional):`);

        setLoading(true);
        try {
            const data = await api.archiveLeaderboard(type, notes);
            showMessage('success', data.message);
        } catch (error) {
            showMessage('error', error.response?.data?.message || 'Failed to archive leaderboard');
        } finally {
            setLoading(false);
        }
    };

    // Clear all leaderboard data
    const handleClearAll = async () => {
        const confirmation = prompt('⚠️ WARNING: This will reset ALL user stats to zero!\n\nType "CLEAR_ALL_LEADERBOARD_DATA" to confirm:');

        if (confirmation !== 'CLEAR_ALL_LEADERBOARD_DATA') {
            showMessage('error', 'Operation cancelled - confirmation text did not match');
            return;
        }

        setLoading(true);
        try {
            const data = await api.clearAllLeaderboards(confirmation);
            showMessage('success', data.message);
        } catch (error) {
            showMessage('error', error.response?.data?.message || 'Failed to clear leaderboard data');
        } finally {
            setLoading(false);
        }
    };

    // Load archives
    const loadArchives = async () => {
        setLoading(true);
        try {
            const data = await api.getArchivedLeaderboards({ page: 1, limit: 50 });
            setArchives(data.archives || []);
        } catch (error) {
            showMessage('error', 'Failed to load archives');
        } finally {
            setLoading(false);
        }
    };

    // View archive details
    const viewArchive = async (archiveId) => {
        setLoading(true);
        try {
            const data = await api.getArchivedLeaderboard(archiveId);
            setSelectedArchive(data.archive);
        } catch (error) {
            showMessage('error', 'Failed to load archive details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'archives') {
            loadArchives();
        }
    }, [activeTab]);

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    };

    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                            Leaderboard Management
                        </span>
                    </h1>
                    <p className="text-gray-400">Manage user stats, rankings, and leaderboard archives</p>
                </div>

                {/* Message Alert */}
                {message.text && (
                    <div className={`mb-6 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-500/20 border border-green-500/50 text-green-400' :
                            'bg-red-500/20 border border-red-500/50 text-red-400'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 mb-8">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'users'
                                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                                : 'bg-gray-800/50 text-gray-400 hover:text-white'
                            }`}
                    >
                        👤 User Stats Editor
                    </button>
                    <button
                        onClick={() => setActiveTab('reset')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'reset'
                                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                                : 'bg-gray-800/50 text-gray-400 hover:text-white'
                            }`}
                    >
                        🔄 Reset & Archive
                    </button>
                    <button
                        onClick={() => setActiveTab('archives')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'archives'
                                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                                : 'bg-gray-800/50 text-gray-400 hover:text-white'
                            }`}
                    >
                        📦 Archives
                    </button>
                </div>

                {/* User Stats Editor Tab */}
                {activeTab === 'users' && (
                    <div className="space-y-6">
                        {/* Search User */}
                        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                            <h2 className="text-2xl font-bold mb-4">Search User</h2>
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleUserSearch()}
                                    placeholder="Search by name, email, or user ID..."
                                    className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                                />
                                <button
                                    onClick={handleUserSearch}
                                    disabled={loading}
                                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50"
                                >
                                    Search
                                </button>
                            </div>

                            {/* Search Results */}
                            {searchResults.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {searchResults.map((user) => (
                                        <div
                                            key={user._id}
                                            onClick={() => selectUser(user)}
                                            className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-cyan-500 cursor-pointer transition-all"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-semibold">{user.name}</p>
                                                    <p className="text-sm text-gray-400">{user.email}</p>
                                                </div>
                                                <div className="text-right text-sm">
                                                    <p className="text-cyan-400">₹{user.totalEarnings || 0}</p>
                                                    <p className="text-gray-400">{user.matchesPlayed || 0} matches</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Edit User Stats */}
                        {selectedUser && (
                            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold">Edit User Stats</h2>
                                        <p className="text-gray-400">{selectedUser.name} ({selectedUser.email})</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedUser(null)}
                                        className="text-gray-400 hover:text-white"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <form onSubmit={handleUpdateStats} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Total Earnings (₹)
                                            </label>
                                            <input
                                                type="number"
                                                value={userStats.totalEarnings}
                                                onChange={(e) => setUserStats({ ...userStats, totalEarnings: Number(e.target.value) })}
                                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Total Kills
                                            </label>
                                            <input
                                                type="number"
                                                value={userStats.totalKills}
                                                onChange={(e) => setUserStats({ ...userStats, totalKills: Number(e.target.value) })}
                                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Matches Played
                                            </label>
                                            <input
                                                type="number"
                                                value={userStats.matchesPlayed}
                                                onChange={(e) => setUserStats({ ...userStats, matchesPlayed: Number(e.target.value) })}
                                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Matches Won
                                            </label>
                                            <input
                                                type="number"
                                                value={userStats.matchesWon}
                                                onChange={(e) => setUserStats({ ...userStats, matchesWon: Number(e.target.value) })}
                                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                XP
                                            </label>
                                            <input
                                                type="number"
                                                value={userStats.xp}
                                                onChange={(e) => setUserStats({ ...userStats, xp: Number(e.target.value) })}
                                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50"
                                        >
                                            Update Stats
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleAddUser}
                                            disabled={loading}
                                            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
                                        >
                                            Add to Leaderboard
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleRemoveUser}
                                            disabled={loading}
                                            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
                                        >
                                            Remove from Leaderboard
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                )}

                {/* Reset & Archive Tab */}
                {activeTab === 'reset' && (
                    <div className="space-y-6">
                        {/* Reset Controls */}
                        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                            <h2 className="text-2xl font-bold mb-4">Reset Leaderboards</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={handleResetWeekly}
                                    disabled={loading}
                                    className="p-6 bg-orange-900/30 border border-orange-500/50 rounded-xl hover:bg-orange-900/50 transition-all disabled:opacity-50"
                                >
                                    <div className="text-3xl mb-2">📅</div>
                                    <h3 className="font-bold text-lg mb-1">Reset Weekly Leaderboard</h3>
                                    <p className="text-sm text-gray-400">Archives current week data and resets for new week</p>
                                </button>
                                <button
                                    onClick={handleResetMonthly}
                                    disabled={loading}
                                    className="p-6 bg-orange-900/30 border border-orange-500/50 rounded-xl hover:bg-orange-900/50 transition-all disabled:opacity-50"
                                >
                                    <div className="text-3xl mb-2">📆</div>
                                    <h3 className="font-bold text-lg mb-1">Reset Monthly Leaderboard</h3>
                                    <p className="text-sm text-gray-400">Archives current month data and resets for new month</p>
                                </button>
                            </div>
                        </div>

                        {/* Archive Controls */}
                        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                            <h2 className="text-2xl font-bold mb-4">Create Archives</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {['global', 'weekly', 'monthly', 'kills'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => handleArchive(type)}
                                        disabled={loading}
                                        className="p-4 bg-cyan-900/30 border border-cyan-500/50 rounded-xl hover:bg-cyan-900/50 transition-all disabled:opacity-50"
                                    >
                                        <div className="text-2xl mb-2">📦</div>
                                        <h3 className="font-bold capitalize">{type}</h3>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="bg-red-900/20 rounded-xl p-6 border border-red-500/50">
                            <h2 className="text-2xl font-bold mb-2 text-red-400">⚠️ Danger Zone</h2>
                            <p className="text-gray-400 mb-4">These actions are irreversible!</p>
                            <button
                                onClick={handleClearAll}
                                disabled={loading}
                                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
                            >
                                Clear All Leaderboard Data
                            </button>
                        </div>
                    </div>
                )}

                {/* Archives Tab */}
                {activeTab === 'archives' && (
                    <div className="space-y-6">
                        {selectedArchive ? (
                            // Archive Details
                            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold">
                                            {selectedArchive.type.toUpperCase()} - {selectedArchive.period}
                                        </h2>
                                        <p className="text-gray-400">
                                            Archived on {new Date(selectedArchive.archivedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedArchive(null)}
                                        className="text-gray-400 hover:text-white"
                                    >
                                        ✕ Close
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {selectedArchive.data.map((entry) => (
                                        <div key={entry.rank} className="p-4 bg-gray-900/50 rounded-lg flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <span className="text-2xl font-bold text-gray-500">#{entry.rank}</span>
                                                <div>
                                                    <p className="font-semibold">{entry.userName}</p>
                                                    <p className="text-sm text-gray-400">
                                                        {entry.matchesPlayed} matches • {entry.winRate}% win rate
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-cyan-400">₹{entry.totalEarnings}</p>
                                                <p className="text-sm text-gray-400">{entry.totalKills} kills</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            // Archives List
                            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                                <h2 className="text-2xl font-bold mb-4">Leaderboard Archives</h2>
                                <div className="space-y-2">
                                    {archives.length === 0 ? (
                                        <p className="text-gray-400 text-center py-8">No archives found</p>
                                    ) : (
                                        archives.map((archive) => (
                                            <div
                                                key={archive._id}
                                                onClick={() => viewArchive(archive._id)}
                                                className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-cyan-500 cursor-pointer transition-all"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-semibold">
                                                            {archive.type.toUpperCase()} - {archive.period}
                                                        </p>
                                                        <p className="text-sm text-gray-400">
                                                            {archive.metadata.totalUsers} users • Archived {new Date(archive.archivedAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-cyan-400">Top: ₹{archive.metadata.topEarning}</p>
                                                        <p className="text-sm text-gray-400">{archive.metadata.topKills} kills</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
