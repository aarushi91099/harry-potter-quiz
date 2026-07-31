import { Link } from 'react-router-dom';
import { modeCatalog } from '../data/modeCatalog';

function OrnateDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`mx-auto flex max-w-xs items-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--house-primary)] opacity-60" />
      <span className="text-xs text-[var(--house-primary)]">❖</span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--house-primary)] opacity-60" />
    </div>
  );
}

export function Home() {
  return (
    <div className="animate-fade-in-up flex flex-col gap-6">
      <div className="hp-hero flex flex-col items-center gap-3 px-6 py-10 text-center sm:py-14">
        <h1 className="font-magical text-4xl font-bold text-[var(--house-primary)] drop-shadow-[0_0_16px_var(--house-glow)] sm:text-5xl">
          <span className="hp-sparkle mr-2" aria-hidden="true">
            ✦
          </span>
          Hogwarts Trivia
          <span className="hp-sparkle ml-2" aria-hidden="true">
            ✦
          </span>
        </h1>
        <p className="text-[var(--text-secondary)]">Pick a quiz mode to test your knowledge of the wizarding world.</p>
        <OrnateDivider className="mt-1 w-full" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {modeCatalog.map((mode, i) => (
          <Link
            key={mode.id}
            to={`/play/${mode.id}`}
            style={{ animationDelay: `${i * 60}ms` }}
            className="hp-card hp-ornate-card animate-fade-in-up flex flex-col gap-3 rounded-xl border border-[var(--border)] p-5"
          >
            <span className="hp-corner hp-corner-tl" aria-hidden="true" />
            <span className="hp-corner hp-corner-tr" aria-hidden="true" />
            <span className="hp-corner hp-corner-bl" aria-hidden="true" />
            <span className="hp-corner hp-corner-br" aria-hidden="true" />

            <div className="flex gap-4">
              <span className="hp-medallion" aria-hidden="true">
                <span className="text-2xl">{mode.icon}</span>
              </span>
              <div className="min-w-0">
                <h2 className="font-display text-lg font-semibold text-[var(--house-primary)]">{mode.name}</h2>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{mode.description}</p>
              </div>
            </div>

            <OrnateDivider className="mt-1 max-w-[220px] opacity-70" />
          </Link>
        ))}
      </div>
    </div>
  );
}
