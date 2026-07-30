function normalize(value: string): string {
  return value.trim().toLowerCase();
}

/**
 * Small normalized substring search over an item's name + aliases. Fine for
 * catalogs in the low hundreds; swap for a fuzzy library (e.g. Fuse.js) if the
 * full character universe (thousands of entries) makes substring scans too slow.
 */
export function createSearchIndex<T>(
  items: readonly T[],
  getName: (item: T) => string,
  getAliases: (item: T) => string[] = () => [],
) {
  const entries = items.map((item) => ({
    item,
    haystacks: [getName(item), ...getAliases(item)].map(normalize),
  }));

  return {
    search(query: string, limit = 20): T[] {
      const q = normalize(query);
      if (!q) return items.slice(0, limit);

      const scored = entries
        .map(({ item, haystacks }) => {
          let best = -1;
          for (const haystack of haystacks) {
            if (haystack === q) {
              best = Math.max(best, 100);
            } else if (haystack.startsWith(q)) {
              best = Math.max(best, 75);
            } else if (haystack.includes(q)) {
              best = Math.max(best, 50);
            }
          }
          return { item, score: best };
        })
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score);

      return scored.slice(0, limit).map(({ item }) => item);
    },
  };
}
