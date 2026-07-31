import { describe, expect, it } from 'vitest';
import { sortingHatQuestions } from './sortingHatQuestions';

const HOUSES = ['Gryffindor', 'Ravenclaw', 'Hufflepuff', 'Slytherin'];

describe('sortingHatQuestions', () => {
  it('has between 15 and 20 questions', () => {
    expect(sortingHatQuestions.length).toBeGreaterThanOrEqual(15);
    expect(sortingHatQuestions.length).toBeLessThanOrEqual(20);
  });

  it('has no duplicate question ids', () => {
    const ids = sortingHatQuestions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every question has exactly 4 options covering all 4 houses', () => {
    for (const question of sortingHatQuestions) {
      expect(question.options).toHaveLength(4);
      const houses = new Set(question.options.map((o) => o.house));
      expect(houses).toEqual(new Set(HOUSES));
    }
  });
});
