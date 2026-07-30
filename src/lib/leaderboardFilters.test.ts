import { describe, expect, it } from 'vitest';
import { isWithinPastWeek } from './leaderboardFilters';

describe('isWithinPastWeek', () => {
  const now = new Date('2026-07-30T12:00:00Z').getTime();

  it('is true for a timestamp from a few hours ago', () => {
    expect(isWithinPastWeek(new Date(now - 3 * 60 * 60 * 1000).toISOString(), now)).toBe(true);
  });

  it('is true for a timestamp exactly at the 7-day boundary', () => {
    expect(isWithinPastWeek(new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(), now)).toBe(true);
  });

  it('is false for a timestamp older than 7 days', () => {
    expect(isWithinPastWeek(new Date(now - 8 * 24 * 60 * 60 * 1000).toISOString(), now)).toBe(false);
  });
});
