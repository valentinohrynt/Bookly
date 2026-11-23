export const OPEN_LIBRARY_BASE_URL = 'https://openlibrary.org';
export const SEARCH_RESULTS_LIMIT = 20;

export const STORAGE_KEYS = {
  FAVORITES: 'bookly_favorites',
  RECENT_SEARCHES: 'bookly_recent_searches',
  RECENTLY_VIEWED: 'bookly_recently_viewed',
} as const;

export const MAX_RECENT_SEARCHES = 5;
export const MAX_RECENTLY_VIEWED = 10;

export const PLACEHOLDER_COVER_URL = 'https://via.placeholder.com/200x300?text=No+Cover';
export const COVER_SIZES = { SMALL: 'S', MEDIUM: 'M', LARGE: 'L' } as const;