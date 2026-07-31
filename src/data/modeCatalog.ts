import type { QuizMode } from '../engine/types';

export interface ModeMeta {
  id: QuizMode;
  name: string;
  description: string;
  icon: string;
}

/** Metadata for the 7 quiz modes from REQUEST.md, used to drive the mode-select UI. */
export const modeCatalog: ModeMeta[] = [
  { id: 'quotes', name: 'Popular Quotes', description: 'Identify who said a famous line.', icon: '💬' },
  { id: 'blurryCharacter', name: 'Blurry Character Guess', description: 'Name the character before the blur clears.', icon: '🌫️' },
  { id: 'spellVsVillain', name: 'Spell vs Villain Challenge', description: 'Pick the most effective spell for the scenario.', icon: '⚡' },
  { id: 'guessHouse', name: 'Guess the Hogwarts House', description: 'Match a scenario to the right house.', icon: '🏰' },
  { id: 'guessCreature', name: 'Guess the Creature', description: 'Recognize a creature by silhouette, blur, or sound.', icon: '🐾' },
  { id: 'finishDialogue', name: 'Finish the Dialogue', description: 'Complete an iconic line of dialogue.', icon: '📜' },
  { id: 'guessCharacter', name: 'Guess the Character', description: 'Compare traits after every guess until you find the match.', icon: '🔍' },
];

export const modeById = new Map(modeCatalog.map((m) => [m.id, m]));
