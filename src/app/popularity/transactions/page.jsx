'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getPopularityTransactions } from '@/lib/api';

export default function TransactionsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [filters, setFilters] = useState({
    role: 'all',
    status: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      fetchTransactions();
    }
  }, [user, authLoading, pagination.page, filters]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit
      };
      
      if (filters.role !== 'all') params.role = filters.role;
      if (filters.status) params.status = filters.status;

      const response = await getPopularityTransactions(params);
      if (response.success) {
        setTransactions(response.data.transactions);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total,
          pages: response.data.pagination.pages
        }));
      }
    } catch (err) {
      setError('Failed to load transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
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
      payment_done: 'Payment Done',
      transferred: 'Transferred',
      completed: 'Completed',
      disputed: 'Disputed',
      cancelled: 'Cancelled',
      refunded: 'Refunded'
    };
    return texts[status] || status;
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
            <span className="text-purple-400">My Transactions</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">My Transactions</h1>
          
          {/* Filters */}
          <div className="flex gap-4">
            <select
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Roles</option>
              <option value="buyer">As Buyer</option>
              <option value="seller">As Seller</option>
            </select>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="payment_done">Payment Done</option>
              <option value="transferred">Transferred</option>
              <option value="completed">Completed</option>
              <option value="disputed">Disputed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {transactions.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
            <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No Transactions Yet</h3>
            <p className="text-gray-400 mb-4">
              {filters.role === 'all' 
                ? 'Start buying or selling popularity points!'
                : `No transactions as ${filters.role}`}
            </p>
            <Link
              href="/popularity"
              className="inline-block bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg transition"
            >
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {transactions.map((transaction) => {
                const isBuyer = transaction.buyer?._id === user?._id;
                const otherParty = isBuyer ? transaction.seller : transaction.buyer;
                
                return (
                  <Link
                    key={transaction._id}
                    href={`/popularity/transactions/${transaction._id}`}
                    className="block bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-purple-500 transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Transaction Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2 py-1 rounded text-xs ${isBuyer ? 'bg-blue-900/50 text-blue-400' : 'bg-green-900/50 text-green-400'}`}>
                            {isBuyer ? 'BUYING' : 'SELLING'}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(transaction.status)}`}>
                            {getStatusText(transaction.status).toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-gray-400 text-sm">Points</p>
                            <p className="font-semibold">{formatNumber(transaction.popularityPoints)}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Amount</p>
                            <p className="font-semibold text-purple-400">Rs. {formatNumber(transaction.totalAmount)}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Rate</p>
                            <p className="font-semibold">Rs. {transaction.pricePerThousand}/1K</p>
                          </div>
                        </div>
                      </div>

                      {/* Other Party */}
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-gray-400 text-sm">
                            {isBuyer ? 'Seller' : 'Buyer'}
                          </p>
                          <p className="font-medium">{otherParty?.name || 'Unknown'}</p>
                        </div>
                        <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                          {otherParty?.avatar ? (
                            <img src={otherParty.avatar} alt="" className="w-10 h-10 rounded-full" />
                          ) : (
                            <span>{otherParty?.name?.charAt(0) || '?'}</span>
                          )}
                        </div>
                      </div>

                      {/* Date & Arrow */}
                      <div className="flex items-center gap-4">
                        <div className="text-right text-sm text-gray-400">
                          <p>{formatDate(transaction.createdAt)}</p>
                        </div>
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    {/* Action Required Notice */}
                    {(transaction.status === 'payment_done' && !isBuyer) && (
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <p className="text-yellow-400 text-sm">
                          Action required: Transfer popularity points to buyer
                        </p>
                      </div>
                    )}
                    {(transaction.status === 'transferred' && isBuyer) && (
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <p className="text-yellow-400 text-sm">
                          Action required: Confirm receipt of popularity points
                        </p>
                      </div>
                    )}
                  </Link>
                );
              })}
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
  );
}