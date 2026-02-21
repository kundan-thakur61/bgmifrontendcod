'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  getMyPopularityListings,
  updatePopularityListing,
  deletePopularityListing
} from '@/lib/api';

export default function MyListingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingListing, setEditingListing] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      fetchListings();
    }
  }, [user, authLoading]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await getMyPopularityListings();
      if (response.success) {
        setListings(response.data);
      }
    } catch (err) {
      setError('Failed to load listings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (listing) => {
    try {
      const newStatus = listing.status === 'active' ? 'paused' : 'active';
      const response = await updatePopularityListing(listing._id, { status: newStatus });
      if (response.success) {
        fetchListings();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update listing');
    }
  };

  const handleDelete = async (listingId) => {
    try {
      const response = await deletePopularityListing(listingId);
      if (response.success) {
        setShowDeleteConfirm(null);
        fetchListings();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete listing');
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-900/50 text-green-400',
      paused: 'bg-yellow-900/50 text-yellow-400',
      sold_out: 'bg-red-900/50 text-red-400',
      cancelled: 'bg-gray-700 text-gray-400'
    };
    return styles[status] || styles.cancelled;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Breadcrumb */}
      <div className="bg-gray-800 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/popularity" className="text-gray-400 hover:text-white">
              Marketplace
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-purple-400">My Listings</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Listings</h1>
          <Link
            href="/popularity/create"
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold transition"
          >
            Create New Listing
          </Link>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {listings.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
            <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No Listings Yet</h3>
            <p className="text-gray-400 mb-4">Start selling your popularity points!</p>
            <Link
              href="/popularity/create"
              className="inline-block bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg transition"
            >
              Create Your First Listing
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <div
                key={listing._id}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Listing Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{listing.characterName}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(listing.status)}`}>
                        {listing.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">ID: {listing.characterId}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Total Points</p>
                        <p className="font-semibold">{formatNumber(listing.popularityPoints)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Remaining</p>
                        <p className="font-semibold text-green-400">{formatNumber(listing.remainingPoints)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Rate</p>
                        <p className="font-semibold text-purple-400">Rs. {listing.pricePerThousand}/1K</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Sold</p>
                        <p className="font-semibold text-blue-400">{formatNumber(listing.totalSold)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <span>Created: {formatDate(listing.createdAt)}</span>
                      <span>Expires: {formatDate(listing.expiresAt)}</span>
                      <span>{listing.totalTransactions} transactions</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {listing.status === 'active' && (
                      <button
                        onClick={() => handleStatusToggle(listing)}
                        className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg text-sm font-medium transition"
                      >
                        Pause Listing
                      </button>
                    )}
                    {listing.status === 'paused' && (
                      <button
                        onClick={() => handleStatusToggle(listing)}
                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium transition"
                      >
                        Activate Listing
                      </button>
                    )}
                    <Link
                      href={`/popularity/${listing._id}`}
                      className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium text-center transition"
                    >
                      View Details
                    </Link>
                    {listing.status !== 'sold_out' && (
                      <button
                        onClick={() => setShowDeleteConfirm(listing._id)}
                        className="bg-red-900/50 hover:bg-red-900 text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                {/* Delete Confirmation */}
                {showDeleteConfirm === listing._id && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-sm text-gray-400 mb-3">
                      Are you sure you want to delete this listing? This action cannot be undone.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(listing._id)}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition"
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {listings.length > 0 && (
          <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-lg font-semibold mb-4">Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Total Listings</p>
                <p className="text-2xl font-bold">{listings.length}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Active Listings</p>
                <p className="text-2xl font-bold text-green-400">
                  {listings.filter(l => l.status === 'active').length}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Points Listed</p>
                <p className="text-2xl font-bold text-blue-400">
                  {formatNumber(listings.reduce((sum, l) => sum + l.popularityPoints, 0))}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Points Sold</p>
                <p className="text-2xl font-bold text-purple-400">
                  {formatNumber(listings.reduce((sum, l) => sum + l.totalSold, 0))}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
