export interface Clue {
  category: string;
  value: string;
}

/**
 * Tracks progressive clue reveal for a single question. Score decreases the more
 * clues are revealed before a correct guess, so the engine only exposes clues
 * up to `revealedCount` and lets the caller advance one at a time.
 */
export class ClueEngine {
  private readonly clues: Clue[];
  private revealedCount = 1;

  constructor(clues: Clue[]) {
    if (clues.length === 0) {
      throw new Error('ClueEngine requires at least one clue');
    }
    this.clues = clues;
  }

  get visibleClues(): Clue[] {
    return this.clues.slice(0, this.revealedCount);
  }

  get cluesRevealed(): number {
    return this.revealedCount;
  }

  get hasMoreClues(): boolean {
    return this.revealedCount < this.clues.length;
  }

  revealNext(): Clue | null {
    if (!this.hasMoreClues) return null;
    const clue = this.clues[this.revealedCount];
    this.revealedCount += 1;
    return clue;
  }

  reset(): void {
    this.revealedCount = 1;
  }
}
