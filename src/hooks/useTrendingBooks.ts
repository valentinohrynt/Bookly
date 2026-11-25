import { useState, useEffect, useCallback, useRef } from 'react';
import type { BookSearchResult } from '../types/book';
import { SEARCH_RESULTS_LIMIT } from '../constants';

interface TrendingResponse {
  works: {
    key: string;
    title: string;
    author_name?: string[];
    first_publish_year?: number;
    cover_i?: number;
    cover_id?: number;
    isbn?: string[];
  }[];
}

interface UseTrendingBooksReturn {
  books: BookSearchResult[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const CACHE_KEY = 'bookly_trending_cache';
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

function mapTrendingWork(work: TrendingResponse['works'][number]): BookSearchResult {
  return {
    key: work.key,
    title: work.title,
    author_name: work.author_name,
    first_publish_year: work.first_publish_year,
    cover_i: work.cover_i ?? work.cover_id,
    isbn: work.isbn,
  };
}

function getCached(): BookSearchResult[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw) as {
      data: BookSearchResult[];
      timestamp: number;
    };
    if (Date.now() - timestamp > CACHE_DURATION) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setCached(data: BookSearchResult[]): void {
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, timestamp: Date.now() }),
    );
  } catch {
    // Silently fail if storage is full
  }
}

export function useTrendingBooks(): UseTrendingBooksReturn {
  const [books, setBooks] = useState<BookSearchResult[]>(() => getCached() ?? []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetchTrending = useCallback(async () => {
    const cached = getCached();
    if (cached) {
      setBooks(cached);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://openlibrary.org/trending/now.json?limit=${SEARCH_RESULTS_LIMIT}&fields=key,title,author_name,first_publish_year,cover_i,isbn`,
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch trending: ${response.statusText}`);
      }
      const data: TrendingResponse = await response.json();
      const mapped = data.works.map(mapTrendingWork);
      setCached(mapped);
      if (mountedRef.current) {
        setBooks(mapped);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(
          err instanceof Error ? err.message : 'Failed to load trending books.',
        );
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    if (books.length === 0) {
      fetchTrending();
    } else {
      setLoading(false);
    }
    return () => {
      mountedRef.current = false;
    };
  }, [fetchTrending, books.length]);

  const refetch = useCallback(() => {
    sessionStorage.removeItem(CACHE_KEY);
    fetchTrending();
  }, [fetchTrending]);

  return { books, loading, error, refetch };
}