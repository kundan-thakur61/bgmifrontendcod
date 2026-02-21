'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  createPopularityListing,
  calculatePopularityPrice
} from '@/lib/api';

export default function CreateListingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    characterId: '',
    characterName: '',
    popularityPoints: '',
    pricePerThousand: '4',
    sellerNotes: ''
  });
  const [pricePreview, setPricePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Calculate price preview
    if ((name === 'popularityPoints' || name === 'pricePerThousand') && formData.popularityPoints) {
      const points = name === 'popularityPoints' ? value : formData.popularityPoints;
      const rate = name === 'pricePerThousand' ? value : formData.pricePerThousand;
      
      if (points && parseInt(points) >= 1000) {
        try {
          const response = await calculatePopularityPrice({
            points: parseInt(points),
            ratePerThousand: parseFloat(rate)
          });
          if (response.success) {
            setPricePreview(response.data);
          }
        } catch (err) {
          console.error('Price calculation error:', err);
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      router.push('/login');
      return;
    }

    // Validation
    if (!formData.characterId || !formData.characterName || !formData.popularityPoints) {
      setError('Please fill all required fields');
      return;
    }

    if (parseInt(formData.popularityPoints) < 1000) {
      setError('Minimum 1,000 popularity points required');
      return;
    }

    if (parseInt(formData.popularityPoints) > 1000000) {
      setError('Maximum 10,00,000 popularity points allowed');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await createPopularityListing({
        characterId: formData.characterId,
        characterName: formData.characterName,
        popularityPoints: parseInt(formData.popularityPoints),
        pricePerThousand: parseFloat(formData.pricePerThousand),
        sellerNotes: formData.sellerNotes
      });

      if (response.success) {
        router.push('/popularity/my-listings');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Breadcrumb */}
      <div className="bg-gray-800 py-3">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/popularity" className="text-gray-400 hover:text-white">
              Marketplace
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-purple-400">Create Listing</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h1 className="text-2xl font-bold mb-6">Sell Popularity Points</h1>
          
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Character Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Character ID <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="characterId"
                  value={formData.characterId}
                  onChange={handleChange}
                  placeholder="Enter your BGMI Character ID"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  This is where you'll transfer popularity from
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Character Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="characterName"
                  value={formData.characterName}
                  onChange={handleChange}
                  placeholder="Enter your BGMI Character Name"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
            </div>

            {/* Popularity Points */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Popularity Points Available <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="popularityPoints"
                value={formData.popularityPoints}
                onChange={handleChange}
                placeholder="e.g., 10000"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                min="1000"
                max="1000000"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Min: 1,000 | Max: 10,00,000 points
              </p>
            </div>

            {/* Price per Thousand */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Rate per 1,000 Points (Rs.) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="pricePerThousand"
                value={formData.pricePerThousand}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                min="1"
                max="10"
                step="0.5"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Base rate: Rs. 4 per 1,000 points. Min: Rs. 1 | Max: Rs. 10
              </p>
            </div>

            {/* Seller Notes */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Notes (Optional)
              </label>
              <textarea
                name="sellerNotes"
                value={formData.sellerNotes}
                onChange={handleChange}
                placeholder="Add any notes for buyers (e.g., transfer time, special instructions)"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 min-h-[100px]"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                Max 500 characters
              </p>
            </div>

            {/* Price Preview */}
            {pricePreview && (
              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <h3 className="font-semibold mb-3">Listing Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Points:</span>
                    <span className="font-semibold">{formatNumber(pricePreview.points)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rate:</span>
                    <span>Rs. {pricePreview.ratePerThousand}/1K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Value:</span>
                    <span className="font-semibold">Rs. {formatNumber(pricePreview.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Platform Fee (5%):</span>
                    <span className="text-red-400">- Rs. {formatNumber(pricePreview.platformFee)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-600 pt-2">
                    <span className="font-semibold">You'll Earn:</span>
                    <span className="text-green-400 font-bold text-lg">Rs. {formatNumber(pricePreview.sellerEarnings)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Info Box */}
            <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-400 mb-2">Important Information</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>· You can only have one active listing at a time</li>
                <li>· Listing expires after 30 days</li>
                <li>· Platform fee: 5% of total transaction value</li>
                <li>· Funds are released after buyer confirms receipt</li>
                <li>· Make sure you have the popularity points in your BGMI account</li>
              </ul>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <Link
                href="/popularity"
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-center py-3 rounded-lg font-semibold transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-lg font-semibold transition"
              >
                {loading ? 'Creating...' : 'Create Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
