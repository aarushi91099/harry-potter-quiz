import { describe, expect, it } from 'vitest';
import { computeScore, scoreAttempt } from './ScoreCalculator';
import type { Attempt } from '../engine/types';

describe('computeScore', () => {
  it('awards flat base points for non-time/clue modes', () => {
    expect(computeScore('quotes', { difficulty: 'easy' })).toBe(100);
    expect(computeScore('guessHouse', { difficulty: 'medium' })).toBe(150);
    expect(computeScore('finishDialogue', { difficulty: 'hard' })).toBe(200);
  });

  it('scales blurryCharacter/guessCreature score with earliness', () => {
    const instant = computeScore('blurryCharacter', { difficulty: 'easy', earliness: 1 });
    const late = computeScore('blurryCharacter', { difficulty: 'easy', earliness: 0 });
    expect(instant).toBeGreaterThan(late);
    expect(late).toBe(100); // still at least base points at full reveal
  });

  it('gives spellVsVillain a speed bonus for fast answers', () => {
    const fast = computeScore('spellVsVillain', {
      difficulty: 'medium',
      elapsedMs: 0,
      timeLimitMs: 10_000,
    });
    const slow = computeScore('spellVsVillain', {
      difficulty: 'medium',
      elapsedMs: 10_000,
      timeLimitMs: 10_000,
    });
    expect(fast).toBeGreaterThan(slow);
    expect(slow).toBe(150);
  });

  it('reduces guessCharacter score as more clues are revealed', () => {
    const firstClue = computeScore('guessCharacter', { difficulty: 'medium', cluesRevealed: 1 });
    const fourthClue = computeScore('guessCharacter', { difficulty: 'medium', cluesRevealed: 4 });
    expect(firstClue).toBeGreaterThan(fourthClue);
    expect(firstClue).toBe(150);
  });
});

describe('scoreAttempt', () => {
  it('returns 0 for an incorrect attempt regardless of context', () => {
    const attempt: Attempt = {
      mode: 'quotes',
      questionId: 'q1',
      difficulty: 'hard',
      correct: false,
    };
    expect(scoreAttempt(attempt)).toBe(0);
  });

  it('delegates to computeScore for a correct attempt', () => {
    const attempt: Attempt = {
      mode: 'guessHouse',
      questionId: 'q2',
      difficulty: 'easy',
      correct: true,
    };
    expect(scoreAttempt(attempt)).toBe(100);
  });
});
