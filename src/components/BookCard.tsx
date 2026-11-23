import { IonCard, IonCardContent, IonText } from '@ionic/react';
import { getCoverUrl, getPlaceholderCover } from '../types/book';
import type { BookSearchResult } from '../types/book';
import FavoriteButton from './FavoriteButton';
import LazyImage from './LazyImage';
import './BookCard.css';

interface BookCardProps {
  book: BookSearchResult;
  onClick: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  const coverSrc = book.cover_i
    ? getCoverUrl(book.cover_i, 'M')
    : getPlaceholderCover();

  const year = book.first_publish_year ?? 'Unknown year';

  return (
    <IonCard className="book-card" onClick={onClick} button>
      <div className="book-card-cover">
        <LazyImage
          src={coverSrc}
          alt={`Cover of ${book.title}`}
          className="book-cover-img"
          fallbackSrc={getPlaceholderCover()}
        />
        <div className="book-card-favorite">
          <FavoriteButton book={book} />
        </div>
      </div>
      <IonCardContent className="book-card-content">
        <IonText className="book-title">
          <h3>{book.title}</h3>
        </IonText>
        <IonText className="book-author">
          <p>{book.author_name?.join(', ') ?? 'Unknown Author'}</p>
        </IonText>
        <IonText className="book-year">
          <p>{year}</p>
        </IonText>
      </IonCardContent>
    </IonCard>
  );
};

export default BookCard;