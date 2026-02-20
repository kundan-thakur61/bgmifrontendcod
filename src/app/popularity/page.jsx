'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  getPopularityOverview,
  getPopularityListings,
  calculatePopularityPrice
} from '@/lib/api';

export default function PopularityMarketplace() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [overview, setOverview] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [filters, setFilters] = useState({
    minPoints: '',
    maxPoints: '',
    maxPrice: '',
    sortBy: 'pricePerThousand',
    sortOrder: 'asc'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  // Calculator
  const [calculator, setCalculator] = useState({
    points: '',
    rate: 4,
    result: null
  });

  useEffect(() => {
    fetchOverview();
    fetchListings();
  }, [pagination.page]);

  const fetchOverview = async () => {
    try {
      const response = await getPopularityOverview();
      if (response.success) {
        setOverview(response.data);
      }
    } catch (err) {
      console.error('Error fetching overview:', err);
    }
  };

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      };
      
      if (filters.minPoints) params.minPoints = filters.minPoints;
      if (filters.maxPoints) params.maxPoints = filters.maxPoints;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const response = await getPopularityListings(params);
      if (response.success) {
        setListings(response.data.listings);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total,
          pages: response.data.pagination.pages
        }));
      }
    } catch (err) {
      setError('Failed to load listings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchListings();
  };

  const handleCalculate = async () => {
    if (!calculator.points || calculator.points < 1000) {
      return;
    }
    
    try {
      const response = await calculatePopularityPrice({
        points: parseInt(calculator.points),
        ratePerThousand: parseFloat(calculator.rate)
      });
      if (response.success) {
        setCalculator(prev => ({ ...prev, result: response.data }));
      }
    } catch (err) {
      console.error('Calculation error:', err);
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Popularity Marketplace</h1>
          <p className="text-gray-300 text-lg">
            Buy and sell BGMI popularity points safely and securely
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      {overview && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-sm">Active Listings</p>
              <p className="text-2xl font-bold text-purple-400">
                {overview.stats.totalListings}
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-sm">Points Available</p>
              <p className="text-2xl font-bold text-green-400">
                {formatNumber(overview.stats.totalPointsAvailable)}
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-sm">Avg Rate (per 1K)</p>
              <p className="text-2xl font-bold text-yellow-400">
                Rs. {overview.stats.avgPricePerThousand?.toFixed(2) || '4.00'}
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-sm">Total Traded</p>
              <p className="text-2xl font-bold text-blue-400">
                {formatNumber(overview.totalVolume.totalPointsTraded)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/popularity/create"
                  className="block w-full bg-purple-600 hover:bg-purple-700 text-center py-2 rounded-lg transition"
                >
                  Sell Popularity
                </Link>
                <Link
                  href="/popularity/my-listings"
                  className="block w-full bg-gray-700 hover:bg-gray-600 text-center py-2 rounded-lg transition"
                >
                  My Listings
                </Link>
                <Link
                  href="/popularity/transactions"
                  className="block w-full bg-gray-700 hover:bg-gray-600 text-center py-2 rounded-lg transition"
                >
                  My Transactions
                </Link>
              </div>
            </div>

            {/* Price Calculator */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="font-semibold mb-4">Price Calculator</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Popularity Points
                  </label>
                  <input
                    type="number"
                    value={calculator.points}
                    onChange={(e) => setCalculator(prev => ({ ...prev, points: e.target.value }))}
                    placeholder="e.g., 10000"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                    min="1000"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Rate per 1000 (Rs.)
                  </label>
                  <input
                    type="number"
                    value={calculator.rate}
                    onChange={(e) => setCalculator(prev => ({ ...prev, rate: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                    min="1"
                    max="10"
                    step="0.5"
                  />
                </div>
                <button
                  onClick={handleCalculate}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg transition"
                >
                  Calculate
                </button>
                
                {calculator.result && (
                  <div className="bg-gray-700 rounded-lg p-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Price:</span>
                      <span className="font-semibold">Rs. {calculator.result.totalPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Platform Fee (5%):</span>
                      <span className="text-red-400">Rs. {calculator.result.platformFee}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-600 pt-2">
                      <span className="text-gray-400">Seller Earns:</span>
                      <span className="text-green-400 font-semibold">Rs. {calculator.result.sellerEarnings}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="font-semibold mb-4">Filters</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Min Points
                  </label>
                  <input
                    type="number"
                    name="minPoints"
                    value={filters.minPoints}
                    onChange={handleFilterChange}
                    placeholder="e.g., 1000"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Max Points
                  </label>
                  <input
                    type="number"
                    name="maxPoints"
                    value={filters.maxPoints}
                    onChange={handleFilterChange}
                    placeholder="e.g., 100000"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Max Price (per 1K)
                  </label>
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="e.g., 5"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Sort By
                  </label>
                  <select
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                  >
                    <option value="pricePerThousand">Price</option>
                    <option value="remainingPoints">Points Available</option>
                    <option value="createdAt">Newest</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Order
                  </label>
                  <select
                    name="sortOrder"
                    value={filters.sortOrder}
                    onChange={handleFilterChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                  >
                    <option value="asc">Low to High</option>
                    <option value="desc">High to Low</option>
                  </select>
                </div>
                <button
                  onClick={applyFilters}
                  className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg transition"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Main Content - Listings */}
          <div className="lg:col-span-3">
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : listings.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
                <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">No Listings Found</h3>
                <p className="text-gray-400 mb-4">Be the first to sell popularity points!</p>
                <Link
                  href="/popularity/create"
                  className="inline-block bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg transition"
                >
                  Create Listing
                </Link>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {listings.map((listing) => (
                    <Link
                      key={listing._id}
                      href={`/popularity/${listing._id}`}
                      className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-purple-500 transition"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{listing.characterName}</h3>
                          <p className="text-gray-400 text-sm">ID: {listing.characterId}</p>
                        </div>
                        <span className="bg-green-900/50 text-green-400 px-2 py-1 rounded text-xs">
                          Active
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Available:</span>
                          <span className="font-semibold">{formatNumber(listing.remainingPoints)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Rate:</span>
                          <span className="text-purple-400 font-semibold">Rs. {listing.pricePerThousand}/1K</span>
                        </div>
                      </div>

                      {listing.seller && (
                        <div className="flex items-center gap-2 pt-3 border-t border-gray-700">
                          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                            {listing.seller.avatar ? (
                              <img src={listing.seller.avatar} alt="" className="w-8 h-8 rounded-full" />
                            ) : (
                              <span className="text-sm">{listing.seller.name?.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{listing.seller.name}</p>
                            <p className="text-xs text-gray-400">Level {listing.seller.level || 1}</p>
                          </div>
                          {listing.seller.isVerifiedHost && (
                            <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm9.358 6.78a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414l3-3z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 bg-gray-800 rounded-lg">
                      Page {pagination.page} of {pagination.pages}
                    </span>
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page === pagination.pages}
                      className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-800 py-12 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Browse & Select</h3>
              <p className="text-gray-400">
                Browse available listings and choose a seller with the best rate and reputation.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Pay Securely</h3>
              <p className="text-gray-400">
                Pay from your wallet. Funds are held securely until the transaction is complete.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Receive Popularity</h3>
              <p className="text-gray-400">
                Seller transfers popularity to your character. Confirm receipt to release funds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}