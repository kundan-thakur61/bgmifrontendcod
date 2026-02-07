'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './create.css';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function CreateRoom() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        gameType: 'pubg_mobile',
        mode: 'squad',
        map: 'erangel',
        maxSlots: '',
        password: '',
        minLevelRequired: 'none',
        region: 'asia',
        allowSpectators: true,
        maxSpectators: 10
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                router.push('/login');
                return;
            }

            const payload = { ...formData };

            // Remove password if empty
            if (!payload.password) {
                delete payload.password;
            }

            // Convert maxSlots to number if provided
            if (payload.maxSlots) {
                payload.maxSlots = parseInt(payload.maxSlots);
            }

            const response = await fetch(`${BACKEND_URL}/api/rooms`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to create room');
            }

            const data = await response.json();

            // Redirect to room lobby
            router.push(`/rooms/${data.room._id}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-room-page">
            <div className="create-room-container">
                <h1>Create Room</h1>
                <p className="subtitle">Set up a new game lobby for your friends</p>

                {error && (
                    <div className="error-banner">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="create-room-form">
                    {/* Room Title */}
                    <div className="form-group">
                        <label htmlFor="title">Room Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Pro Players Only"
                            maxLength={100}
                        />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Optional room description"
                            maxLength={500}
                            rows={3}
                        />
                    </div>

                    {/* Game Type */}
                    <div className="form-group">
                        <label htmlFor="gameType">Game Type *</label>
                        <select
                            id="gameType"
                            name="gameType"
                            value={formData.gameType}
                            onChange={handleChange}
                            required
                        >
                            <option value="pubg_mobile">PUBG Mobile</option>
                            <option value="free_fire">Free Fire</option>
                        </select>
                    </div>

                    {/* Mode and Map */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="mode">Mode *</label>
                            <select
                                id="mode"
                                name="mode"
                                value={formData.mode}
                                onChange={handleChange}
                                required
                            >
                                <option value="solo">Solo</option>
                                <option value="duo">Duo</option>
                                <option value="squad">Squad</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="map">Map *</label>
                            <select
                                id="map"
                                name="map"
                                value={formData.map}
                                onChange={handleChange}
                                required
                            >
                                <option value="erangel">Erangel</option>
                                <option value="miramar">Miramar</option>
                                <option value="sanhok">Sanhok</option>
                                <option value="vikendi">Vikendi</option>
                                <option value="livik">Livik</option>
                                <option value="karakin">Karakin</option>
                            </select>
                        </div>
                    </div>

                    {/* Max Slots */}
                    <div className="form-group">
                        <label htmlFor="maxSlots">
                            Max Slots
                            <span className="hint">
                                (Leave empty for default: Solo: 32, Duo: 24, Squad: 24)
                            </span>
                        </label>
                        <input
                            type="number"
                            id="maxSlots"
                            name="maxSlots"
                            value={formData.maxSlots}
                            onChange={handleChange}
                            min={2}
                            max={100}
                            placeholder="Auto"
                        />
                    </div>

                    {/* Region and Level */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="region">Region</label>
                            <select
                                id="region"
                                name="region"
                                value={formData.region}
                                onChange={handleChange}
                            >
                                <option value="asia">Asia (India)</option>
                                <option value="europe">Europe</option>
                                <option value="north_america">North America</option>
                                <option value="south_america">South America</option>
                                <option value="oceania">Oceania</option>
                                <option value="africa">Africa</option>
                                <option value="global">Global</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="minLevelRequired">Minimum Level</label>
                            <select
                                id="minLevelRequired"
                                name="minLevelRequired"
                                value={formData.minLevelRequired}
                                onChange={handleChange}
                            >
                                <option value="none">No Restriction</option>
                                <option value="bronze">Bronze</option>
                                <option value="silver">Silver</option>
                                <option value="gold">Gold</option>
                                <option value="platinum">Platinum</option>
                                <option value="diamond">Diamond</option>
                            </select>
                        </div>
                    </div>

                    {/* Password Protection */}
                    <div className="form-group">
                        <label htmlFor="password">
                            Password
                            <span className="hint">(Optional - Leave empty for public room)</span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Optional password"
                        />
                    </div>

                    {/* Spectators */}
                    <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="allowSpectators"
                                checked={formData.allowSpectators}
                                onChange={handleChange}
                            />
                            <span>Allow Spectators</span>
                        </label>
                    </div>

                    {formData.allowSpectators && (
                        <div className="form-group">
                            <label htmlFor="maxSpectators">Max Spectators</label>
                            <input
                                type="number"
                                id="maxSpectators"
                                name="maxSpectators"
                                value={formData.maxSpectators}
                                onChange={handleChange}
                                min={1}
                                max={50}
                            />
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Creating Room...' : 'Create Room'}
                    </button>

                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => router.push('/rooms')}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
}
