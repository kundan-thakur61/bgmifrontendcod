'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Infinite scroll hook with intersection observer.
 * @param {Function} fetchMore - Async function to load more items
 * @param {object} options - Configuration options
 */
export default function useInfiniteScroll(fetchMore, options = {}) {
  const {
    threshold = 0.5,
    rootMargin = '100px',
    enabled = true,
  } = options;

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !enabled) return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchMore(page);
      if (result) {
        setHasMore(result.hasMore !== false);
        setPage((p) => p + 1);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to load more items');
    } finally {
      setLoading(false);
    }
  }, [fetchMore, page, loading, hasMore, enabled]);

  useEffect(() => {
    if (!enabled || !sentinelRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold, rootMargin }
    );

    observerRef.current.observe(sentinelRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore, hasMore, loading, enabled, threshold, rootMargin]);

  const reset = useCallback(() => {
    setPage(1);
    setHasMore(true);
    setError(null);
    setLoading(false);
  }, []);

  return {
    sentinelRef,
    loading,
    hasMore,
    error,
    page,
    reset,
  };
}
