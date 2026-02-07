'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function FriendsPage() {
    const [activeTab, setActiveTab] = useState('friends'); // 'friends', 'online', 'requests', 'search'
    const [friends, setFriends] = useState([]);
    const [onlineFriends, setOnlineFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFriends();
        if (activeTab === 'requests') fetchRequests();
    }, [activeTab]);

    const fetchFriends = async () => {
        try {
            const [friendsRes, onlineRes] = await Promise.all([
                axios.get('/api/social/friends', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }),
                axios.get('/api/social/friends/online', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
            ]);
            setFriends(friendsRes.data.data || []);
            setOnlineFriends(onlineRes.data.data || []);
        } catch (error) {
            console.error('Error fetching friends:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRequests = async () => {
        try {
            const response = await axios.get('/api/social/friends/requests?type=received', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setRequests(response.data.data || []);
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };

    const searchUsers = async () => {
        if (searchQuery.length < 2) return;
        try {
            const response = await axios.get(`/api/social/users/search?query=${searchQuery}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setSearchResults(response.data.data || []);
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    const sendFriendRequest = async (userId) => {
        try {
            await axios.post('/api/social/friends/request',
                { recipientId: userId },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            alert('Friend request sent!');
            searchUsers(); // Refresh results
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to send request');
        }
    };

    const respondToRequest = async (friendshipId, action) => {
        try {
            await axios.put(`/api/social/friends/request/${friendshipId}`,
                { action },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            fetchRequests();
            fetchFriends();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to respond');
        }
    };

    const removeFriend = async (friendshipId) => {
        if (!confirm('Are you sure you want to remove this friend?')) return;
        try {
            await axios.delete(`/api/social/friends/${friendshipId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchFriends();
        } catch (error) {
            alert('Failed to remove friend');
        }
    };

    const inviteToMatch = async (friendId, friendName) => {
        try {
            await axios.post('/api/social/invite/match',
                { friendId, message: `Hey! Join me for a match!` },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            alert(`Invitation sent to ${friendName}!`);
        } catch (error) {
            alert('Failed to send invitation');
        }
    };

    const FriendCard = ({ friend, showInvite = true }) => (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
            <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                        {friend.username?.charAt(0).toUpperCase() || '?'}
                    </div>
                    {friend.isOnline && (
                        <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900"></div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1">
                    <h3 className="text-white font-bold text-lg">{friend.username}</h3>
                    <p className="text-gray-400 text-sm">Game ID: {friend.gameId || 'N/A'}</p>
                    {friend.matchesTogether > 0 && (
                        <p className="text-purple-400 text-xs mt-1">🎮 {friend.matchesTogether} matches together</p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    {showInvite && (
                        <button
                            onClick={() => inviteToMatch(friend._id, friend.username)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
                        >
                            🎮 Invite
                        </button>
                    )}
                    <button
                        onClick={() => removeFriend(friend.friendshipId)}
                        className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg font-semibold transition-all"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );

    const RequestCard = ({ request }) => {
        const requester = request.requester;
        return (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
                        {requester.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-white font-bold text-lg">{requester.username}</h3>
                        <p className="text-gray-400 text-sm">Sent {new Date(request.requestedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => respondToRequest(request._id, 'accept')}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all"
                        >
                            ✓ Accept
                        </button>
                        <button
                            onClick={() => respondToRequest(request._id, 'decline')}
                            className="px-6 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg font-semibold transition-all"
                        >
                            ✗ Decline
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const SearchResultCard = ({ user }) => (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white text-2xl font-bold">
                    {user.username?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                    <h3 className="text-white font-bold text-lg">{user.username}</h3>
                    <p className="text-gray-400 text-sm">Game ID: {user.gameId || 'N/A'}</p>
                </div>
                <div>
                    {user.friendshipStatus === 'none' && (
                        <button
                            onClick={() => sendFriendRequest(user._id)}
                            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all"
                        >
                            + Add Friend
                        </button>
                    )}
                    {user.friendshipStatus === 'pending' && (
                        <span className="px-6 py-2 bg-yellow-600/20 text-yellow-400 rounded-lg font-semibold">
                            Request Sent
                        </span>
                    )}
                    {user.friendshipStatus === 'accepted' && (
                        <span className="px-6 py-2 bg-green-600/20 text-green-400 rounded-lg font-semibold">
                            ✓ Friends
                        </span>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
                        Friends
                    </h1>
                    <p className="text-gray-300 text-lg">Connect with players and team up for matches</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                    <button
                        onClick={() => setActiveTab('friends')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${activeTab === 'friends'
                                ? 'bg-purple-600 text-white'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                    >
                        👥 All Friends ({friends.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('online')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${activeTab === 'online'
                                ? 'bg-green-600 text-white'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                    >
                        🟢 Online ({onlineFriends.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${activeTab === 'requests'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                    >
                        📬 Requests ({requests.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('search')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${activeTab === 'search'
                                ? 'bg-orange-600 text-white'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                    >
                        🔍 Find Friends
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'friends' && (
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center text-gray-400 py-12">Loading friends...</div>
                        ) : friends.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">😢</div>
                                <p className="text-gray-400 text-lg">No friends yet. Search for players to connect!</p>
                            </div>
                        ) : (
                            friends.map((friend) => <FriendCard key={friend._id} friend={friend} />)
                        )}
                    </div>
                )}

                {activeTab === 'online' && (
                    <div className="space-y-4">
                        {onlineFriends.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">💤</div>
                                <p className="text-gray-400 text-lg">No friends online right now</p>
                            </div>
                        ) : (
                            onlineFriends.map((friend) => <FriendCard key={friend._id} friend={friend} />)
                        )}
                    </div>
                )}

                {activeTab === 'requests' && (
                    <div className="space-y-4">
                        {requests.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📭</div>
                                <p className="text-gray-400 text-lg">No pending friend requests</p>
                            </div>
                        ) : (
                            requests.map((request) => <RequestCard key={request._id} request={request} />)
                        )}
                    </div>
                )}

                {activeTab === 'search' && (
                    <div>
                        {/* Search Input */}
                        <div className="mb-8">
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
                                    placeholder="Search by username or Game ID..."
                                    className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <button
                                    onClick={searchUsers}
                                    className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all"
                                >
                                    🔍 Search
                                </button>
                            </div>
                        </div>

                        {/* Search Results */}
                        <div className="space-y-4">
                            {searchResults.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">🔍</div>
                                    <p className="text-gray-400 text-lg">
                                        {searchQuery.length < 2
                                            ? 'Enter at least 2 characters to search'
                                            : 'No users found'}
                                    </p>
                                </div>
                            ) : (
                                searchResults.map((user) => <SearchResultCard key={user._id} user={user} />)
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
