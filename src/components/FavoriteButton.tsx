import { IonIcon } from '@ionic/react';
import { heartOutline, heart } from 'ionicons/icons';
import { useFavorites } from '../hooks/useFavorites';
import type { BookSearchResult } from '../types/book';
import './FavoriteButton.css';

interface FavoriteButtonProps {
  book: BookSearchResult;
  size?: 'small' | 'large';
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ book, size = 'small' }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(book.key);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleFavorite(book);
  };

  return (
    <button
      className={`favorite-btn ${favorited ? 'favorited' : ''} ${size === 'large' ? 'favorite-btn-large' : ''}`}
      onClick={handleClick}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
      title={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <IonIcon icon={favorited ? heart : heartOutline} />
    </button>
  );
};

export default FavoriteButton;