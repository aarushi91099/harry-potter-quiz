import { Link } from 'react-router-dom';
import { modeCatalog } from '../data/modeCatalog';

export function Home() {
  return (
    <div className="animate-fade-in-up flex flex-col gap-6">
      <div>
        <h1 className="font-magical text-4xl font-bold text-[var(--house-primary)] drop-shadow-[0_0_16px_var(--house-glow)]">
          Hogwarts Trivia
        </h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          Pick a quiz mode to test your knowledge of the wizarding world.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {modeCatalog.map((mode, i) => (
          <Link
            key={mode.id}
            to={`/play/${mode.id}`}
            style={{ animationDelay: `${i * 60}ms` }}
            className="hp-card animate-fade-in-up flex gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4"
          >
            <span className="text-2xl" aria-hidden="true">
              {mode.icon}
            </span>
            <div>
              <h2 className="font-semibold text-[var(--text-primary)]">{mode.name}</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{mode.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
