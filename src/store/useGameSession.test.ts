import { beforeEach, describe, expect, it } from 'vitest';
import { selectAccuracy, useGameSession } from './useGameSession';
import { useProgression } from './useProgression';
import type { Attempt } from '../engine/types';

describe('useGameSession', () => {
  beforeEach(() => {
    useGameSession.getState().start('quotes');
    useProgression.getState().reset();
  });

  it('accumulates score and correct/total counts across answers', () => {
    const correct: Attempt = {
      mode: 'quotes',
      questionId: 'q1',
      difficulty: 'easy',
      correct: true,
    };
    const wrong: Attempt = { ...correct, questionId: 'q2', correct: false };

    useGameSession.getState().submitAnswer(correct);
    useGameSession.getState().submitAnswer(wrong);

    const state = useGameSession.getState();
    expect(state.totalCount).toBe(2);
    expect(state.correctCount).toBe(1);
    expect(state.score).toBeGreaterThan(0);
    expect(selectAccuracy(state)).toBe(0.5);
  });

  it('resets the streak to 0 after an incorrect answer, then rebuilds it', () => {
    const attempt: Attempt = {
      mode: 'quotes',
      questionId: 'q1',
      difficulty: 'easy',
      correct: true,
    };
    useGameSession.getState().submitAnswer(attempt);
    useGameSession.getState().submitAnswer(attempt);
    expect(useGameSession.getState().currentStreak).toBe(2);

    useGameSession.getState().submitAnswer({ ...attempt, correct: false });
    expect(useGameSession.getState().currentStreak).toBe(0);

    useGameSession.getState().submitAnswer(attempt);
    expect(useGameSession.getState().currentStreak).toBe(1);
    expect(useGameSession.getState().bestStreakThisSession).toBe(2);
  });

  it('awards a higher-multiplier score for later answers in a growing streak', () => {
    const attempt: Attempt = {
      mode: 'quotes',
      questionId: 'q1',
      difficulty: 'easy',
      correct: true,
    };
    const first = useGameSession.getState().submitAnswer({ ...attempt, questionId: 'q1' });
    const second = useGameSession.getState().submitAnswer({ ...attempt, questionId: 'q2' });
    expect(second.points).toBeGreaterThan(first.points);
  });

  it('forwards correct answers to useProgression for XP tracking', () => {
    useGameSession.getState().submitAnswer({
      mode: 'quotes',
      questionId: 'q1',
      difficulty: 'medium',
      correct: true,
    });
    expect(useProgression.getState().totalXp).toBe(20);
  });

  it('start() resets session fields for a new run', () => {
    useGameSession.getState().submitAnswer({
      mode: 'quotes',
      questionId: 'q1',
      difficulty: 'easy',
      correct: true,
    });
    useGameSession.getState().start('sortingHat');
    const state = useGameSession.getState();
    expect(state.mode).toBe('sortingHat');
    expect(state.score).toBe(0);
    expect(state.totalCount).toBe(0);
  });
});
