import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Difficulty, QuizMode } from '../engine/types';
import { checkNewAchievements, type Achievement } from '../scoring/AchievementSystem';
import type { ProgressionStats } from '../scoring/types';
import { levelForXp, xpForAnswer } from '../scoring/XPSystem';

export interface LeaderboardEntry {
  name: string;
  score: number;
  mode: QuizMode;
  achievedAt: string; // ISO date
}

interface ProgressionState extends ProgressionStats {
  leaderboard: LeaderboardEntry[];
  /** Records a graded answer's outcome, awarding XP and returning any achievements newly unlocked. */
  recordAnswer: (mode: QuizMode, difficulty: Difficulty, correct: boolean) => Achievement[];
  recordStreak: (streak: number) => void;
  addLeaderboardEntry: (entry: Omit<LeaderboardEntry, 'achievedAt'>) => void;
  reset: () => void;
}

const emptyCorrectByMode: Record<QuizMode, number> = {
  quotes: 0,
  blurryCharacter: 0,
  spellVsVillain: 0,
  sortingHat: 0,
  guessCreature: 0,
  finishDialogue: 0,
  guessCharacter: 0,
};

const initialStats: ProgressionStats = {
  totalXp: 0,
  correctByMode: emptyCorrectByMode,
  bestStreak: 0,
  unlockedAchievementIds: [],
};

export const useProgression = create<ProgressionState>()(
  persist(
    (set, get) => ({
      ...initialStats,
      leaderboard: [],

      recordAnswer: (mode, difficulty, correct) => {
        const state = get();
        const nextStats: ProgressionStats = {
          totalXp: state.totalXp + (correct ? xpForAnswer(difficulty) : 0),
          correctByMode: correct
            ? { ...state.correctByMode, [mode]: state.correctByMode[mode] + 1 }
            : state.correctByMode,
          bestStreak: state.bestStreak,
          unlockedAchievementIds: state.unlockedAchievementIds,
        };

        const newlyUnlocked = checkNewAchievements(nextStats);
        set({
          totalXp: nextStats.totalXp,
          correctByMode: nextStats.correctByMode,
          unlockedAchievementIds: newlyUnlocked.length
            ? [...nextStats.unlockedAchievementIds, ...newlyUnlocked.map((a) => a.id)]
            : nextStats.unlockedAchievementIds,
        });
        return newlyUnlocked;
      },

      recordStreak: (streak) => {
        set((state) => ({ bestStreak: Math.max(state.bestStreak, streak) }));
      },

      addLeaderboardEntry: (entry) => {
        set((state) => ({
          leaderboard: [...state.leaderboard, { ...entry, achievedAt: new Date().toISOString() }]
            .sort((a, b) => b.score - a.score)
            .slice(0, 50),
        }));
      },

      reset: () => set({ ...initialStats, leaderboard: [] }),
    }),
    { name: 'hp-quiz-progression' },
  ),
);

export function selectLevel(state: ProgressionState): number {
  return levelForXp(state.totalXp);
}
