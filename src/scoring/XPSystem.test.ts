import { describe, expect, it } from 'vitest';
import { isDifficultyUnlocked, levelForXp, xpForAnswer, xpIntoCurrentLevel } from './XPSystem';

describe('XPSystem', () => {
  it('awards more XP for harder difficulties', () => {
    expect(xpForAnswer('easy')).toBeLessThan(xpForAnswer('medium'));
    expect(xpForAnswer('medium')).toBeLessThan(xpForAnswer('hard'));
  });

  it('computes level from total XP', () => {
    expect(levelForXp(0)).toBe(1);
    expect(levelForXp(99)).toBe(1);
    expect(levelForXp(100)).toBe(2);
    expect(levelForXp(250)).toBe(3);
  });

  it('computes progress into the current level', () => {
    expect(xpIntoCurrentLevel(150)).toEqual({ current: 50, required: 100 });
  });

  it('gates medium/hard difficulty behind level thresholds', () => {
    expect(isDifficultyUnlocked(0, 'easy')).toBe(true);
    expect(isDifficultyUnlocked(0, 'medium')).toBe(false);
    expect(isDifficultyUnlocked(0, 'hard')).toBe(false);
    expect(isDifficultyUnlocked(200, 'medium')).toBe(true);
    expect(isDifficultyUnlocked(200, 'hard')).toBe(false);
    expect(isDifficultyUnlocked(500, 'hard')).toBe(true);
  });
});
