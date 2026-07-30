import type { HouseName } from '../engine/types';
import { useSettings } from '../store/useSettings';

const HOUSES: { name: HouseName; swatch: string }[] = [
  { name: 'Gryffindor', swatch: '#e0263f' },
  { name: 'Ravenclaw', swatch: '#3b5bdb' },
  { name: 'Hufflepuff', swatch: '#ecc94b' },
  { name: 'Slytherin', swatch: '#2f9e56' },
];

export function Settings() {
  const houseTheme = useSettings((s) => s.houseTheme);
  const setHouseTheme = useSettings((s) => s.setHouseTheme);

  return (
    <div className="animate-fade-in-up flex flex-col gap-8">
      <h1 className="font-magical text-3xl font-bold text-[var(--house-primary)]">Settings</h1>

      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
        <h2 className="font-display font-medium text-[var(--text-primary)]">House theme</h2>
        <p className="mb-3 text-sm text-[var(--text-secondary)]">
          Colors buttons and highlights throughout the app.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setHouseTheme(null)}
            className={`hp-button rounded-lg border px-3 py-1.5 text-sm ${
              houseTheme === null
                ? 'border-[var(--house-primary)] font-semibold text-[var(--text-primary)]'
                : 'border-[var(--border)] text-[var(--text-secondary)]'
            }`}
          >
            None
          </button>
          {HOUSES.map((house) => (
            <button
              key={house.name}
              type="button"
              onClick={() => setHouseTheme(house.name)}
              className={`hp-button flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm ${
                houseTheme === house.name
                  ? 'border-[var(--house-primary)] font-semibold text-[var(--text-primary)]'
                  : 'border-[var(--border)] text-[var(--text-secondary)]'
              }`}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: house.swatch }}
                aria-hidden="true"
              />
              {house.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
