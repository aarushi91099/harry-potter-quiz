import { describe, expect, it } from 'vitest';
import { createSearchIndex } from './searchIndex';

interface Item {
  id: string;
  name: string;
  aliases: string[];
}

const items: Item[] = [
  { id: '1', name: 'Harry Potter', aliases: ['The Boy Who Lived'] },
  { id: '2', name: 'Hermione Granger', aliases: [] },
  { id: '3', name: 'Tom Riddle', aliases: ['Lord Voldemort', 'You-Know-Who'] },
];

describe('createSearchIndex', () => {
  const index = createSearchIndex(
    items,
    (i) => i.name,
    (i) => i.aliases,
  );

  it('returns all items for an empty query', () => {
    expect(index.search('')).toHaveLength(3);
  });

  it('matches by name substring', () => {
    const results = index.search('potter');
    expect(results.map((r) => r.id)).toEqual(['1']);
  });

  it('matches by alias', () => {
    const results = index.search('voldemort');
    expect(results.map((r) => r.id)).toEqual(['3']);
  });

  it('ranks exact/prefix matches above generic substring matches', () => {
    const results = index.search('her');
    expect(results[0].id).toBe('2'); // "Hermione" starts with "her"
  });

  it('returns nothing for a query matching no one', () => {
    expect(index.search('nargles')).toHaveLength(0);
  });
});
