import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS, MAX_RECENT_SEARCHES } from '../constants';

interface UseRecentSearchesReturn {
  recentSearches: string[];
  addSearch: (query: string) => void;
  clearSearches: () => void;
}

export function useRecentSearches(): UseRecentSearchesReturn {
  const [recentSearches, setRecentSearches, clearSearches] = useLocalStorage<string[]>(
    STORAGE_KEYS.RECENT_SEARCHES,
    [],
  );

  const addSearch = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) return;

      setRecentSearches((prev) => {
        const filtered = prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
        return [trimmed, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      });
    },
    [setRecentSearches],
  );

  return useMemo(
    () => ({ recentSearches, addSearch, clearSearches }),
    [recentSearches, addSearch, clearSearches],
  );
}