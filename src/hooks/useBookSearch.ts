import { useState, useCallback } from 'react';
import { searchBooks } from '../services/bookApi';
import type { BookSearchResult } from '../types/book';

interface UseBookSearchReturn {
  books: BookSearchResult[];
  loading: boolean;
  error: string | null;
  searched: boolean;
  query: string;
  setQuery: (q: string) => void;
  search: (term?: string) => Promise<void>;
}

export function useBookSearch(): UseBookSearchReturn {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<BookSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (term?: string) => {
    const searchTerm = (term ?? query).trim();
    if (!searchTerm) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const results = await searchBooks(searchTerm);
      setBooks(results);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Search failed. Please try again.',
      );
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  return { books, loading, error, searched, query, setQuery, search };
}