import { Link } from 'react-router-dom';
import { modeCatalog } from '../data/modeCatalog';

export function Home() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--house-primary)]">Hogwarts Trivia</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Pick a quiz mode to test your knowledge of the wizarding world.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {modeCatalog.map((mode) => (
          <Link
            key={mode.id}
            to={`/play/${mode.id}`}
            className="rounded-xl border border-slate-200 p-4 transition-shadow hover:shadow-md dark:border-slate-700"
          >
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">{mode.name}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{mode.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
