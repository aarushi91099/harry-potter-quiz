import type { Difficulty, HouseName } from '../engine/types';

export interface Character {
  id: string;
  name: string;
  aliases: string[];
  house?: HouseName;
  bloodStatus?: string;
  affiliation?: string[];
  occupation?: string;
  origin?: string;
  patronus?: string;
  firstAppearance?: string;
  knownFor?: string;
  magicalAbility?: string;
  gender?: string;
  imageUrl: string;
  attribution?: string;
  difficulty: Difficulty;
}

export interface Quote {
  id: string;
  text: string;
  characterId: string;
  source: 'book' | 'movie';
  sourceTitle: string;
  difficulty: Difficulty;
  funFact?: string;
}

export interface Spell {
  id: string;
  name: string;
  type: 'offensive' | 'defensive' | 'utility' | 'counter';
  effect: string;
}

export interface SpellScenario {
  id: string;
  prompt: string;
  correctSpellId: string;
  challengeType: 'villain' | 'creature' | 'curse' | 'obstacle';
  explanation: string;
  difficulty: Difficulty;
}

export interface SortingOption {
  id: string;
  text: string;
  house: HouseName;
}

export interface SortingQuestion {
  id: string;
  prompt: string;
  /** Exactly one option per house. */
  options: SortingOption[];
}

export interface Creature {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  soundUrl?: string;
  attribution?: string;
  difficulty: Difficulty;
}

export interface DialogueEntry {
  id: string;
  partial: string;
  answer: string;
  fullDialogue: string;
  source: 'book' | 'movie';
  difficulty: Difficulty;
}
