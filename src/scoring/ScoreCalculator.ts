import type { Attempt } from '../engine/types';
import type { ScoreContext } from './types';

const BASE_POINTS: Record<ScoreContext['difficulty'], number> = {
  easy: 100,
  medium: 150,
  hard: 200,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Central, mode-aware scoring rules. Kept separate from the quiz UI so scoring
 * changes (rebalancing bonuses, adding a mode) don't touch component code, and
 * so each rule is unit-testable in isolation.
 */
export function computeScore(mode: Attempt['mode'], ctx: ScoreContext): number {
  const base = BASE_POINTS[ctx.difficulty];

  switch (mode) {
    case 'quotes':
    case 'guessHouse':
    case 'finishDialogue':
      return base;

    case 'blurryCharacter':
    case 'guessCreature': {
      // Earlier guesses (less revealed) score up to 2x a "guessed at full reveal" answer.
      const earliness = clamp(ctx.earliness ?? 0, 0, 1);
      return Math.round(base * (0.5 + 0.5 * earliness) * 2);
    }

    case 'spellVsVillain': {
      const speedFactor =
        ctx.timeLimitMs && ctx.elapsedMs != null
          ? clamp(1 - ctx.elapsedMs / ctx.timeLimitMs, 0, 1)
          : 0;
      return Math.round(base * (1 + 0.5 * speedFactor));
    }

    case 'guessCharacter': {
      const guessCount = ctx.guessCount ?? 1;
      const decayPerExtraGuess = 0.15;
      const factor = clamp(1 - (guessCount - 1) * decayPerExtraGuess, 0.25, 1);
      return Math.round(base * factor);
    }

    default:
      return base;
  }
}

/** Score for a graded Attempt: 0 if incorrect, otherwise the mode's scoring rule applied to its context. */
export function scoreAttempt(attempt: Attempt): number {
  if (!attempt.correct) return 0;
  return computeScore(attempt.mode, {
    difficulty: attempt.difficulty,
    ...(attempt.context as unknown as Partial<ScoreContext> | undefined),
  });
}
