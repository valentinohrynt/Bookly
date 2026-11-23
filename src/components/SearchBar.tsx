import { IonSearchbar } from '@ionic/react';
import './SearchBar.css';

interface SearchBarProps {
  value: string;
  onInput: (value: string) => void;
  onSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onInput, onSearch }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="search-bar-container">
      <IonSearchbar
        className="custom-searchbar"
        value={value}
        onIonInput={(e) => onInput(e.detail.value ?? '')}
        onKeyDown={handleKeyDown}
        placeholder="Search by title or author..."
        animated
        showCancelButton="focus"
        onIonCancel={() => onInput('')}
      />
    </div>
  );
};

export default SearchBar;