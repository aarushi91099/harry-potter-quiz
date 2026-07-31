import { characters, characterSearchIndex } from '../data/characters';
import type { Character } from '../data/types';
import { SearchSelect } from './SearchSelect';

export interface CharacterSearchSelectProps {
  onSelect: (character: Character) => void;
  disabled?: boolean;
  /** Character ids to hide from results, e.g. ones already guessed this round. */
  excludeIds?: ReadonlySet<string>;
}

/** Full-catalog searchable character picker, shared by every character-identification quiz mode. */
export function CharacterSearchSelect({ onSelect, disabled, excludeIds }: CharacterSearchSelectProps) {
  return (
    <SearchSelect
      items={characters}
      search={(query) => {
        const results = characterSearchIndex.search(query, 8);
        return excludeIds ? results.filter((c) => !excludeIds.has(c.id)) : results;
      }}
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
