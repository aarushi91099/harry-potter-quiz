import { creatures, creatureSearchIndex } from '../data/creatures';
import type { Creature } from '../data/types';
import { SearchSelect } from './SearchSelect';

export interface CreatureSearchSelectProps {
  onSelect: (creature: Creature) => void;
  disabled?: boolean;
}

/** Full-catalog searchable creature picker, shared by every Guess the Creature sub-mode. */
export function CreatureSearchSelect({ onSelect, disabled }: CreatureSearchSelectProps) {
  return (
    <SearchSelect
      items={creatures}
      search={(query) => creatureSearchIndex.search(query, 8)}
      getId={(c) => c.id}
      getLabel={(c) => c.name}
      getImageUrl={(c) => c.imageUrl}
      onSelect={onSelect}
      placeholder="Search creatures…"
      label="Search for a creature"
      disabled={disabled}
    />
  );
}
