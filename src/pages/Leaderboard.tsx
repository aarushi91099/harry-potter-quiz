import { useState } from 'react';
import { isWithinPastWeek } from '../lib/leaderboardFilters';
import { useProgression } from '../store/useProgression';

type Range = 'all-time' | 'weekly';

const RANK_MEDAL: Record<number, string> = { 0: '🥇', 1: '🥈', 2: '🥉' };

export function Leaderboard() {
  const leaderboard = useProgression((s) => s.leaderboard);
  const [range, setRange] = useState<Range>('all-time');

  const visible = range === 'weekly' ? leaderboard.filter((e) => isWithinPastWeek(e.achievedAt)) : leaderboard;

  return (
    <div className="animate-fade-in-up flex flex-col gap-6">
      <div>
        <h1 className="font-magical text-3xl font-bold text-[var(--house-primary)]">Leaderboard</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
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
            className={`hp-button rounded-lg border px-3 py-1.5 text-sm capitalize ${
              range === r
                ? 'border-[var(--house-primary)] bg-[var(--house-primary)] text-[#05060d]'
                : 'border-[var(--border)] text-[var(--text-secondary)]'
            }`}
          >
            {r === 'all-time' ? 'All-time' : 'Weekly'}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-[var(--text-secondary)]">
          {range === 'weekly'
            ? 'No scores saved in the last 7 days.'
            : 'No scores saved yet — play a quiz and save your result!'}
        </p>
      ) : (
        <ol className="flex flex-col gap-2">
          {visible.map((entry, index) => (
            <li
              key={`${entry.name}-${entry.achievedAt}`}
              className="hp-card flex items-center justify-between rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2"
            >
              <span className="font-medium text-[var(--text-primary)]">
                {RANK_MEDAL[index] ?? `#${index + 1}`} {entry.name}
              </span>
              <span className="text-sm text-[var(--text-secondary)]">
                {entry.score} pts · {entry.mode}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
