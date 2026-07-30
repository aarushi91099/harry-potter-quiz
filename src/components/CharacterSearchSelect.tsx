import { characters, characterSearchIndex } from '../data/characters';
import type { Character } from '../data/types';
import { SearchSelect } from './SearchSelect';

export interface CharacterSearchSelectProps {
  onSelect: (character: Character) => void;
  disabled?: boolean;
}

/** Full-catalog searchable character picker, shared by every character-identification quiz mode. */
export function CharacterSearchSelect({ onSelect, disabled }: CharacterSearchSelectProps) {
  return (
    <SearchSelect
      items={characters}
      search={(query) => characterSearchIndex.search(query, 8)}
      getId={(c) => c.id}
      getLabel={(c) => c.name}
      getImageUrl={(c) => c.imageUrl}
      onSelect={onSelect}
      placeholder="Search characters…"
      label="Search for a character"
      disabled={disabled}
    />
  );
}
