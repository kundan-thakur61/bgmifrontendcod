'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

/**
 * Hook for managing wallet state, deposits, and withdrawals.
 */
export default function useWallet() {
  const { isAuthenticated, user } = useAuth();
  const [balance, setBalance] = useState({ wallet: 0, bonus: 0, winnings: 0 });
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBalance = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await api.getWalletBalance();
      setBalance({
        wallet: data.wallet || data.balance || 0,
        bonus: data.bonus || 0,
        winnings: data.winnings || 0,
      });
    } catch (err) {
      setError(err.message);
    }
  }, [isAuthenticated]);

  const fetchTransactions = useCallback(async (page = 1) => {
    if (!isAuthenticated) return;
    try {
      const data = await api.getTransactions(page);
      setTransactions(data.transactions || []);
      return data;
    } catch (err) {
      setError(err.message);
    }
  }, [isAuthenticated]);

  const fetchWithdrawals = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await api.getWithdrawals();
      setWithdrawals(data.withdrawals || []);
    } catch (err) {
      setError(err.message);
    }
  }, [isAuthenticated]);

  const createDeposit = useCallback(async (amount) => {
    try {
      setError(null);
      const data = await api.createDeposit(amount);
      return data; // Returns Razorpay order
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  }, []);

  const verifyPayment = useCallback(async (paymentData) => {
    try {
      setError(null);
      const data = await api.verifyPayment(paymentData);
      await fetchBalance(); // Refresh balance after payment
      await fetchTransactions();
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  }, [fetchBalance, fetchTransactions]);

  const requestWithdrawal = useCallback(async (withdrawalData) => {
    try {
      setError(null);
      const data = await api.createWithdrawal(withdrawalData);
      await fetchBalance();
      await fetchWithdrawals();
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  }, [fetchBalance, fetchWithdrawals]);

  const cancelWithdrawal = useCallback(async (withdrawalId) => {
    try {
      setError(null);
      await api.cancelWithdrawal(withdrawalId);
      await fetchBalance();
      await fetchWithdrawals();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  }, [fetchBalance, fetchWithdrawals]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchBalance(), fetchTransactions(), fetchWithdrawals()]);
    setLoading(false);
  }, [fetchBalance, fetchTransactions, fetchWithdrawals]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAll();
    }
  }, [isAuthenticated, fetchAll]);

  return {
    balance,
    transactions,
    withdrawals,
    loading,
    error,
    fetchBalance,
    fetchTransactions,
    fetchWithdrawals,
    createDeposit,
    verifyPayment,
    requestWithdrawal,
    cancelWithdrawal,
    refreshAll: fetchAll,
  };
}
