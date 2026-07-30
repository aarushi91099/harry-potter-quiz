import type { HouseName } from '../engine/types';
import { useSettings } from '../store/useSettings';

const HOUSES: HouseName[] = ['Gryffindor', 'Ravenclaw', 'Hufflepuff', 'Slytherin'];

export function Settings() {
  const darkMode = useSettings((s) => s.darkMode);
  const toggleDarkMode = useSettings((s) => s.toggleDarkMode);
  const houseTheme = useSettings((s) => s.houseTheme);
  const setHouseTheme = useSettings((s) => s.setHouseTheme);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>

      <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-700">
        <div>
          <h2 className="font-medium text-slate-900 dark:text-slate-100">Dark mode</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Hogwarts-at-night aesthetic.</p>
        </div>
        <button
          type="button"
          onClick={toggleDarkMode}
          className="rounded-lg border border-slate-300 px-4 py-2 dark:border-slate-600"
        >
          {darkMode ? 'On' : 'Off'}
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
        <h2 className="font-medium text-slate-900 dark:text-slate-100">House theme</h2>
        <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
          Colors buttons and highlights throughout the app.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setHouseTheme(null)}
            className={`rounded-lg border px-3 py-1.5 text-sm ${
              houseTheme === null ? 'border-[var(--house-primary)] font-semibold' : 'border-slate-300 dark:border-slate-600'
            }`}
          >
            None
          </button>
          {HOUSES.map((house) => (
            <button
              key={house}
              type="button"
              onClick={() => setHouseTheme(house)}
              className={`rounded-lg border px-3 py-1.5 text-sm ${
                houseTheme === house ? 'border-[var(--house-primary)] font-semibold' : 'border-slate-300 dark:border-slate-600'
              }`}
            >
              {house}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
