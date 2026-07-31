export type Difficulty = 'easy' | 'medium' | 'hard';

export type HouseName = 'Gryffindor' | 'Ravenclaw' | 'Hufflepuff' | 'Slytherin';

export type QuizMode =
  | 'quotes'
  | 'blurryCharacter'
  | 'spellVsVillain'
  | 'sortingHat'
  | 'guessCreature'
  | 'finishDialogue'
  | 'guessCharacter';

/** A single graded attempt at a question, produced by a mode's UI and consumed by scoring. */
export interface Attempt {
  mode: QuizMode;
  questionId: string;
  difficulty: Difficulty;
  correct: boolean;
  /** Mode-specific context ScoreCalculator needs (elapsed time, clue count, etc). */
  context?: Record<string, number | string>;
}

export interface AttemptResult {
  attempt: Attempt;
  points: number;
  xpAwarded: number;
  streak: number;
  streakMultiplier: number;
}
