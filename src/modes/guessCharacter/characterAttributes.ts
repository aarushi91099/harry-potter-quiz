import type { Character } from '../../data/types';

export type AttributeStatus = 'correct' | 'partial' | 'incorrect' | 'higher' | 'lower' | 'unknown';

export interface AttributeResult {
  key: string;
  label: string;
  display: string;
  status: AttributeStatus;
}

interface AttributeColumn {
  key: string;
  label: string;
  display: (c: Character) => string;
  compare: (guess: Character, target: Character) => AttributeStatus;
}

/** Human-readable legend text for each comparison status, reused by the on-screen key. */
export const STATUS_LABEL: Record<AttributeStatus, string> = {
  correct: 'Correct',
  partial: 'Partial match',
  incorrect: 'Incorrect',
  higher: 'Later book',
  lower: 'Earlier book',
  unknown: 'Unknown',
};

function exactMatch(get: (c: Character) => string | undefined) {
  return (guess: Character, target: Character): AttributeStatus => {
    const g = get(guess);
    const t = get(target);
    if (!g || !t) return 'unknown';
    return g === t ? 'correct' : 'incorrect';
  };
}

function setOverlap(get: (c: Character) => string[] | undefined) {
  return (guess: Character, target: Character): AttributeStatus => {
    const g = get(guess) ?? [];
    const t = get(target) ?? [];
    if (g.length === 0 || t.length === 0) return 'unknown';
    const tSet = new Set(t);
    const sameSet = g.length === t.length && g.every((v) => tSet.has(v));
    if (sameSet) return 'correct';
    return g.some((v) => tSet.has(v)) ? 'partial' : 'incorrect';
  };
}

/** Chronological order + a compact label for each book, powering the "earlier/later" arrows. */
const BOOKS = [
  { title: "Harry Potter and the Philosopher's Stone", order: 1, short: 'Book 1 · Stone' },
  { title: 'Harry Potter and the Chamber of Secrets', order: 2, short: 'Book 2 · Chamber' },
  { title: 'Harry Potter and the Prisoner of Azkaban', order: 3, short: 'Book 3 · Azkaban' },
  { title: 'Harry Potter and the Goblet of Fire', order: 4, short: 'Book 4 · Goblet' },
  { title: 'Harry Potter and the Order of the Phoenix', order: 5, short: 'Book 5 · Phoenix' },
  { title: 'Harry Potter and the Half-Blood Prince', order: 6, short: 'Book 6 · Prince' },
  { title: 'Harry Potter and the Deathly Hallows', order: 7, short: 'Book 7 · Hallows' },
] as const;
const BOOK_BY_TITLE = new Map<string, (typeof BOOKS)[number]>(BOOKS.map((b) => [b.title, b]));

function firstAppearanceDisplay(c: Character): string {
  if (!c.firstAppearance) return '—';
  return BOOK_BY_TITLE.get(c.firstAppearance)?.short ?? c.firstAppearance;
}

function compareFirstAppearance(guess: Character, target: Character): AttributeStatus {
  const g = guess.firstAppearance ? BOOK_BY_TITLE.get(guess.firstAppearance)?.order : undefined;
  const t = target.firstAppearance ? BOOK_BY_TITLE.get(target.firstAppearance)?.order : undefined;
  if (g == null || t == null) return 'unknown';
  if (g === t) return 'correct';
  return g < t ? 'higher' : 'lower';
}

/**
 * The trait columns shown in the guess grid, in display order. Each character-identifying
 * mode that wants a Wordle-style "compare against the target" board can reuse this list.
 */
export const ATTRIBUTE_COLUMNS: AttributeColumn[] = [
  { key: 'gender', label: 'Gender', display: (c) => c.gender ?? '—', compare: exactMatch((c) => c.gender) },
  { key: 'house', label: 'House', display: (c) => c.house ?? '—', compare: exactMatch((c) => c.house) },
  {
    key: 'bloodStatus',
    label: 'Blood Status',
    display: (c) => c.bloodStatus ?? '—',
    compare: exactMatch((c) => c.bloodStatus),
  },
  {
    key: 'affiliation',
    label: 'Affiliation',
    display: (c) => (c.affiliation?.length ? c.affiliation.join(', ') : '—'),
    compare: setOverlap((c) => c.affiliation),
  },
  {
    key: 'occupation',
    label: 'Occupation',
    display: (c) => c.occupation ?? '—',
    compare: exactMatch((c) => c.occupation),
  },
  { key: 'patronus', label: 'Patronus', display: (c) => c.patronus ?? '—', compare: exactMatch((c) => c.patronus) },
  { key: 'origin', label: 'Origin', display: (c) => c.origin ?? '—', compare: exactMatch((c) => c.origin) },
  {
    key: 'firstAppearance',
    label: 'First Appearance',
    display: firstAppearanceDisplay,
    compare: compareFirstAppearance,
  },
];

/** Compares a guessed character against the target across every trait column, for one guess-grid row. */
export function compareCharacterGuess(guess: Character, target: Character): AttributeResult[] {
  return ATTRIBUTE_COLUMNS.map((column) => ({
    key: column.key,
    label: column.label,
    display: column.display(guess),
    status: column.compare(guess, target),
  }));
}
