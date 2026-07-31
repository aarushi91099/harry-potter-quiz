import { NavLink, Outlet } from 'react-router-dom';
import { useProgression, selectLevel } from '../store/useProgression';
import { xpIntoCurrentLevel } from '../scoring/XPSystem';
import { AchievementToastHost } from './AchievementToastHost';
import { HouseThemeWrapper } from './HouseThemeWrapper';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/achievements', label: 'Achievements' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/settings', label: 'Settings' },
];

function navLinkClass({ isActive }: { isActive: boolean }): string {
  return `rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'border-[var(--house-primary)] text-[var(--house-primary)]'
      : 'border-transparent text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]'
  }`;
}

export function Layout() {
  const totalXp = useProgression((s) => s.totalXp);
  const level = useProgression(selectLevel);
  const levelProgress = xpIntoCurrentLevel(totalXp);

  return (
    <HouseThemeWrapper>
      <div className="starfield" aria-hidden="true" />
      <div className="relative z-10 mx-auto flex min-h-svh max-w-5xl flex-col">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] px-4 py-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-magical text-xl font-bold tracking-wide whitespace-nowrap text-[var(--house-primary)] drop-shadow-[0_0_12px_var(--house-glow)]">
              ⚡ Hogwarts Trivia
            </span>
            <nav className="flex flex-wrap gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink key={link.to} to={link.to} end={link.end} className={navLinkClass}>
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <span
              className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 font-medium text-[var(--text-secondary)]"
              title={`${levelProgress.current}/${levelProgress.required} XP into level ${level}`}
            >
              Level {level} · {totalXp} XP
            </span>
            <span className="hp-crest" aria-hidden="true" title="Hogwarts Trivia">
              H
            </span>
          </div>
        </header>

        <main className="flex-1 px-4 py-6">
          <Outlet />
        </main>

        <AchievementToastHost />
      </div>
    </HouseThemeWrapper>
  );
}
