import { describe, expect, it } from 'vitest';
import { characters, charactersById } from './characters';
import { quotes } from './quotes';
import { spells, spellsById } from './spells';
import { spellScenarios } from './spellScenarios';
import { creatures } from './creatures';
import { dialogues } from './dialogues';

describe('seed datasets', () => {
  it('every quote references a real character', () => {
    for (const quote of quotes) {
      expect(charactersById.has(quote.characterId)).toBe(true);
    }
  });

  it('every spell scenario references a real spell', () => {
    for (const scenario of spellScenarios) {
      expect(spellsById.has(scenario.correctSpellId)).toBe(true);
    }
  });

  it('has no duplicate ids within each dataset', () => {
    for (const dataset of [characters, quotes, spells, spellScenarios, creatures, dialogues]) {
      const ids = dataset.map((item) => item.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('every character has a cropped character-images asset', () => {
    for (const item of characters) {
      expect(item.imageUrl).toBe(`/character-images/${item.id}.png`);
    }
  });

  it('every creature has a generated placeholder image', () => {
    for (const item of creatures) {
      expect(item.imageUrl.startsWith('data:image/svg+xml')).toBe(true);
    }
  });

  it('has no duplicate character or creature names', () => {
    for (const dataset of [characters, creatures]) {
      const names = dataset.map((item) => item.name);
      expect(new Set(names).size).toBe(names.length);
    }
  });

  it('has no duplicate quote text or dialogue partials', () => {
    expect(new Set(quotes.map((q) => q.text)).size).toBe(quotes.length);
    expect(new Set(dialogues.map((d) => d.partial)).size).toBe(dialogues.length);
  });

  it('meets Phase 5 minimum content targets', () => {
    expect(characters.length).toBeGreaterThanOrEqual(60);
    expect(quotes.length).toBeGreaterThanOrEqual(20);
    expect(spells.length).toBeGreaterThanOrEqual(20);
    expect(spellScenarios.length).toBeGreaterThanOrEqual(18);
    expect(creatures.length).toBeGreaterThanOrEqual(18);
    expect(dialogues.length).toBeGreaterThanOrEqual(16);
  });
});
