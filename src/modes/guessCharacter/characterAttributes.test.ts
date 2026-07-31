import { describe, expect, it } from 'vitest';
import type { Character } from '../../data/types';
import { compareCharacterGuess } from './characterAttributes';

function character(overrides: Partial<Character>): Character {
  return {
    id: 'test',
    name: 'Test Character',
    aliases: [],
    imageUrl: 'x',
    difficulty: 'easy',
    ...overrides,
  };
}

function statusOf(results: ReturnType<typeof compareCharacterGuess>, key: string) {
  return results.find((r) => r.key === key)?.status;
}

describe('compareCharacterGuess', () => {
  const target = character({
    id: 'target',
    gender: 'Female',
    house: 'Gryffindor',
    bloodStatus: 'Muggle-born',
    affiliation: ['Order of the Phoenix', "Dumbledore's Army"],
    occupation: 'Ministry official',
    patronus: 'Otter',
    origin: 'London',
    firstAppearance: 'Harry Potter and the Goblet of Fire',
  });

  it('marks identical fields as correct', () => {
    const results = compareCharacterGuess(target, target);
    expect(statusOf(results, 'gender')).toBe('correct');
    expect(statusOf(results, 'house')).toBe('correct');
    expect(statusOf(results, 'affiliation')).toBe('correct');
    expect(statusOf(results, 'firstAppearance')).toBe('correct');
  });

  it('marks mismatched scalar fields as incorrect', () => {
    const guess = character({ id: 'g', gender: 'Male', house: 'Slytherin' });
    const results = compareCharacterGuess(guess, target);
    expect(statusOf(results, 'gender')).toBe('incorrect');
    expect(statusOf(results, 'house')).toBe('incorrect');
  });

  it('marks missing fields on either side as unknown', () => {
    const guess = character({ id: 'g' });
    const results = compareCharacterGuess(guess, target);
    expect(statusOf(results, 'patronus')).toBe('unknown');
  });

  it('marks overlapping-but-not-identical affiliations as partial', () => {
    const guess = character({ id: 'g', affiliation: ['Order of the Phoenix', 'Hogwarts'] });
    const results = compareCharacterGuess(guess, target);
    expect(statusOf(results, 'affiliation')).toBe('partial');
  });

  it('marks non-overlapping affiliations as incorrect', () => {
    const guess = character({ id: 'g', affiliation: ['Death Eaters'] });
    const results = compareCharacterGuess(guess, target);
    expect(statusOf(results, 'affiliation')).toBe('incorrect');
  });

  it('points higher when the guessed book comes before the target book', () => {
    const guess = character({ id: 'g', firstAppearance: "Harry Potter and the Philosopher's Stone" });
    const results = compareCharacterGuess(guess, target);
    expect(statusOf(results, 'firstAppearance')).toBe('higher');
  });

  it('points lower when the guessed book comes after the target book', () => {
    const guess = character({ id: 'g', firstAppearance: 'Harry Potter and the Deathly Hallows' });
    const results = compareCharacterGuess(guess, target);
    expect(statusOf(results, 'firstAppearance')).toBe('lower');
  });
});
