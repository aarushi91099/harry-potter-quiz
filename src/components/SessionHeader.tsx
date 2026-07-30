import { useGameSession } from '../store/useGameSession';

/** Score/streak strip shown atop every quiz mode's play screen. */
export function SessionHeader() {
  const score = useGameSession((s) => s.score);
  const currentStreak = useGameSession((s) => s.currentStreak);

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 text-[var(--text-secondary)]">
        <span aria-hidden="true">⭐</span> Score: <strong className="text-[var(--text-primary)]">{score}</strong>
      </span>
      <span className="flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 text-[var(--text-secondary)]">
        <span aria-hidden="true">🔥</span> Streak:{' '}
        <strong className="text-[var(--text-primary)]">{currentStreak}</strong>
      </span>
    </div>
  );
}
