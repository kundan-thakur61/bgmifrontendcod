'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './rooms.css';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function RoomBrowser() {
    const router = useRouter();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        mode: '',
        gameType: '',
        map: '',
        status: 'waiting,filling'
    });
    const [searchCode, setSearchCode] = useState('');

    // Fetch rooms
    const fetchRooms = async () => {
        try {
            const queryParams = new URLSearchParams();

            if (filters.mode) queryParams.append('mode', filters.mode);
            if (filters.gameType) queryParams.append('gameType', filters.gameType);
            if (filters.map) queryParams.append('map', filters.map);
            if (filters.status) queryParams.append('status', filters.status);
            if (searchCode) queryParams.append('search', searchCode);

            const response = await fetch(`${BACKEND_URL}/api/rooms?${queryParams}`);

            if (!response.ok) {
                throw new Error('Failed to fetch rooms');
            }

            const data = await response.json();
            setRooms(data.rooms);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();

        // Auto-refresh every 5 seconds
        const interval = setInterval(fetchRooms, 5000);
        return () => clearInterval(interval);
    }, [filters, searchCode]);

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleJoinRoom = (roomId) => {
        router.push(`/rooms/${roomId}`);
    };

    const handleCreateRoom = () => {
        router.push('/rooms/create');
    };

    const getStatusBadge = (status) => {
        const badges = {
            waiting: { label: 'Waiting', color: '#888' },
            filling: { label: 'Filling', color: '#4CAF50' },
            ready: { label: 'Ready', color: '#2196F3' },
            starting: { label: 'Starting', color: '#FF9800' },
            started: { label: 'Started', color: '#F44336' },
            closed: { label: 'Closed', color: '#666' }
        };

        const badge = badges[status] || badges.waiting;

        return (
            <span
                className="status-badge"
                style={{ backgroundColor: badge.color }}
            >
                {badge.label}
            </span>
        );
    };

    return (
        <div className="room-browser">
            <div className="browser-header">
                <div>
                    <h1>Game Rooms</h1>
                    <p className="subtitle">Join an existing room or create your own</p>
                </div>
                <button className="create-btn" onClick={handleCreateRoom}>
                    + Create Room
                </button>
            </div>

            {/* Filters */}
            <div className="filters-container">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search by room code..."
                        value={searchCode}
                        onChange={(e) => setSearchCode(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filters">
                    <select
                        value={filters.gameType}
                        onChange={(e) => handleFilterChange('gameType', e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Games</option>
                        <option value="pubg_mobile">PUBG Mobile</option>
                        <option value="free_fire">Free Fire</option>
                    </select>

                    <select
                        value={filters.mode}
                        onChange={(e) => handleFilterChange('mode', e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Modes</option>
                        <option value="solo">Solo</option>
                        <option value="duo">Duo</option>
                        <option value="squad">Squad</option>
                    </select>

                    <select
                        value={filters.map}
                        onChange={(e) => handleFilterChange('map', e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Maps</option>
                        <option value="erangel">Erangel</option>
                        <option value="miramar">Miramar</option>
                        <option value="sanhok">Sanhok</option>
                        <option value="vikendi">Vikendi</option>
                        <option value="livik">Livik</option>
                    </select>
                </div>
            </div>

            {/* Room List */}
            {loading ? (
                <div className="loading">Loading rooms...</div>
            ) : error ? (
                <div className="error">Error: {error}</div>
            ) : rooms.length === 0 ? (
                <div className="no-rooms">
                    <p>No rooms found</p>
                    <button className="create-btn-alt" onClick={handleCreateRoom}>
                        Create First Room
                    </button>
                </div>
            ) : (
                <div className="rooms-grid">
                    {rooms.map((room) => (
                        <div key={room._id} className="room-card">
                            <div className="room-card-header">
                                <div className="room-code">{room.roomCode}</div>
                                {getStatusBadge(room.status)}
                            </div>

                            <h3 className="room-title">{room.title}</h3>

                            <div className="room-info">
                                <div className="info-item">
                                    <span className="label">Host:</span>
                                    <span className="value">{room.host?.username || 'Unknown'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Mode:</span>
                                    <span className="value">{room.mode}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Map:</span>
                                    <span className="value">{room.map}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Players:</span>
                                    <span className="value players-count">
                                        {room.filledSlots}/{room.maxSlots}
                                    </span>
                                </div>
                            </div>

                            {room.isPasswordProtected && (
                                <div className="password-indicator">🔒 Password Protected</div>
                            )}

                            <button
                                className="join-btn"
                                onClick={() => handleJoinRoom(room._id)}
                                disabled={room.status !== 'waiting' && room.status !== 'filling'}
                            >
                                {room.status === 'waiting' || room.status === 'filling'
                                    ? 'Join Room'
                                    : 'View Room'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
