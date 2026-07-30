import { beforeEach, describe, expect, it } from 'vitest';
import { useProgression } from './useProgression';

describe('useProgression', () => {
  beforeEach(() => {
    useProgression.getState().reset();
  });

  it('awards XP and increments per-mode correct count on a correct answer', () => {
    useProgression.getState().recordAnswer('quotes', 'easy', true);
    const state = useProgression.getState();
    expect(state.totalXp).toBe(10);
    expect(state.correctByMode.quotes).toBe(1);
  });

  it('awards no XP and no correct-count increment on a wrong answer', () => {
    useProgression.getState().recordAnswer('quotes', 'hard', false);
    const state = useProgression.getState();
    expect(state.totalXp).toBe(0);
    expect(state.correctByMode.quotes).toBe(0);
  });

  it('unlocks an achievement exactly once when its threshold is crossed', () => {
    for (let i = 0; i < 49; i++) {
      useProgression.getState().recordAnswer('quotes', 'easy', true);
    }
    expect(useProgression.getState().unlockedAchievementIds).not.toContain('quote-master');

    const unlocked = useProgression.getState().recordAnswer('quotes', 'easy', true);
    expect(unlocked.map((a) => a.id)).toContain('quote-master');
    expect(useProgression.getState().unlockedAchievementIds).toContain('quote-master');

    const againUnlocked = useProgression.getState().recordAnswer('quotes', 'easy', true);
    expect(againUnlocked.map((a) => a.id)).not.toContain('quote-master');
  });

  it('keeps the leaderboard sorted descending and capped at 50 entries', () => {
    for (let i = 0; i < 55; i++) {
      useProgression.getState().addLeaderboardEntry({ name: `p${i}`, score: i, mode: 'quotes' });
    }
    const board = useProgression.getState().leaderboard;
    expect(board).toHaveLength(50);
    expect(board[0].score).toBeGreaterThanOrEqual(board[board.length - 1].score);
  });
});
