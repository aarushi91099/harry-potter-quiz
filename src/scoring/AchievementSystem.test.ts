import { describe, expect, it } from 'vitest';
import { checkNewAchievements } from './AchievementSystem';
import type { ProgressionStats } from './types';

function baseStats(overrides: Partial<ProgressionStats> = {}): ProgressionStats {
  return {
    totalXp: 0,
    correctByMode: {
      quotes: 0,
      blurryCharacter: 0,
      spellVsVillain: 0,
      sortingHat: 0,
      guessCreature: 0,
      finishDialogue: 0,
      guessCharacter: 0,
    },
    bestStreak: 0,
    unlockedAchievementIds: [],
    ...overrides,
  };
}

describe('checkNewAchievements', () => {
  it('returns no achievements when thresholds are unmet', () => {
    expect(checkNewAchievements(baseStats())).toHaveLength(0);
  });

  it('unlocks Quote Master at 50 correct quotes', () => {
    const stats = baseStats({
      correctByMode: { ...baseStats().correctByMode, quotes: 50 },
    });
    const unlocked = checkNewAchievements(stats);
    expect(unlocked.map((a) => a.id)).toContain('quote-master');
  });

  it('does not re-return an already-unlocked achievement', () => {
    const stats = baseStats({
      correctByMode: { ...baseStats().correctByMode, quotes: 50 },
      unlockedAchievementIds: ['quote-master'],
    });
    expect(checkNewAchievements(stats)).toHaveLength(0);
  });

  it('unlocks Hogwarts Champion at a 20-answer streak', () => {
    const stats = baseStats({ bestStreak: 20 });
    expect(checkNewAchievements(stats).map((a) => a.id)).toContain('hogwarts-champion');
  });
});
