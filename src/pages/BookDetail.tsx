import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonText,
  IonChip,
  IonIcon,
  IonSkeletonText,
  IonToast,
} from '@ionic/react';
import { informationCircleOutline } from 'ionicons/icons';
import { useBookDetails } from '../hooks/useBookDetails';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { getCoverUrl, getPlaceholderCover } from '../types/book';
import type { BookSearchResult } from '../types/book';
import FavoriteButton from '../components/FavoriteButton';
import LazyImage from '../components/LazyImage';
import './BookDetail.css';

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { book, loading, error } = useBookDetails(id);
  const { addRecentlyViewed } = useRecentlyViewed();
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  useEffect(() => {
    if (book && id) {
      addRecentlyViewed({
        key: id.startsWith('/works/') ? id : `/works/${id}`,
        title: book.title,
        coverId: book.covers?.[0],
      });
    }
  }, [book, id, addRecentlyViewed]);

  const getDescription = (desc: string | { value: string } | undefined): string => {
    if (!desc) return 'No description available.';
    if (typeof desc === 'string') return desc;
    return desc.value;
  };

  const coverSrc = book?.covers?.[0]
    ? getCoverUrl(book.covers[0], 'L')
    : getPlaceholderCover();

  const bookSummary: BookSearchResult | null = book
    ? {
        key: id?.startsWith('/works/') ? id : `/works/${id}`,
        title: book.title,
        cover_i: book.covers?.[0],
      }
    : null;

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home" />
            </IonButtons>
            <IonTitle>Loading...</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="skeleton-container">
            <IonSkeletonText animated style={{ width: '200px', height: '300px', margin: '0 auto' }} />
            <IonSkeletonText animated style={{ width: '70%', height: '32px', marginTop: '16px' }} />
            <IonSkeletonText animated style={{ width: '50%', height: '20px', marginTop: '8px' }} />
            <IonSkeletonText animated style={{ width: '100%', height: '80px', marginTop: '16px' }} />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (error) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home" />
            </IonButtons>
            <IonTitle>Error</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="error-container">
            <IonIcon icon={informationCircleOutline} size="large" color="danger" />
            <IonText color="danger">
              <h2>Something went wrong</h2>
              <p>{error}</p>
            </IonText>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Book Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="detail-container">
          <div className="detail-cover-wrapper">
            <LazyImage
              src={coverSrc}
              alt={`Cover of ${book?.title}`}
              className="detail-cover"
              fallbackSrc={getPlaceholderCover()}
            />
            {bookSummary && (
              <div className="detail-favorite-overlay">
                <FavoriteButton book={bookSummary} size="large" />
              </div>
            )}
          </div>

          <div className="detail-info">
            <IonText>
              <h1 className="detail-title">{book?.title ?? 'Unknown Title'}</h1>
            </IonText>

            {book?.first_publish_date && (
              <IonText className="detail-meta">
                <p>First published: {book.first_publish_date}</p>
              </IonText>
            )}

            {book?.number_of_pages && (
              <IonText className="detail-meta">
                <p>{book.number_of_pages} pages</p>
              </IonText>
            )}

            {book?.subjects && book.subjects.length > 0 && (
              <div className="detail-subjects">
                <IonText className="section-label">
                  <p>Subjects</p>
                </IonText>
                <div className="chip-group">
                  {book.subjects.slice(0, 12).map((subject) => (
                    <IonChip key={subject} color="primary">
                      {subject}
                    </IonChip>
                  ))}
                </div>
              </div>
            )}

            <div className="detail-description">
              <IonText className="section-label">
                <p>Description</p>
              </IonText>
              <IonText className="description-text">
                <p>{getDescription(book?.description)}</p>
              </IonText>
            </div>
          </div>
        </div>
      </IonContent>

      <IonToast
        isOpen={showCopiedToast}
        onDidDismiss={() => setShowCopiedToast(false)}
        message="Link copied to clipboard!"
        duration={2000}
        position="bottom"
        color="success"
      />
    </IonPage>
  );
};

export default BookDetail;