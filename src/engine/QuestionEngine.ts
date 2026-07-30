import type { Difficulty } from './types';
import { shuffle } from '../lib/random';

interface HasDifficulty {
  id: string;
  difficulty: Difficulty;
}

/**
 * Mode-agnostic question picker: filters a dataset by difficulty, then hands out
 * items from a shuffled pool without repeats until the pool is exhausted, at which
 * point it reshuffles. Keeps one independent pool per (difficulty) so switching
 * difficulty mid-session doesn't bleed "already seen" state across pools.
 */
export class QuestionEngine<T extends HasDifficulty> {
  private readonly dataset: T[];
  private readonly byDifficulty: Map<Difficulty, T[]>;
  private readonly pools = new Map<Difficulty, T[]>();
  private readonly seen = new Set<string>();
  private anyPool: T[] = [];
  private readonly anySeen = new Set<string>();

  constructor(dataset: T[]) {
    this.dataset = dataset;
    this.byDifficulty = new Map();
    for (const item of dataset) {
      const bucket = this.byDifficulty.get(item.difficulty) ?? [];
      bucket.push(item);
      this.byDifficulty.set(item.difficulty, bucket);
    }
  }

  /** Returns the next question for the given difficulty, or null if the dataset has none left unseen this session. */
  next(difficulty: Difficulty): T | null {
    let pool = this.pools.get(difficulty);
    if (!pool || pool.length === 0) {
      const source = this.byDifficulty.get(difficulty) ?? [];
      const unseen = source.filter((item) => !this.seen.has(item.id));
      // Once every item in this difficulty has been seen this session, reshuffle the full set.
      pool = shuffle(unseen.length > 0 ? unseen : source);
    }

    const item = pool.pop();
    this.pools.set(difficulty, pool);
    if (!item) return null;

    this.seen.add(item.id);
    return item;
  }

  /** Like next(), but ignores difficulty entirely and draws from the whole dataset as one pool. */
  nextAny(): T | null {
    if (this.anyPool.length === 0) {
      const unseen = this.dataset.filter((item) => !this.anySeen.has(item.id));
      this.anyPool = shuffle(unseen.length > 0 ? unseen : this.dataset);
    }

    const item = this.anyPool.pop();
    if (!item) return null;

    this.anySeen.add(item.id);
    return item;
  }

  reset(): void {
    this.pools.clear();
    this.seen.clear();
    this.anyPool = [];
    this.anySeen.clear();
  }

  get totalCount(): number {
    return this.dataset.length;
  }
}
