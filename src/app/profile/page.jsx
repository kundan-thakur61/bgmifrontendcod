'use client';

import { useState, useEffect } from 'react';
import { Navbar, Footer } from '@/components/layout';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    gameId: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        gameId: user.gameId || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const data = await api.updateProfile(formData);
      updateUser(data.user);
      setIsEditing(false);
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Demo user data
  const demoUser = {
    username: 'ProGamer123',
    email: 'progamer@example.com',
    phone: '9876543210',
    gameId: '5123456789',
    kycStatus: 'verified',
    matchesPlayed: 45,
    matchesWon: 12,
    totalWinnings: 5680,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  };

  const displayUser = user || demoUser;

  const stats = [
    { label: 'Matches Played', value: displayUser.matchesPlayed || 45 },
    { label: 'Matches Won', value: displayUser.matchesWon || 12 },
    { label: 'Win Rate', value: `${Math.round(((displayUser.matchesWon || 12) / (displayUser.matchesPlayed || 45)) * 100)}%` },
    { label: 'Total Winnings', value: `₹${displayUser.totalWinnings || 5680}` },
  ];

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen pt-16 sm:pt-20">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-bold font-display mb-6 sm:mb-8">Profile</h1>

          {/* Profile Card */}
          <div className="card p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
              {/* Avatar */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-500 to-gaming-purple rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold flex-shrink-0">
                {(displayUser.username || 'U')[0].toUpperCase()}
              </div>
              
              <div className="flex-1 text-center sm:text-left min-w-0">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1 sm:mb-2">
                  <h2 className="text-xl sm:text-2xl font-bold truncate">{displayUser.username}</h2>
                  {displayUser.kycStatus === 'verified' && (
                    <span className="badge badge-success">Verified</span>
                  )}
                </div>
                <p className="text-dark-400 text-sm">Member since {formatDate(displayUser.createdAt)}</p>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn-outline w-full sm:w-auto min-h-[44px]"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6 p-3 sm:p-4 bg-dark-700/50 rounded-lg">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-primary-400">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-dark-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Profile Form */}
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="label">Username</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="input"
                    />
                  ) : (
                    <p className="px-4 py-2.5 bg-dark-700/50 rounded-lg">{displayUser.username}</p>
                  )}
                </div>

                <div>
                  <label className="label">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input"
                    />
                  ) : (
                    <p className="px-4 py-2.5 bg-dark-700/50 rounded-lg">{displayUser.email}</p>
                  )}
                </div>

                <div>
                  <label className="label">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input"
                    />
                  ) : (
                    <p className="px-4 py-2.5 bg-dark-700/50 rounded-lg">{displayUser.phone}</p>
                  )}
                </div>

                <div>
                  <label className="label">Game ID</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.gameId}
                      onChange={(e) => setFormData({ ...formData, gameId: e.target.value })}
                      className="input"
                    />
                  ) : (
                    <p className="px-4 py-2.5 bg-dark-700/50 rounded-lg">{displayUser.gameId}</p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <a href="/kyc" className="card-hover p-3 sm:p-4 text-center min-h-[80px] flex flex-col items-center justify-center">
              <span className="text-xl sm:text-2xl mb-1 sm:mb-2 block">📋</span>
              <span className="font-medium text-xs sm:text-base">KYC Verification</span>
            </a>
            <a href="/tickets" className="card-hover p-3 sm:p-4 text-center min-h-[80px] flex flex-col items-center justify-center">
              <span className="text-xl sm:text-2xl mb-1 sm:mb-2 block">🎫</span>
              <span className="font-medium text-xs sm:text-base">Support Tickets</span>
            </a>
            <a href="/notifications" className="card-hover p-3 sm:p-4 text-center min-h-[80px] flex flex-col items-center justify-center">
              <span className="text-xl sm:text-2xl mb-1 sm:mb-2 block">🔔</span>
              <span className="font-medium text-xs sm:text-base">Notifications</span>
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
