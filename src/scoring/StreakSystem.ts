const MULTIPLIER_PER_STREAK_STEP = 0.1;
const MAX_MULTIPLIER_STEPS = 10; // caps the multiplier at 2x

/** Pure streak->multiplier formula, shared by the StreakSystem class and any store that tracks streak as plain state. */
export function multiplierForStreak(streak: number): number {
  const steps = Math.min(streak, MAX_MULTIPLIER_STEPS);
  return 1 + steps * MULTIPLIER_PER_STREAK_STEP;
}

/**
 * Tracks a consecutive-correct-answer streak and the score multiplier it grants.
 * Session-scoped: callers reset it at the start of each new quiz session.
 */
export class StreakSystem {
  private streak = 0;
  private best = 0;

  /** Records an answer's correctness and returns the multiplier to apply to that answer's points. */
  record(correct: boolean): number {
    if (correct) {
      this.streak += 1;
      this.best = Math.max(this.best, this.streak);
    } else {
      this.streak = 0;
    }
    return this.currentMultiplier;
  }

  get currentStreak(): number {
    return this.streak;
  }

  get bestStreak(): number {
    return this.best;
  }

  get currentMultiplier(): number {
    return multiplierForStreak(this.streak);
  }

  reset(): void {
    this.streak = 0;
  }
}
