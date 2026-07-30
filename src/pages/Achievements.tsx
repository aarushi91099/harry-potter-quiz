import { ACHIEVEMENTS } from '../scoring/AchievementSystem';
import { useProgression } from '../store/useProgression';

export function Achievements() {
  const unlockedIds = useProgression((s) => s.unlockedAchievementIds);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Achievements</h1>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ACHIEVEMENTS.map((achievement) => {
          const unlocked = unlockedIds.includes(achievement.id);
          return (
            <li
              key={achievement.id}
              className={`rounded-xl border p-4 ${
                unlocked
                  ? 'border-[var(--house-primary)] bg-[var(--house-primary)]/10'
                  : 'border-slate-200 opacity-60 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                <span>{unlocked ? '🏆' : '🔒'}</span>
                {achievement.name}
              </div>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {achievement.description}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
