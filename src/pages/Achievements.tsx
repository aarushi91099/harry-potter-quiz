import { ACHIEVEMENTS } from '../scoring/AchievementSystem';
import { useProgression } from '../store/useProgression';

export function Achievements() {
  const unlockedIds = useProgression((s) => s.unlockedAchievementIds);

  return (
    <div className="animate-fade-in-up flex flex-col gap-6">
      <h1 className="font-magical text-3xl font-bold text-[var(--house-primary)]">Achievements</h1>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ACHIEVEMENTS.map((achievement) => {
          const unlocked = unlockedIds.includes(achievement.id);
          return (
            <li
              key={achievement.id}
              className={`hp-card rounded-xl border bg-[var(--bg-surface)] p-4 ${
                unlocked ? 'border-[var(--gold)] [box-shadow:0_0_20px_-8px_var(--house-glow)]' : 'border-[var(--border-subtle)] opacity-60'
              }`}
            >
              <div className="font-display flex items-center gap-2 font-semibold text-[var(--text-primary)]">
                <span aria-hidden="true">{unlocked ? '🏆' : '🔒'}</span>
                {achievement.name}
              </div>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{achievement.description}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
