import type { QuizMode } from '../engine/types';

export interface ModeMeta {
  id: QuizMode;
  name: string;
  description: string;
}

/** Metadata for the 7 quiz modes from REQUEST.md, used to drive the mode-select UI. */
export const modeCatalog: ModeMeta[] = [
  { id: 'quotes', name: 'Popular Quotes', description: 'Identify who said a famous line.' },
  { id: 'blurryCharacter', name: 'Blurry Character Guess', description: 'Name the character before the blur clears.' },
  { id: 'spellVsVillain', name: 'Spell vs Villain Challenge', description: 'Pick the most effective spell for the scenario.' },
  { id: 'guessHouse', name: 'Guess the Hogwarts House', description: 'Match a scenario to the right house.' },
  { id: 'guessCreature', name: 'Guess the Creature', description: 'Recognize a creature by silhouette, blur, or sound.' },
  { id: 'finishDialogue', name: 'Finish the Dialogue', description: 'Complete an iconic line of dialogue.' },
  { id: 'guessCharacter', name: 'Guess the Character', description: 'Identify a character from progressively revealed clues.' },
];

export const modeById = new Map(modeCatalog.map((m) => [m.id, m]));
