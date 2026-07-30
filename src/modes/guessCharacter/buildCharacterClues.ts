import type { Character } from '../../data/types';
import type { Clue } from '../../engine/ClueEngine';

/**
 * Ordered from least to most revealing, per REQUEST.md's worked example
 * (gender -> affiliation -> magical ability -> "known for" last, since
 * that field is usually the giveaway). Fields a character doesn't have
 * are skipped rather than shown as blanks.
 */
const CLUE_ORDER: { category: string; get: (c: Character) => string | undefined }[] = [
  { category: 'Gender', get: (c) => c.gender },
  { category: 'Blood Status', get: (c) => c.bloodStatus },
  { category: 'Hogwarts House', get: (c) => c.house },
  { category: 'Affiliation', get: (c) => c.affiliation?.join(', ') },
  { category: 'Occupation', get: (c) => c.occupation },
  { category: 'Origin', get: (c) => c.origin },
  { category: 'Patronus', get: (c) => c.patronus },
  { category: 'First Appearance', get: (c) => c.firstAppearance },
  { category: 'Magical Ability', get: (c) => c.magicalAbility },
  { category: 'Known For', get: (c) => c.knownFor },
];

/** Builds the progressive clue list for a character, skipping fields that aren't set. */
export function buildCharacterClues(character: Character): Clue[] {
  const clues: Clue[] = [];
  for (const { category, get } of CLUE_ORDER) {
    const value = get(character);
    if (value) clues.push({ category, value });
  }
  return clues;
}
