import { describe, expect, it } from 'vitest';
import { buildCharacterClues } from './buildCharacterClues';
import { charactersById } from '../../data/characters';

describe('buildCharacterClues', () => {
  it('orders clues from least to most revealing, ending with "Known For"', () => {
    const sirius = charactersById.get('sirius-black')!;
    const clues = buildCharacterClues(sirius);

    expect(clues[0].category).toBe('Gender');
    expect(clues[0].value).toBe('Male');
    expect(clues[clues.length - 1].category).toBe('Known For');
    expect(clues[clues.length - 1].value).toMatch(/godfather/i);
  });

  it('skips fields the character does not have set', () => {
    const kingsley = charactersById.get('kingsley-shacklebolt')!;
    const clues = buildCharacterClues(kingsley);

    expect(clues.some((c) => c.category === 'Hogwarts House')).toBe(false);
    expect(clues.some((c) => c.category === 'Patronus')).toBe(false);
  });

  it('joins multiple affiliations into one clue value', () => {
    const harry = charactersById.get('harry-potter')!;
    const clues = buildCharacterClues(harry);
    const affiliationClue = clues.find((c) => c.category === 'Affiliation');

    expect(affiliationClue?.value).toContain('Order of the Phoenix');
  });

  it('produces at least one clue for every character in the catalog', () => {
    for (const character of charactersById.values()) {
      expect(buildCharacterClues(character).length).toBeGreaterThan(0);
    }
  });
});
