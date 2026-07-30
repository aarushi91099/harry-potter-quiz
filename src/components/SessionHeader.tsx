import { useGameSession } from '../store/useGameSession';

/** Score/streak strip shown atop every quiz mode's play screen. */
export function SessionHeader() {
  const score = useGameSession((s) => s.score);
  const currentStreak = useGameSession((s) => s.currentStreak);

  return (
    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
      <span>Score: {score}</span>
      <span>Streak: {currentStreak}</span>
    </div>
  );
}
