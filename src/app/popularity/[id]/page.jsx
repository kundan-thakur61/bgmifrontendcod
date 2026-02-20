'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  getPopularityListing,
  buyPopularity,
  calculatePopularityPrice
} from '@/lib/api';
import ContactAdmin from '@/components/chat/ContactAdmin';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [listing, setListing] = useState(null);
  const [sellerTransactions, setSellerTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Purchase form
  const [purchaseForm, setPurchaseForm] = useState({
    points: '',
    buyerCharacterId: '',
    buyerCharacterName: ''
  });
  const [pricePreview, setPricePreview] = useState(null);
  const [purchasing, setPurchasing] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  useEffect(() => {
    fetchListing();
  }, [params.id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const response = await getPopularityListing(params.id);
      if (response.success) {
        setListing(response.data.listing);
        setSellerTransactions(response.data.sellerTransactions);
      }
    } catch (err) {
      setError('Failed to load listing');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseChange = async (e) => {
    const { name, value } = e.target;
    setPurchaseForm(prev => ({ ...prev, [name]: value }));

    // Calculate price preview when points change
    // Only call API if points >= 1000 (backend minimum requirement)
    if (name === 'points' && value && listing) {
      const pointsValue = parseInt(value);

      // Clear preview if below minimum
      if (pointsValue < 1000) {
        setPricePreview(null);
        return;
      }

      try {
        const response = await calculatePopularityPrice({
          points: pointsValue,
          ratePerThousand: listing.pricePerThousand
        });
        if (response.success) {
          setPricePreview(response.data);
        }
      } catch (err) {
        console.error('Price calculation error:', err);
        setPricePreview(null);
      }
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!purchaseForm.points || !purchaseForm.buyerCharacterId || !purchaseForm.buyerCharacterName) {
      setError('Please fill all fields');
      return;
    }

    if (parseInt(purchaseForm.points) < 1000) {
      setError('Minimum 1,000 points required');
      return;
    }

    if (parseInt(purchaseForm.points) > listing.remainingPoints) {
      setError('Not enough points available');
      return;
    }

    try {
      setPurchasing(true);
      const response = await buyPopularity({
        listingId: listing._id,
        points: parseInt(purchaseForm.points),
        buyerCharacterId: purchaseForm.buyerCharacterId,
        buyerCharacterName: purchaseForm.buyerCharacterName
      });

      if (response.success) {
        router.push(`/popularity/transactions/${response.data.transaction._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Purchase failed');
    } finally {
      setPurchasing(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Listing Not Found</h2>
          <Link href="/popularity" className="text-purple-400 hover:underline">
            Back to Marketplace
          </Link>
        </div>
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
            <span className="text-purple-400">{listing.characterName}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Listing Header */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold">{listing.characterName}</h1>
                  <p className="text-gray-400">Character ID: {listing.characterId}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${listing.status === 'active' ? 'bg-green-900/50 text-green-400' :
                    listing.status === 'paused' ? 'bg-yellow-900/50 text-yellow-400' :
                      'bg-red-900/50 text-red-400'
                  }`}>
                  {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Available Points</p>
                  <p className="text-xl font-bold text-green-400">
                    {formatNumber(listing.remainingPoints)}
                  </p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Total Points</p>
                  <p className="text-xl font-bold">
                    {formatNumber(listing.popularityPoints)}
                  </p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Rate (per 1K)</p>
                  <p className="text-xl font-bold text-purple-400">
                    Rs. {listing.pricePerThousand}
                  </p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Total Sold</p>
                  <p className="text-xl font-bold text-blue-400">
                    {formatNumber(listing.totalSold)}
                  </p>
                </div>
              </div>

              {/* Seller Notes */}
              {listing.sellerNotes && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Seller Notes</h3>
                  <p className="text-gray-300 bg-gray-700/50 rounded-lg p-4">
                    {listing.sellerNotes}
                  </p>
                </div>
              )}

              {/* Listing Info */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Listed:</span>
                    <span className="ml-2">{formatDate(listing.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Expires:</span>
                    <span className="ml-2">{formatDate(listing.expiresAt)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Transactions:</span>
                    <span className="ml-2">{listing.totalTransactions}</span>
                  </div>
                  {listing.isVerified && (
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm9.358 6.78a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414l3-3z" clipRule="evenodd" />
                      </svg>
                      <span className="text-blue-400">Verified Listing</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Seller Info */}
            {listing.seller && (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-lg font-semibold mb-4">Seller Information</h2>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
                    {listing.seller.avatar ? (
                      <img src={listing.seller.avatar} alt="" className="w-16 h-16 rounded-full" />
                    ) : (
                      <span className="text-2xl">{listing.seller.name?.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{listing.seller.name}</h3>
                      {listing.seller.isVerifiedHost && (
                        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm9.358 6.78a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414l3-3z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                      <span>Level {listing.seller.level || 1}</span>
                      <span>{listing.seller.matchesPlayed || 0} matches</span>
                      <span>Rs. {formatNumber(listing.seller.totalEarnings || 0)} earned</span>
                    </div>
                  </div>
                </div>

                {/* Recent Transactions */}
                {sellerTransactions.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">Recent Sales</h3>
                    <div className="space-y-2">
                      {sellerTransactions.map((tx, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-700/50 rounded-lg px-4 py-2">
                          <span className="text-sm">{formatNumber(tx.popularityPoints)} points</span>
                          {tx.rating && (
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${i < tx.rating.score ? 'text-yellow-400' : 'text-gray-600'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Purchase Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Purchase Popularity</h2>

              {listing.status !== 'active' ? (
                <div className="text-center py-4">
                  <p className="text-gray-400">This listing is not available for purchase</p>
                </div>
              ) : listing.remainingPoints < 1000 ? (
                <div className="text-center py-4">
                  <p className="text-gray-400">Insufficient points available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Points to Buy *
                    </label>
                    <input
                      type="number"
                      name="points"
                      value={purchaseForm.points}
                      onChange={handlePurchaseChange}
                      placeholder={`Min: 1,000 | Max: ${formatNumber(listing.remainingPoints)}`}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                      min="1000"
                      max={listing.remainingPoints}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Your Character ID *
                    </label>
                    <input
                      type="text"
                      name="buyerCharacterId"
                      value={purchaseForm.buyerCharacterId}
                      onChange={handlePurchaseChange}
                      placeholder="Enter your BGMI Character ID"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Your Character Name *
                    </label>
                    <input
                      type="text"
                      name="buyerCharacterName"
                      value={purchaseForm.buyerCharacterName}
                      onChange={handlePurchaseChange}
                      placeholder="Enter your BGMI Character Name"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  {/* Price Preview */}
                  {pricePreview && (
                    <div className="bg-gray-700/50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Points:</span>
                        <span>{formatNumber(pricePreview.points)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Rate:</span>
                        <span>Rs. {pricePreview.ratePerThousand}/1K</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-600 pt-2">
                        <span className="font-semibold">Total:</span>
                        <span className="text-purple-400 font-bold text-lg">Rs. {pricePreview.totalPrice}</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handlePurchase}
                    disabled={purchasing || !purchaseForm.points}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-lg font-semibold transition"
                  >
                    {purchasing ? 'Processing...' : 'Purchase Now'}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    Payment will be deducted from your wallet. Funds are held securely until you confirm receipt.
                  </p>
                </div>
              )}

              {/* Info Box */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h3 className="font-semibold mb-3 text-sm">Transaction Process</h3>
                <ol className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="bg-purple-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0">1</span>
                    <span>Pay from your wallet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-purple-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0">2</span>
                    <span>Seller transfers popularity to your character</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-purple-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0">3</span>
                    <span>Confirm receipt after receiving</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-purple-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0">4</span>
                    <span>Funds released to seller</span>
                  </li>
                </ol>
              </div>

              {/* Contact Admin / Support */}
              {user && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h3 className="font-semibold mb-3 text-sm">Have Questions?</h3>
                  <ContactAdmin
                    listingId={listing._id}
                    listingTitle={listing.characterName}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}