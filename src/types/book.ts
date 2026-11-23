export interface BookSearchResult {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  isbn?: string[];
  publisher?: string[];
}

export interface BookDetail {
  title: string;
  description?: string | { value: string };
  covers?: number[];
  authors?: { author: { key: string } }[];
  first_publish_date?: string;
  subjects?: string[];
  subject_places?: string[];
  subject_people?: string[];
  excerpt?: { text: string; comment?: string }[];
  number_of_pages?: number;
}

export interface BookSearchResponse {
  numFound: number;
  docs: BookSearchResult[];
}

export function getCoverUrl(coverId: number, size: 'S' | 'M' | 'L' = 'M'): string {
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}

export function getPlaceholderCover(): string {
  return 'https://via.placeholder.com/200x300?text=No+Cover';
}