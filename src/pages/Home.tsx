import { useNavigate } from 'react-router-dom';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonText,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonChip,
} from '@ionic/react';
import { libraryOutline, heart, trendingUp } from 'ionicons/icons';
import SearchBar from '../components/SearchBar';
import BookCard from '../components/BookCard';
import RecentSearches from '../components/RecentSearches';
import { extractWorkId } from '../services/bookApi';
import { useBookSearch } from '../hooks/useBookSearch';
import { useRecentSearches } from '../hooks/useRecentSearches';
import { useFavorites } from '../hooks/useFavorites';
import { useTrendingBooks } from '../hooks/useTrendingBooks';
import type { BookSearchResult } from '../types/book';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { books, loading, error, searched, query, setQuery, search } = useBookSearch();
  const { recentSearches, addSearch, clearSearches } = useRecentSearches();
  const { favoritesCount } = useFavorites();
  const {
    books: trendingBooks,
    loading: trendingLoading,
    error: trendingError,
  } = useTrendingBooks();

  const handleSearch = async () => {
    if (!query.trim()) return;
    addSearch(query);
    await search();
  };

  const handleRecentSearchSelect = (q: string) => {
    setQuery(q);
    addSearch(q);
    search(q);
  };

  const handleBookClick = (book: BookSearchResult) => {
    navigate(`/book/${extractWorkId(book.key)}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Bookly</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Bookly</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="home-container">
          <div className="hero-section">
            <IonIcon icon={libraryOutline} className="hero-icon" />
            <IonText>
              <h1 className="hero-title">Welcome to Bookly</h1>
              <p className="hero-subtitle">Discover your next great read. Search millions of books.</p>
            </IonText>
            {favoritesCount > 0 && (
              <IonChip color="danger" className="favorites-chip" onClick={() => navigate('/favorites')}>
                <IonIcon icon={heart} />
                {favoritesCount} favorite{favoritesCount !== 1 ? 's' : ''}
              </IonChip>
            )}
          </div>

          <SearchBar value={query} onInput={setQuery} onSearch={handleSearch} />

          {!loading && !searched && (
            <RecentSearches
              searches={recentSearches}
              onSelect={handleRecentSearchSelect}
              onClear={clearSearches}
            />
          )}

          {loading && (
            <div className="loading-container">
              <IonSpinner name="crescent" />
              <IonText>
                <p>Searching books...</p>
              </IonText>
            </div>
          )}

          {error && (
            <div className="error-container">
              <IonText color="danger">
                <p>{error}</p>
              </IonText>
            </div>
          )}

          {!loading && searched && books.length > 0 && (
            <div className="results-section">
              <IonText>
                <p className="results-count">Found {books.length} results</p>
              </IonText>
              <IonGrid>
                <IonRow>
                  {books.map((book) => (
                    <IonCol size="6" sizeMd="4" sizeLg="3" key={book.key}>
                      <BookCard book={book} onClick={() => handleBookClick(book)} />
                    </IonCol>
                  ))}
                </IonRow>
              </IonGrid>
            </div>
          )}

          {!loading && searched && books.length === 0 && !error && (
            <div className="empty-container">
              <IonText>
                <p>No books found. Try a different search term.</p>
              </IonText>
            </div>
          )}

          {!searched && !loading && (
            <div className="trending-section">
              <div className="trending-header">
                <IonIcon icon={trendingUp} className="trending-icon" />
                <IonText>
                  <h2 className="trending-title">Trending Now</h2>
                </IonText>
              </div>

              {trendingLoading && (
                <IonGrid>
                  <IonRow>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <IonCol size="6" sizeMd="4" sizeLg="3" key={i}>
                        <div className="trending-skeleton">
                          <div className="skeleton-cover" />
                          <div className="skeleton-line" />
                          <div className="skeleton-line short" />
                        </div>
                      </IonCol>
                    ))}
                  </IonRow>
                </IonGrid>
              )}

              {trendingError && !trendingLoading && (
                <div className="empty-container">
                  <IonText color="medium">
                    <p>Unable to load trending books right now.</p>
                  </IonText>
                </div>
              )}

              {!trendingLoading && !trendingError && trendingBooks.length > 0 && (
                <IonGrid className="trending-grid">
                  <IonRow>
                    {trendingBooks.slice(0, 8).map((book) => (
                      <IonCol size="6" sizeMd="4" sizeLg="3" key={book.key}>
                        <BookCard book={book} onClick={() => handleBookClick(book)} />
                      </IonCol>
                    ))}
                  </IonRow>
                </IonGrid>
              )}
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
