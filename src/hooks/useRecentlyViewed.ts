import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS, MAX_RECENTLY_VIEWED } from '../constants';

export interface RecentlyViewedItem {
  key: string;
  title: string;
  coverId?: number;
  author?: string[];
  viewedAt: number;
}

interface UseRecentlyViewedReturn {
  recentlyViewed: RecentlyViewedItem[];
  addRecentlyViewed: (item: Omit<RecentlyViewedItem, 'viewedAt'>) => void;
  clearRecentlyViewed: () => void;
}

export function useRecentlyViewed(): UseRecentlyViewedReturn {
  const [recentlyViewed, setRecentlyViewed, clearRecentlyViewed] = useLocalStorage<
    RecentlyViewedItem[]
  >(STORAGE_KEYS.RECENTLY_VIEWED, []);

  const addRecentlyViewed = useCallback(
    (item: Omit<RecentlyViewedItem, 'viewedAt'>) => {
      setRecentlyViewed((prev) => {
        const filtered = prev.filter((v) => v.key !== item.key);
        return [{ ...item, viewedAt: Date.now() }, ...filtered].slice(
          0,
          MAX_RECENTLY_VIEWED,
        );
      });
    },
    [setRecentlyViewed],
  );

  return useMemo(
    () => ({ recentlyViewed, addRecentlyViewed, clearRecentlyViewed }),
    [recentlyViewed, addRecentlyViewed, clearRecentlyViewed],
  );
}