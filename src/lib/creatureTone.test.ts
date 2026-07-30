import { describe, expect, it } from 'vitest';
import { playCreatureTone } from './creatureTone';

describe('playCreatureTone', () => {
  it('does not throw when Web Audio is unavailable (e.g. in jsdom)', () => {
    expect(() => playCreatureTone('hippogriff')).not.toThrow();
  });

  it('does not throw for any seed value', () => {
    for (const seed of ['niffler', 'basilisk', '', 'a-very-long-creature-name-indeed']) {
      expect(() => playCreatureTone(seed)).not.toThrow();
    }
  });
});
