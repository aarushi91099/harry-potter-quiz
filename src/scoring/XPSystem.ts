import type { Difficulty } from '../engine/types';

const XP_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 10,
  medium: 20,
  hard: 35,
};

const XP_PER_LEVEL = 100;

/** Levels required before each harder difficulty unlocks, per REQUEST.md's "XP unlocks higher difficulty content". */
const UNLOCK_LEVEL: Record<Difficulty, number> = {
  easy: 1,
  medium: 3,
  hard: 6,
};

export function xpForAnswer(difficulty: Difficulty): number {
  return XP_BY_DIFFICULTY[difficulty];
}

export function levelForXp(totalXp: number): number {
  return Math.floor(totalXp / XP_PER_LEVEL) + 1;
}

export function xpIntoCurrentLevel(totalXp: number): { current: number; required: number } {
  return { current: totalXp % XP_PER_LEVEL, required: XP_PER_LEVEL };
}

export function isDifficultyUnlocked(totalXp: number, difficulty: Difficulty): boolean {
  return levelForXp(totalXp) >= UNLOCK_LEVEL[difficulty];
}
