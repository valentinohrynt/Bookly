import { IonChip, IonIcon, IonText } from '@ionic/react';
import { closeCircleOutline, timeOutline } from 'ionicons/icons';
import './RecentSearches.css';

interface RecentSearchesProps {
  searches: string[];
  onSelect: (query: string) => void;
  onClear: () => void;
}

const RecentSearches: React.FC<RecentSearchesProps> = ({ searches, onSelect, onClear }) => {
  if (searches.length === 0) return null;

  return (
    <div className="recent-searches">
      <div className="recent-searches-header">
        <IonIcon icon={timeOutline} className="recent-searches-icon" />
        <IonText className="recent-searches-label">
          <span>Recent searches</span>
        </IonText>
        <button className="recent-searches-clear" onClick={onClear} aria-label="Clear recent searches">
          <IonIcon icon={closeCircleOutline} />
        </button>
      </div>
      <div className="recent-searches-chips">
        {searches.map((query) => (
          <IonChip key={query} onClick={() => onSelect(query)} outline>
            {query}
          </IonChip>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;