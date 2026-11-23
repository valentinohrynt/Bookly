import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../constants';
import type { BookSearchResult } from '../types/book';

interface UseFavoritesReturn {
  favorites: BookSearchResult[];
  isFavorite: (bookKey: string) => boolean;
  toggleFavorite: (book: BookSearchResult) => void;
  clearFavorites: () => void;
  favoritesCount: number;
}

export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites, clearFavorites] = useLocalStorage<BookSearchResult[]>(
    STORAGE_KEYS.FAVORITES,
    [],
  );

  const isFavorite = useCallback(
    (bookKey: string) => favorites.some((b) => b.key === bookKey),
    [favorites],
  );

  const toggleFavorite = useCallback(
    (book: BookSearchResult) => {
      setFavorites((prev) => {
        const exists = prev.some((b) => b.key === book.key);
        return exists
          ? prev.filter((b) => b.key !== book.key)
          : [book, ...prev];
      });
    },
    [setFavorites],
  );

  const favoritesCount = favorites.length;

  return useMemo(
    () => ({ favorites, isFavorite, toggleFavorite, clearFavorites, favoritesCount }),
    [favorites, isFavorite, toggleFavorite, clearFavorites, favoritesCount],
  );
}