import type { QuizMode } from '../engine/types';

export interface ModeMeta {
  id: QuizMode;
  name: string;
  description: string;
  /** Path to the mode's medallion artwork, cropped from public/cards.png. */
  image: string;
}

/** Metadata for the 7 quiz modes from REQUEST.md, used to drive the mode-select UI. */
export const modeCatalog: ModeMeta[] = [
  {
    id: 'quotes',
    name: 'Popular Quotes',
    description: 'Identify who said a famous line.',
    image: '/mode-icons/quotes.png',
  },
  {
    id: 'blurryCharacter',
    name: 'Blurry Character Guess',
    description: 'Name the character before the blur clears.',
    image: '/mode-icons/blurryCharacter.png',
  },
  {
    id: 'spellVsVillain',
    name: 'Spell vs Villain Challenge',
    description: 'Pick the most effective spell for the scenario.',
    image: '/mode-icons/spellVsVillain.png',
  },
  {
    id: 'sortingHat',
    name: 'Sorting Hat Quiz',
    description: 'Answer 5 questions about yourself and let the Sorting Hat reveal your house.',
    image: '/mode-icons/guessHouse.png',
  },
  {
    id: 'guessCreature',
    name: 'Guess the Creature',
    description: 'Guess the creature from its silhouette before your two chances run out.',
    image: '/mode-icons/guessCreature.png',
  },
  {
    id: 'finishDialogue',
    name: 'Finish the Dialogue',
    description: 'Complete an iconic line of dialogue — 3 chances, with a letter revealed each miss.',
    image: '/mode-icons/finishDialogue.png',
  },
  {
    id: 'guessCharacter',
    name: 'Guess the Character',
    description: 'Compare traits after every guess until you find the match.',
    image: '/mode-icons/guessCharacter.png',
  },
];

export const modeById = new Map(modeCatalog.map((m) => [m.id, m]));
