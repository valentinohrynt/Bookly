import { useState, useEffect, useCallback } from 'react';
import { getBookDetails, extractWorkId } from '../services/bookApi';
import type { BookDetail } from '../types/book';

interface UseBookDetailsReturn {
  book: BookDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useBookDetails(id: string | undefined): UseBookDetailsReturn {
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const refetch = useCallback(() => setRetryCount((c) => c + 1), []);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError('No book ID provided.');
      return;
    }

    let cancelled = false;
    const fetchBook = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBookDetails(extractWorkId(id));
        if (!cancelled) {
          setBook(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to load book details.',
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    fetchBook();
    return () => {
      cancelled = true;
    };
  }, [id, retryCount]);

  return { book, loading, error, refetch };
}