import { create } from 'zustand';
import type { Attempt, AttemptResult, QuizMode } from '../engine/types';
import type { Achievement } from '../scoring/AchievementSystem';
import { scoreAttempt } from '../scoring/ScoreCalculator';
import { multiplierForStreak } from '../scoring/StreakSystem';
import { useProgression } from './useProgression';
import { useToastStore } from './useToastStore';

export interface SessionAnswerResult extends AttemptResult {
  /** Achievements this answer newly unlocked, for the UI to toast (Phase 4). */
  newlyUnlockedAchievements: Achievement[];
}

interface GameSessionState {
  mode: QuizMode | null;
  score: number;
  correctCount: number;
  totalCount: number;
  currentStreak: number;
  bestStreakThisSession: number;
  lastResult: AttemptResult | null;

  start: (mode: QuizMode) => void;
  /** Grades one answer: updates session score/streak and forwards XP/achievement bookkeeping to useProgression. */
  submitAnswer: (attempt: Attempt) => SessionAnswerResult;
  end: () => void;
}

const initialSessionFields = {
  mode: null,
  score: 0,
  correctCount: 0,
  totalCount: 0,
  currentStreak: 0,
  bestStreakThisSession: 0,
  lastResult: null,
};

export const useGameSession = create<GameSessionState>()((set, get) => ({
  ...initialSessionFields,

  start: (mode) => set({ ...initialSessionFields, mode }),

  submitAnswer: (attempt) => {
    const state = get();
    const nextStreak = attempt.correct ? state.currentStreak + 1 : 0;
    const multiplier = multiplierForStreak(nextStreak);
    const basePoints = scoreAttempt(attempt);
    const points = Math.round(basePoints * multiplier);

    const newlyUnlocked = useProgression
      .getState()
      .recordAnswer(attempt.mode, attempt.difficulty, attempt.correct);
    useProgression.getState().recordStreak(nextStreak);
    useToastStore.getState().pushToasts(newlyUnlocked);

    const result: AttemptResult = {
      attempt,
      points,
      xpAwarded: attempt.correct ? points : 0,
      streak: nextStreak,
      streakMultiplier: multiplier,
    };

    set({
      score: state.score + points,
      correctCount: state.correctCount + (attempt.correct ? 1 : 0),
      totalCount: state.totalCount + 1,
      currentStreak: nextStreak,
      bestStreakThisSession: Math.max(state.bestStreakThisSession, nextStreak),
      lastResult: result,
    });

    return { ...result, newlyUnlockedAchievements: newlyUnlocked };
  },

  end: () => set({ mode: null }),
}));

export function selectAccuracy(state: GameSessionState): number {
  return state.totalCount > 0 ? state.correctCount / state.totalCount : 0;
}
