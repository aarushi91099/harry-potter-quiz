import { describe, expect, it } from 'vitest';
import { StreakSystem } from './StreakSystem';

describe('StreakSystem', () => {
  it('increments streak on correct answers and resets on incorrect', () => {
    const streaks = new StreakSystem();
    streaks.record(true);
    streaks.record(true);
    expect(streaks.currentStreak).toBe(2);
    streaks.record(false);
    expect(streaks.currentStreak).toBe(0);
  });

  it('tracks the best streak across resets', () => {
    const streaks = new StreakSystem();
    streaks.record(true);
    streaks.record(true);
    streaks.record(true);
    streaks.record(false);
    streaks.record(true);
    expect(streaks.bestStreak).toBe(3);
  });

  it('increases the multiplier by 0.1 per streak step, capped at 2x', () => {
    const streaks = new StreakSystem();
    expect(streaks.currentMultiplier).toBe(1);
    for (let i = 0; i < 5; i++) streaks.record(true);
    expect(streaks.currentMultiplier).toBeCloseTo(1.5);
    for (let i = 0; i < 20; i++) streaks.record(true);
    expect(streaks.currentMultiplier).toBe(2);
  });
});
