import { useId, useMemo, useRef, useState } from 'react';
import { useDebouncedValue } from '../lib/useDebouncedValue';

const SEARCH_DEBOUNCE_MS = 150;

export interface SearchSelectProps<T> {
  items: readonly T[];
  search: (query: string) => T[];
  getId: (item: T) => string;
  getLabel: (item: T) => string;
  getImageUrl?: (item: T) => string | undefined;
  onSelect: (item: T) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Announced to assistive tech via aria-label; defaults to placeholder. */
  label?: string;
}

/**
 * Generic searchable/autocomplete combobox — the "full catalog, no four-option
 * multiple choice" selector required for every character/creature identification
 * mode. Kept dataset-agnostic so both CharacterSearchSelect and
 * CreatureSearchSelect are thin wrappers around this one component.
 */
export function SearchSelect<T>({
  items,
  search,
  getId,
  getLabel,
  getImageUrl,
  onSelect,
  placeholder = 'Search…',
  disabled = false,
  label,
}: SearchSelectProps<T>) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE_MS);
  const results = useMemo(() => search(debouncedQuery), [items, search, debouncedQuery]);

  function selectItem(item: T) {
    onSelect(item);
    setQuery('');
    setIsOpen(false);
    setHighlightedIndex(0);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true);
      return;
    }
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((i) => Math.min(i + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[highlightedIndex]) selectItem(results[highlightedIndex]);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  }

  return (
    <div className="relative w-full max-w-md">
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-label={label ?? placeholder}
        aria-activedescendant={
          isOpen && results[highlightedIndex] ? `${listboxId}-${highlightedIndex}` : undefined
        }
        disabled={disabled}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 shadow-sm outline-none focus:border-[var(--house-primary)] focus:ring-2 focus:ring-[var(--house-primary)] disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
          setHighlightedIndex(0);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => {
          // Delay so a click on a listbox option registers before the list unmounts.
          setTimeout(() => setIsOpen(false), 150);
        }}
        onKeyDown={handleKeyDown}
      />

      {isOpen && results.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-10 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900"
        >
          {results.map((item, index) => (
            <li
              key={getId(item)}
              id={`${listboxId}-${index}`}
              role="option"
              aria-selected={index === highlightedIndex}
              className={`flex cursor-pointer items-center gap-3 px-4 py-2 ${
                index === highlightedIndex
                  ? 'bg-[var(--house-primary)] text-white'
                  : 'text-slate-900 dark:text-slate-100'
              }`}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setHighlightedIndex(index)}
              onClick={() => selectItem(item)}
            >
              {getImageUrl && (
                <img
                  src={getImageUrl(item)}
                  alt=""
                  loading="lazy"
                  className="h-8 w-8 shrink-0 rounded-full object-cover"
                />
              )}
              <span>{getLabel(item)}</span>
            </li>
          ))}
        </ul>
      )}

      {isOpen && debouncedQuery && results.length === 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          No matches found.
        </div>
      )}
    </div>
  );
}
