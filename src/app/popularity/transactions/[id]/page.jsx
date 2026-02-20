'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  getPopularityTransaction,
  markPopularityPaymentDone,
  confirmPopularityTransfer,
  confirmPopularityReceipt,
  cancelPopularityTransaction,
  raisePopularityDispute,
  ratePopularityTransaction
} from '@/lib/api';

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Forms
  const [transferForm, setTransferForm] = useState({
    screenshot: '',
    notes: ''
  });
  const [disputeForm, setDisputeForm] = useState({
    reason: ''
  });
  const [ratingForm, setRatingForm] = useState({
    score: 5,
    review: ''
  });
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);

  useEffect(() => {
    fetchTransaction();
  }, [params.id]);

  const fetchTransaction = async () => {
    try {
      setLoading(true);
      const response = await getPopularityTransaction(params.id);
      if (response.success) {
        setTransaction(response.data);
      }
    } catch (err) {
      setError('Failed to load transaction');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isBuyer = () => transaction?.buyer?._id === user?._id;
  const isSeller = () => transaction?.seller?._id === user?._id;

  const handleMarkPaymentDone = async () => {
    try {
      setActionLoading(true);
      const response = await markPopularityPaymentDone(transaction._id);
      if (response.success) {
        fetchTransaction();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark payment done');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmTransfer = async () => {
    try {
      setActionLoading(true);
      const response = await confirmPopularityTransfer(transaction._id, transferForm);
      if (response.success) {
        fetchTransaction();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to confirm transfer');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmReceipt = async () => {
    try {
      setActionLoading(true);
      const response = await confirmPopularityReceipt(transaction._id);
      if (response.success) {
        fetchTransaction();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to confirm receipt');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async (reason) => {
    try {
      setActionLoading(true);
      const response = await cancelPopularityTransaction(transaction._id, { reason });
      if (response.success) {
        fetchTransaction();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel transaction');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRaiseDispute = async () => {
    try {
      setActionLoading(true);
      const response = await raisePopularityDispute(transaction._id, disputeForm);
      if (response.success) {
        setShowDisputeModal(false);
        fetchTransaction();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to raise dispute');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRate = async () => {
    try {
      setActionLoading(true);
      const response = await ratePopularityTransaction(transaction._id, ratingForm);
      if (response.success) {
        setShowRatingModal(false);
        fetchTransaction();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setActionLoading(false);
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-900/50 text-yellow-400',
      payment_done: 'bg-blue-900/50 text-blue-400',
      transferred: 'bg-purple-900/50 text-purple-400',
      completed: 'bg-green-900/50 text-green-400',
      disputed: 'bg-red-900/50 text-red-400',
      cancelled: 'bg-gray-700 text-gray-400',
      refunded: 'bg-orange-900/50 text-orange-400'
    };
    return styles[status] || styles.cancelled;
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Payment Pending',
      payment_done: 'Payment Done - Awaiting Transfer',
      transferred: 'Transferred - Awaiting Confirmation',
      completed: 'Completed',
      disputed: 'Disputed - Under Review',
      cancelled: 'Cancelled',
      refunded: 'Refunded'
    };
    return texts[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Transaction Not Found</h2>
          <Link href="/popularity/transactions" className="text-purple-400 hover:underline">
            Back to Transactions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Breadcrumb */}
      <div className="bg-gray-800 py-3">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/popularity" className="text-gray-400 hover:text-white">
              Marketplace
            </Link>
            <span className="text-gray-600">/</span>
            <Link href="/popularity/transactions" className="text-gray-400 hover:text-white">
              Transactions
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-purple-400">{transaction._id.slice(-8)}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Status Header */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Transaction Details</h1>
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadge(transaction.status)}`}>
              {getStatusText(transaction.status)}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className={`px-2 py-1 rounded ${isBuyer() ? 'bg-blue-900/50 text-blue-400' : 'bg-green-900/50 text-green-400'}`}>
              You are {isBuyer() ? 'BUYER' : 'SELLER'}
            </span>
            <span>·</span>
            <span>ID: {transaction._id}</span>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
          <h2 className="font-semibold mb-4">Transaction Progress</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-700"></div>
            
            {/* Step 1: Created */}
            <div className="relative flex items-start gap-4 pb-6">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                ['pending', 'payment_done', 'transferred', 'completed'].includes(transaction.status)
                  ? 'bg-green-600'
                  : 'bg-gray-700'
              }`}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Transaction Created</p>
                <p className="text-sm text-gray-400">{formatDate(transaction.createdAt)}</p>
              </div>
            </div>

            {/* Step 2: Payment */}
            <div className="relative flex items-start gap-4 pb-6">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                ['payment_done', 'transferred', 'completed'].includes(transaction.status)
                  ? 'bg-green-600'
                  : transaction.status === 'pending'
                    ? 'bg-yellow-600'
                    : 'bg-gray-700'
              }`}>
                {['payment_done', 'transferred', 'completed'].includes(transaction.status) ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-sm font-bold">2</span>
                )}
              </div>
              <div>
                <p className="font-medium">Payment Confirmed</p>
                <p className="text-sm text-gray-400">
                  {transaction.paymentAt ? formatDate(transaction.paymentAt) : 'Waiting for payment confirmation'}
                </p>
              </div>
            </div>

            {/* Step 3: Transfer */}
            <div className="relative flex items-start gap-4 pb-6">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                ['transferred', 'completed'].includes(transaction.status)
                  ? 'bg-green-600'
                  : transaction.status === 'payment_done'
                    ? 'bg-yellow-600'
                    : 'bg-gray-700'
              }`}>
                {['transferred', 'completed'].includes(transaction.status) ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-sm font-bold">3</span>
                )}
              </div>
              <div>
                <p className="font-medium">Popularity Transferred</p>
                <p className="text-sm text-gray-400">
                  {transaction.transferAt ? formatDate(transaction.transferAt) : 'Waiting for seller to transfer'}
                </p>
              </div>
            </div>

            {/* Step 4: Completed */}
            <div className="relative flex items-start gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                transaction.status === 'completed'
                  ? 'bg-green-600'
                  : transaction.status === 'transferred'
                    ? 'bg-yellow-600'
                    : 'bg-gray-700'
              }`}>
                {transaction.status === 'completed' ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-sm font-bold">4</span>
                )}
              </div>
              <div>
                <p className="font-medium">Transaction Completed</p>
                <p className="text-sm text-gray-400">
                  {transaction.completedAt ? formatDate(transaction.completedAt) : 'Waiting for buyer confirmation'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Transaction Details */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="font-semibold mb-4">Transaction Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Popularity Points</span>
                <span className="font-semibold">{formatNumber(transaction.popularityPoints)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Rate per 1,000</span>
                <span>Rs. {transaction.pricePerThousand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Amount</span>
                <span className="font-semibold text-purple-400">Rs. {formatNumber(transaction.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Platform Fee</span>
                <span className="text-red-400">Rs. {formatNumber(transaction.platformFee)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-700 pt-3">
                <span className="text-gray-400">Seller Earns</span>
                <span className="font-semibold text-green-400">Rs. {formatNumber(transaction.sellerEarnings)}</span>
              </div>
            </div>
          </div>

          {/* Character Details */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="font-semibold mb-4">Character Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm">Buyer Character</p>
                <p className="font-medium">{transaction.buyerCharacterName}</p>
                <p className="text-sm text-gray-500">ID: {transaction.buyerCharacterId}</p>
              </div>
              {transaction.listing && (
                <div className="pt-3 border-t border-gray-700">
                  <p className="text-gray-400 text-sm">Seller Character</p>
                  <p className="font-medium">{transaction.listing.characterName}</p>
                  <p className="text-sm text-gray-500">ID: {transaction.listing.characterId}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Parties */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mt-6">
          <h2 className="font-semibold mb-4">Parties</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Buyer */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                {transaction.buyer?.avatar ? (
                  <img src={transaction.buyer.avatar} alt="" className="w-12 h-12 rounded-full" />
                ) : (
                  <span>{transaction.buyer?.name?.charAt(0)}</span>
                )}
              </div>
              <div>
                <p className="text-gray-400 text-sm">Buyer</p>
                <p className="font-medium">{transaction.buyer?.name}</p>
                {isBuyer() && <span className="text-xs text-purple-400">(You)</span>}
              </div>
            </div>
            
            {/* Seller */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                {transaction.seller?.avatar ? (
                  <img src={transaction.seller.avatar} alt="" className="w-12 h-12 rounded-full" />
                ) : (
                  <span>{transaction.seller?.name?.charAt(0)}</span>
                )}
              </div>
              <div>
                <p className="text-gray-400 text-sm">Seller</p>
                <p className="font-medium">{transaction.seller?.name}</p>
                {isSeller() && <span className="text-xs text-purple-400">(You)</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mt-6">
          <h2 className="font-semibold mb-4">Actions</h2>

          {/* Pending - Buyer Action */}
          {transaction.status === 'pending' && isBuyer() && (
            <div className="space-y-4">
              <p className="text-gray-400">
                Payment has been deducted from your wallet. Click below to confirm payment completion.
              </p>
              <button
                onClick={handleMarkPaymentDone}
                disabled={actionLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-3 rounded-lg font-semibold transition"
              >
                {actionLoading ? 'Processing...' : 'Confirm Payment Done'}
              </button>
            </div>
          )}

          {/* Payment Done - Seller Action */}
          {transaction.status === 'payment_done' && isSeller() && (
            <div className="space-y-4">
              <p className="text-yellow-400">
                Action Required: Transfer {formatNumber(transaction.popularityPoints)} popularity points to {transaction.buyerCharacterName} (ID: {transaction.buyerCharacterId})
              </p>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Screenshot URL (Optional)
                </label>
                <input
                  type="text"
                  value={transferForm.screenshot}
                  onChange={(e) => setTransferForm(prev => ({ ...prev, screenshot: e.target.value }))}
                  placeholder="Cloudinary URL of transfer screenshot"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={transferForm.notes}
                  onChange={(e) => setTransferForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any notes for the buyer"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 min-h-[80px]"
                />
              </div>
              <button
                onClick={handleConfirmTransfer}
                disabled={actionLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 py-3 rounded-lg font-semibold transition"
              >
                {actionLoading ? 'Processing...' : 'Confirm Transfer Done'}
              </button>
            </div>
          )}

          {/* Transferred - Buyer Action */}
          {transaction.status === 'transferred' && isBuyer() && (
            <div className="space-y-4">
              <p className="text-yellow-400">
                Action Required: Confirm you have received {formatNumber(transaction.popularityPoints)} popularity points
              </p>
              <button
                onClick={handleConfirmReceipt}
                disabled={actionLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 py-3 rounded-lg font-semibold transition"
              >
                {actionLoading ? 'Processing...' : 'Confirm Receipt'}
              </button>
              <button
                onClick={() => setShowDisputeModal(true)}
                className="w-full bg-red-900/50 hover:bg-red-900 text-red-400 py-3 rounded-lg font-semibold transition"
              >
                Raise Dispute
              </button>
            </div>
          )}

          {/* Completed - Rating */}
          {transaction.status === 'completed' && isBuyer() && !transaction.rating?.score && (
            <div className="space-y-4">
              <p className="text-gray-400">
                Transaction completed! Please rate your experience with the seller.
              </p>
              <button
                onClick={() => setShowRatingModal(true)}
                className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-semibold transition"
              >
                Rate Transaction
              </button>
            </div>
          )}

          {/* Completed - With Rating */}
          {transaction.status === 'completed' && transaction.rating?.score && (
            <div className="space-y-4">
              <p className="text-green-400">Transaction completed successfully!</p>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Your Rating:</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < transaction.rating.score ? 'text-yellow-400' : 'text-gray-600'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              {transaction.rating.review && (
                <p className="text-gray-300 italic">"{transaction.rating.review}"</p>
              )}
            </div>
          )}

          {/* Cancelled/Disputed */}
          {(transaction.status === 'cancelled' || transaction.status === 'disputed') && (
            <div className="text-center py-4">
              <p className="text-gray-400">
                {transaction.status === 'cancelled' ? 'This transaction was cancelled.' : 'This transaction is under dispute review.'}
              </p>
              {transaction.cancellation?.reason && (
                <p className="text-sm text-gray-500 mt-2">
                  Reason: {transaction.cancellation.reason}
                </p>
              )}
              {transaction.dispute?.reason && (
                <p className="text-sm text-gray-500 mt-2">
                  Dispute Reason: {transaction.dispute.reason}
                </p>
              )}
            </div>
          )}

          {/* Cancel Option */}
          {['pending', 'payment_done'].includes(transaction.status) && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <button
                onClick={() => handleCancel('Cancelled by user')}
                disabled={actionLoading}
                className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 rounded-lg transition"
              >
                Cancel Transaction
              </button>
            </div>
          )}
        </div>

        {/* Transfer Proof */}
        {transaction.transferProof?.screenshot && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mt-6">
            <h2 className="font-semibold mb-4">Transfer Proof</h2>
            <img
              src={transaction.transferProof.screenshot}
              alt="Transfer proof"
              className="max-w-full h-auto rounded-lg"
            />
            {transaction.transferProof.notes && (
              <p className="text-gray-400 mt-2">{transaction.transferProof.notes}</p>
            )}
          </div>
        )}
      </div>

      {/* Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Raise Dispute</h3>
            <p className="text-gray-400 text-sm mb-4">
              Please provide a reason for the dispute. An admin will review and resolve.
            </p>
            <textarea
              value={disputeForm.reason}
              onChange={(e) => setDisputeForm(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Explain the issue..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 min-h-[100px] mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowDisputeModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRaiseDispute}
                disabled={actionLoading || !disputeForm.reason}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 py-2 rounded-lg transition"
              >
                Submit Dispute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Rate Transaction</h3>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  onClick={() => setRatingForm(prev => ({ ...prev, score }))}
                  className="p-1"
                >
                  <svg
                    className={`w-8 h-8 ${score <= ratingForm.score ? 'text-yellow-400' : 'text-gray-600'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
            <textarea
              value={ratingForm.review}
              onChange={(e) => setRatingForm(prev => ({ ...prev, review: e.target.value }))}
              placeholder="Write a review (optional)..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 min-h-[80px] mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowRatingModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRate}
                disabled={actionLoading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 py-2 rounded-lg transition"
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}