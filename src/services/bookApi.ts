import type { BookSearchResponse, BookDetail, BookSearchResult } from '../types/book';

const BASE_URL = 'https://openlibrary.org';

export async function searchBooks(query: string): Promise<BookSearchResult[]> {
  if (!query.trim()) return [];

  const response = await fetch(
    `${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=20`,
  );
  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }

  const data: BookSearchResponse = await response.json();
  return data.docs ?? [];
}

export async function getBookDetails(workId: string): Promise<BookDetail | null> {
  const id = workId.startsWith('/works/') ? workId : `/works/${workId}`;

  const response = await fetch(`${BASE_URL}${id}.json`);
  if (!response.ok) {
    throw new Error(`Failed to fetch book details: ${response.statusText}`);
  }

  const data: BookDetail = await response.json();
  return data;
}

export function extractWorkId(key: string): string {
  return key.replace('/works/', '');
}