'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import './room.css';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function RoomLobby() {
    const params = useParams();
    const router = useRouter();
    const roomId = params.id;

    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [socket, setSocket] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [countdown, setCountdown] = useState('');
    const [chatMessage, setChatMessage] = useState('');

    // Calculate countdown timer
    useEffect(() => {
        if (!room) return;

        const interval = setInterval(() => {
            const now = new Date();
            const created = new Date(room.createdAt);
            const autoCloseTime = new Date(created.getTime() + (room.autoCloseTimer || 7200) * 1000);
            const diff = autoCloseTime - now;

            if (diff <= 0) {
                setCountdown('00:00:00');
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                setCountdown(
                    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
                );
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [room]);

    // Fetch room data
    const fetchRoom = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BACKEND_URL}/api/rooms/${roomId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch room');
            }

            const data = await response.json();
            setRoom(data.room);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }, [roomId]);

    // Get current user
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Decode JWT to get user info (simple decode, not validation)
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setCurrentUser({ id: payload.id });
            } catch (err) {
                console.error('Failed to decode token:', err);
            }
        }
    }, []);

    // Initialize room and socket
    useEffect(() => {
        fetchRoom();

        // Initialize socket
        const token = localStorage.getItem('token');
        const newSocket = io(BACKEND_URL, {
            auth: { token }
        });

        newSocket.on('connect', () => {
            console.log('Socket connected');
            newSocket.emit('join_room', roomId);
        });

        newSocket.on('participant_joined', (data) => {
            if (data.roomId === roomId) {
                fetchRoom(); // Refresh room data
            }
        });

        newSocket.on('participant_left', (data) => {
            if (data.roomId === roomId) {
                fetchRoom();
            }
        });

        newSocket.on('participant_kicked', (data) => {
            if (data.roomId === roomId) {
                if (data.userId === currentUser?.id) {
                    alert('You have been removed from the room by the host');
                    router.push('/rooms');
                } else {
                    fetchRoom();
                }
            }
        });

        newSocket.on('room_settings_update', (data) => {
            if (data.roomId === roomId) {
                fetchRoom();
            }
        });

        newSocket.on('room_started', (data) => {
            if (data.roomId === roomId) {
                alert(data.message);
                router.push(`/matches/${data.matchId}`);
            }
        });

        newSocket.on('room_closed', (data) => {
            if (data.roomId === roomId) {
                alert(data.message);
                router.push('/rooms');
            }
        });

        newSocket.on('kicked_from_room', (data) => {
            if (data.roomId === roomId) {
                alert(data.message);
                router.push('/rooms');
            }
        });

        setSocket(newSocket);

        return () => {
            newSocket.emit('leave_room', roomId);
            newSocket.disconnect();
        };
    }, [roomId, fetchRoom, router, currentUser?.id]);

    // Handle mode change
    const handleModeChange = async (newMode) => {
        if (!isHost()) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BACKEND_URL}/api/rooms/${roomId}/settings`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ mode: newMode })
            });

            if (!response.ok) {
                throw new Error('Failed to update mode');
            }

            fetchRoom();
        } catch (err) {
            alert(err.message);
        }
    };

    // Handle map change
    const handleMapChange = async (e) => {
        if (!isHost()) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BACKEND_URL}/api/rooms/${roomId}/settings`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ map: e.target.value })
            });

            if (!response.ok) {
                throw new Error('Failed to update map');
            }

            fetchRoom();
        } catch (err) {
            alert(err.message);
        }
    };

    // Start preparation (create match)
    const handleStartPreparation = async () => {
        if (!isHost()) return;

        const roomIdInput = prompt('Enter Room ID for the game:');
        const roomPassword = prompt('Enter Room Password:');

        if (!roomIdInput) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BACKEND_URL}/api/rooms/${roomId}/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    roomId: roomIdInput,
                    roomPassword,
                    entryFee: 0,
                    prizePool: 0
                })
            });

            if (!response.ok) {
                throw new Error('Failed to start room');
            }

            const data = await response.json();
            router.push(`/matches/${data.match._id}`);
        } catch (err) {
            alert(err.message);
        }
    };

    // Leave room
    const handleLeaveRoom = async () => {
        if (isHost()) {
            if (!confirm('As the host, leaving will close the room. Continue?')) return;

            try {
                const token = localStorage.getItem('token');
                await fetch(`${BACKEND_URL}/api/rooms/${roomId}/close`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                router.push('/rooms');
            } catch (err) {
                alert(err.message);
            }
        } else {
            try {
                const token = localStorage.getItem('token');
                await fetch(`${BACKEND_URL}/api/rooms/${roomId}/leave`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                router.push('/rooms');
            } catch (err) {
                alert(err.message);
            }
        }
    };

    // Check if current user is host
    const isHost = () => {
        if (!room || !currentUser) return false;
        return room.host._id === currentUser.id;
    };

    // Get participant for slot
    const getParticipantForSlot = (slotNum) => {
        if (!room) return null;
        return room.participants.find(p => p.slotNumber === slotNum);
    };

    // Render player grid based on mode
    const renderPlayerGrid = () => {
        if (!room) return null;

        const { mode, maxSlots } = room;

        if (mode === 'squad') {
            // 6 teams, 4 players each
            const teams = 6;
            const playersPerTeam = 4;

            return (
                <div className="player-grid squad-grid">
                    {[...Array(teams)].map((_, teamIdx) => (
                        <div key={teamIdx} className="team-section">
                            <div className="team-label">Team {teamIdx + 1}</div>
                            <div className="team-slots">
                                {[...Array(playersPerTeam)].map((_, slotIdx) => {
                                    const slotNumber = teamIdx * playersPerTeam + slotIdx + 1;
                                    const participant = getParticipantForSlot(slotNumber);

                                    return (
                                        <div
                                            key={slotNumber}
                                            className={`player-slot ${participant ? 'filled' : 'empty'} ${participant?.user._id === currentUser?.id ? 'current-user' : ''
                                                } ${participant?.user._id === room.host._id ? 'host' : ''}`}
                                        >
                                            {participant ? (
                                                <>
                                                    {participant.user._id === room.host._id && (
                                                        <div className="host-indicator">🏠</div>
                                                    )}
                                                    <div className="player-avatar">
                                                        {participant.user.avatar ? (
                                                            <img src={participant.user.avatar} alt={participant.user.username} width="32" height="32" />
                                                        ) : (
                                                            <div className="avatar-placeholder">
                                                                {participant.user.username.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="player-name">{participant.user.username}</div>
                                                </>
                                            ) : (
                                                <div className="empty-slot-icon">👤</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            );
        } else if (mode === 'duo') {
            // 12 teams, 2 players each
            const teams = 12;
            const playersPerTeam = 2;

            return (
                <div className="player-grid duo-grid">
                    {[...Array(teams)].map((_, teamIdx) => (
                        <div key={teamIdx} className="team-section">
                            <div className="team-label">Team {teamIdx + 1}</div>
                            <div className="team-slots">
                                {[...Array(playersPerTeam)].map((_, slotIdx) => {
                                    const slotNumber = teamIdx * playersPerTeam + slotIdx + 1;
                                    const participant = getParticipantForSlot(slotNumber);

                                    return (
                                        <div
                                            key={slotNumber}
                                            className={`player-slot ${participant ? 'filled' : 'empty'} ${participant?.user._id === currentUser?.id ? 'current-user' : ''
                                                } ${participant?.user._id === room.host._id ? 'host' : ''}`}
                                        >
                                            {participant ? (
                                                <>
                                                    {participant.user._id === room.host._id && (
                                                        <div className="host-indicator">🏠</div>
                                                    )}
                                                    <div className="player-avatar">
                                                        {participant.user.avatar ? (
                                                            <img src={participant.user.avatar} alt={participant.user.username} width="32" height="32" />
                                                        ) : (
                                                            <div className="avatar-placeholder">
                                                                {participant.user.username.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="player-name">{participant.user.username}</div>
                                                </>
                                            ) : (
                                                <div className="empty-slot-icon">👤</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            );
        } else {
            // Solo - individual slots (32 players in 4 rows)
            const totalSlots = maxSlots || 32;

            return (
                <div className="player-grid solo-grid">
                    {[...Array(totalSlots)].map((_, idx) => {
                        const slotNumber = idx + 1;
                        const participant = getParticipantForSlot(slotNumber);

                        return (
                            <div
                                key={slotNumber}
                                className={`player-slot ${participant ? 'filled' : 'empty'} ${participant?.user._id === currentUser?.id ? 'current-user' : ''
                                    } ${participant?.user._id === room.host._id ? 'host' : ''}`}
                            >
                                {participant ? (
                                    <>
                                        {participant.user._id === room.host._id && (
                                            <div className="host-indicator">🏠</div>
                                        )}
                                        <div className="player-avatar">
                                            {participant.user.avatar ? (
                                                <img src={participant.user.avatar} alt={participant.user.username} width="32" height="32" />
                                            ) : (
                                                <div className="avatar-placeholder">
                                                    {participant.user.username.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="player-name">{participant.user.username}</div>
                                    </>
                                ) : (
                                    <div className="empty-slot-icon">👤</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            );
        }
    };

    if (loading) {
        return (
            <div className="room-lobby">
                <div className="loading">Loading room...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="room-lobby">
                <div className="error">Error: {error}</div>
            </div>
        );
    }

    if (!room) {
        return (
            <div className="room-lobby">
                <div className="error">Room not found</div>
            </div>
        );
    }

    return (
        <div className="room-lobby">
            {/* Header */}
            <div className="room-header">
                <div className="room-info">
                    <div className="room-code">
                        <span className="label">Room ID:</span>
                        <span className="code">{room.roomCode}</span>
                    </div>
                    <div className="player-count">
                        <span className="label">Players</span>
                        <span className="count">{room.filledSlots}/{room.maxSlots}</span>
                    </div>
                </div>

                <div className="room-selectors">
                    <select
                        value={room.region}
                        disabled={!isHost()}
                        className="region-selector"
                        onChange={(e) => {
                            /* handle region change */
                        }}
                    >
                        <option value="asia">India</option>
                        <option value="europe">Europe</option>
                        <option value="north_america">North America</option>
                        <option value="global">Global</option>
                    </select>

                    <div className="mode-selector">
                        <button
                            className={`mode-btn ${room.mode === 'squad' ? 'active' : ''}`}
                            onClick={() => handleModeChange('squad')}
                            disabled={!isHost()}
                        >
                            Squad
                        </button>
                        <button
                            className={`mode-btn ${room.mode === 'duo' ? 'active' : ''}`}
                            onClick={() => handleModeChange('duo')}
                            disabled={!isHost()}
                        >
                            Duo
                        </button>
                        <button
                            className={`mode-btn ${room.mode === 'solo' ? 'active' : ''}`}
                            onClick={() => handleModeChange('solo')}
                            disabled={!isHost()}
                        >
                            Solo
                        </button>
                    </div>

                    <select
                        value={room.map}
                        onChange={handleMapChange}
                        disabled={!isHost()}
                        className="map-selector"
                    >
                        <option value="erangel">Erangel</option>
                        <option value="miramar">Miramar</option>
                        <option value="sanhok">Sanhok</option>
                        <option value="vikendi">Vikendi</option>
                        <option value="livik">Livik</option>
                    </select>
                </div>

                <button className="close-btn" onClick={handleLeaveRoom}>
                    ✕
                </button>
            </div>

            {/* Player Grid */}
            {renderPlayerGrid()}

            {/* Bottom Controls */}
            <div className="room-controls">
                <div className="chat-input-wrapper">
                    <input
                        type="text"
                        className="chat-input"
                        placeholder="Type a message..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                    />
                </div>

                <div className="timer">
                    Room held for another <span className="countdown">{countdown}</span>
                </div>

                <div className="action-buttons">
                    <button className="btn-secondary">Invite Friend</button>
                    <button className="btn-secondary">
                        Spectate ({room.spectatorCount || 0})
                    </button>
                    {isHost() && (
                        <button className="btn-primary" onClick={handleStartPreparation}>
                            Start Preparation
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
