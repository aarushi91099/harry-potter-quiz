import { describe, expect, it } from 'vitest';
import { ClueEngine } from './ClueEngine';

const clues = [
  { category: 'Gender', value: 'Male' },
  { category: 'Affiliation', value: 'Order of the Phoenix' },
  { category: 'Magical Ability', value: 'Can transform into a black dog' },
  { category: 'Known For', value: "Harry Potter's godfather" },
];

describe('ClueEngine', () => {
  it('starts with exactly one clue visible', () => {
    const engine = new ClueEngine(clues);
    expect(engine.visibleClues).toHaveLength(1);
    expect(engine.cluesRevealed).toBe(1);
  });

  it('reveals one additional clue at a time', () => {
    const engine = new ClueEngine(clues);
    engine.revealNext();
    expect(engine.visibleClues).toHaveLength(2);
    expect(engine.visibleClues[1].category).toBe('Affiliation');
  });

  it('stops revealing once all clues are shown', () => {
    const engine = new ClueEngine(clues);
    engine.revealNext();
    engine.revealNext();
    engine.revealNext();
    expect(engine.hasMoreClues).toBe(false);
    expect(engine.revealNext()).toBeNull();
    expect(engine.visibleClues).toHaveLength(4);
  });

  it('reset returns to one visible clue', () => {
    const engine = new ClueEngine(clues);
    engine.revealNext();
    engine.reset();
    expect(engine.cluesRevealed).toBe(1);
  });

  it('throws when constructed with no clues', () => {
    expect(() => new ClueEngine([])).toThrow();
  });
});
