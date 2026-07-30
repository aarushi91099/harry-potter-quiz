import type { Difficulty, QuizMode } from '../engine/types';

export interface ScoreContext {
  difficulty: Difficulty;
  /** For guessCharacter: how many clues were visible when the guess was made. */
  cluesRevealed?: number;
  totalClues?: number;
  /** For blurryCharacter/guessCreature: 1.0 = guessed instantly, 0.0 = guessed at full reveal. */
  earliness?: number;
  /** For spellVsVillain: time taken to answer vs the scenario's time limit. */
  elapsedMs?: number;
  timeLimitMs?: number;
}

export interface ProgressionStats {
  totalXp: number;
  correctByMode: Record<QuizMode, number>;
  bestStreak: number;
  unlockedAchievementIds: string[];
}
