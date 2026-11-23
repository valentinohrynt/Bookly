import { useState } from 'react';
import './LazyImage.css';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setLoaded(true);
  };

  const showFallback = error || (!loaded && !src);

  return (
    <div className={`lazy-image-wrapper ${className}`}>
      {!loaded && !error && (
        <div className="lazy-image-skeleton">
          <div className="skeleton-shimmer" />
        </div>
      )}
      {showFallback && fallbackSrc ? (
        <img
          src={fallbackSrc}
          alt={alt}
          className="lazy-image loaded"
        />
      ) : (
        <img
          src={src}
          alt={alt}
          className={`lazy-image ${loaded ? 'loaded' : ''}`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default LazyImage;