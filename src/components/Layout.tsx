import { useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useSettings } from '../store/useSettings';
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
  return `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-[var(--house-primary)] text-white'
      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
  }`;
}

export function Layout() {
  const darkMode = useSettings((s) => s.darkMode);
  const toggleDarkMode = useSettings((s) => s.toggleDarkMode);
  const totalXp = useProgression((s) => s.totalXp);
  const level = useProgression(selectLevel);
  const levelProgress = xpIntoCurrentLevel(totalXp);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <HouseThemeWrapper>
      <div className="mx-auto flex min-h-svh max-w-5xl flex-col">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-lg font-bold whitespace-nowrap text-[var(--house-primary)]">
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
              className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              title={`${levelProgress.current}/${levelProgress.required} XP into level ${level}`}
            >
              Level {level} · {totalXp} XP
            </span>
            <button
              type="button"
              onClick={toggleDarkMode}
              className="rounded-full border border-slate-300 p-2 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              aria-label="Toggle dark mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
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
