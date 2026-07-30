import { describe, expect, it } from 'vitest';
import { answersMatch } from './normalizeAnswer';

describe('answersMatch', () => {
  it('matches regardless of case', () => {
    expect(answersMatch('Harry', 'harry')).toBe(true);
  });

  it('matches regardless of surrounding whitespace', () => {
    expect(answersMatch('  good ', 'good')).toBe(true);
  });

  it('ignores punctuation', () => {
    expect(answersMatch('Always.', 'always')).toBe(true);
  });

  it('does not match a different word', () => {
    expect(answersMatch('dark', 'light')).toBe(false);
  });
});
