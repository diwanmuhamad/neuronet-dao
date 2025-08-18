import { useState, useEffect, useCallback, useRef } from "react";

interface UsePaginationOptions {
  limit: number;
  throttleMs?: number;
}

export function usePagination<T>(options: UsePaginationOptions) {
  const { limit, throttleMs = 300 } = options;
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const throttleRef = useRef<NodeJS.Timeout | null>(null);

  const loadMore = useCallback(
    async (fetchFunction: (page: number, limit: number) => Promise<T[]>) => {
      if (loading || !hasMore) return;

      setLoading(true);
      setError(null);

      try {
        const newItems = await fetchFunction(currentPage, limit);

        if (newItems.length === 0) {
          setHasMore(false);
        } else {
          setItems((prev) => [...prev, ...newItems]);
          setCurrentPage((prev) => prev + 1);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load items");
      } finally {
        setLoading(false);
      }
    },
    [currentPage, limit, loading, hasMore],
  );

  const loadMoreThrottled = useCallback(
    async (fetchFunction: (page: number, limit: number) => Promise<T[]>) => {
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
      }

      throttleRef.current = setTimeout(() => {
        loadMore(fetchFunction);
      }, throttleMs);
    },
    [loadMore, throttleMs],
  );

  const reset = useCallback(() => {
    setItems([]);
    setCurrentPage(0);
    setHasMore(true);
    setError(null);
    if (throttleRef.current) {
      clearTimeout(throttleRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
      }
    };
  }, []);

  return {
    items,
    loading,
    hasMore,
    error,
    loadMore,
    loadMoreThrottled,
    reset,
  };
}
