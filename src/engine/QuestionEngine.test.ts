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

  describe('nextAny', () => {
    it('draws from the whole dataset regardless of difficulty, without repeats until exhausted', () => {
      const engine = new QuestionEngine(dataset);
      const seen = new Set<string>();
      for (let i = 0; i < 4; i++) {
        const item = engine.nextAny();
        expect(item).not.toBeNull();
        expect(seen.has(item!.id)).toBe(false);
        seen.add(item!.id);
      }
      expect(seen).toEqual(new Set(['a', 'b', 'c', 'd']));
    });

    it('reshuffles and reuses items once the pool is exhausted', () => {
      const engine = new QuestionEngine(dataset);
      for (let i = 0; i < 4; i++) engine.nextAny();
      const next = engine.nextAny();
      expect(next).not.toBeNull();
      expect(['a', 'b', 'c', 'd']).toContain(next!.id);
    });

    it('keeps its own seen-tracking independent from next(difficulty)', () => {
      const engine = new QuestionEngine(dataset);
      engine.next('easy');
      engine.next('easy');
      engine.next('easy');
      // next('easy') has now exhausted all 3 easy items, but nextAny() should still see all 4 as fresh.
      const seenViaAny = new Set<string>();
      for (let i = 0; i < 4; i++) seenViaAny.add(engine.nextAny()!.id);
      expect(seenViaAny).toEqual(new Set(['a', 'b', 'c', 'd']));
    });

    it('reset clears nextAny seen state too', () => {
      const engine = new QuestionEngine(dataset);
      for (let i = 0; i < 4; i++) engine.nextAny();
      engine.reset();
      const seen = new Set<string>();
      for (let i = 0; i < 4; i++) seen.add(engine.nextAny()!.id);
      expect(seen).toEqual(new Set(['a', 'b', 'c', 'd']));
    });
  });
});
