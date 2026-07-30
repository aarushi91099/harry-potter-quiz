import { useState } from 'react';
import { isWithinPastWeek } from '../lib/leaderboardFilters';
import { useProgression } from '../store/useProgression';

type Range = 'all-time' | 'weekly';

export function Leaderboard() {
  const leaderboard = useProgression((s) => s.leaderboard);
  const [range, setRange] = useState<Range>('all-time');

  const visible = range === 'weekly' ? leaderboard.filter((e) => isWithinPastWeek(e.achievedAt)) : leaderboard;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Leaderboard</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Local high scores on this device. A true cross-player global/friends leaderboard needs a
          backend and is a future enhancement.
        </p>
      </div>

      <div className="flex gap-2">
        {(['all-time', 'weekly'] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRange(r)}
            className={`rounded-lg border px-3 py-1.5 text-sm capitalize ${
              range === r
                ? 'border-[var(--house-primary)] bg-[var(--house-primary)] text-white'
                : 'border-slate-300 dark:border-slate-600'
            }`}
          >
            {r === 'all-time' ? 'All-time' : 'Weekly'}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-slate-600 dark:text-slate-400">
          {range === 'weekly'
            ? 'No scores saved in the last 7 days.'
            : 'No scores saved yet — play a quiz and save your result!'}
        </p>
      ) : (
        <ol className="flex flex-col gap-2">
          {visible.map((entry, index) => (
            <li
              key={`${entry.name}-${entry.achievedAt}`}
              className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-2 dark:border-slate-700"
            >
              <span className="font-medium text-slate-900 dark:text-slate-100">
                #{index + 1} {entry.name}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {entry.score} pts · {entry.mode}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
