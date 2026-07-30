import { describe, expect, it } from 'vitest';
import { QuestionEngine } from './QuestionEngine';

interface Item {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const dataset: Item[] = [
  { id: 'a', difficulty: 'easy' },
  { id: 'b', difficulty: 'easy' },
  { id: 'c', difficulty: 'easy' },
  { id: 'd', difficulty: 'hard' },
];

describe('QuestionEngine', () => {
  it('never repeats an item within a difficulty until the pool is exhausted', () => {
    const engine = new QuestionEngine(dataset);
    const seen = new Set<string>();
    for (let i = 0; i < 3; i++) {
      const item = engine.next('easy');
      expect(item).not.toBeNull();
      expect(seen.has(item!.id)).toBe(false);
      seen.add(item!.id);
    }
    expect(seen.size).toBe(3);
  });

  it('reshuffles and reuses items once the pool is exhausted', () => {
    const engine = new QuestionEngine(dataset);
    for (let i = 0; i < 3; i++) engine.next('easy');
    const next = engine.next('easy');
    expect(next).not.toBeNull();
    expect(['a', 'b', 'c']).toContain(next!.id);
  });

  it('returns null for a difficulty with no items', () => {
    const engine = new QuestionEngine(dataset);
    expect(engine.next('medium')).toBeNull();
  });

  it('keeps difficulty pools independent', () => {
    const engine = new QuestionEngine(dataset);
    const hard = engine.next('hard');
    expect(hard?.id).toBe('d');
  });

  it('reset clears seen state', () => {
    const engine = new QuestionEngine(dataset);
    engine.next('hard');
    engine.reset();
    expect(engine.next('hard')?.id).toBe('d');
  });
});
