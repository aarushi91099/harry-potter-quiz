import { useState } from 'react';
import { Link } from 'react-router-dom';
import { selectAccuracy, useGameSession } from '../store/useGameSession';
import { useProgression } from '../store/useProgression';

export function Results() {
  const session = useGameSession();
  const addLeaderboardEntry = useProgression((s) => s.addLeaderboardEntry);
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState('');

  function handleSave() {
    if (!session.mode || saved) return;
    addLeaderboardEntry({ name: name.trim() || 'Anonymous Wizard', score: session.score, mode: session.mode });
    setSaved(true);
  }

  return (
    <div className="animate-fade-in-up flex flex-col gap-6">
      <h1 className="font-magical text-3xl font-bold text-[var(--house-primary)]">Session Results</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Score" value={session.score} />
        <Stat label="Accuracy" value={`${Math.round(selectAccuracy(session) * 100)}%`} />
        <Stat label="Best Streak" value={session.bestStreakThisSession} />
        <Stat label="Answered" value={session.totalCount} />
      </div>

      {!saved ? (
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Your name for the local leaderboard"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--house-primary)] focus:ring-2 focus:ring-[var(--house-primary)] focus:outline-none"
          />
          <button
            type="button"
            onClick={handleSave}
            className="hp-button rounded-lg bg-[var(--house-primary)] px-4 py-2 font-medium text-[#05060d]"
          >
            Save to local leaderboard
          </button>
        </div>
      ) : (
        <p className="text-[var(--success)]">✨ Saved to your local leaderboard!</p>
      )}

      <Link to="/" className="w-fit text-[var(--house-primary)] underline">
        Back to mode select
      </Link>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="hp-card rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 text-center">
      <div className="font-display text-2xl font-bold text-[var(--gold-bright)]">{value}</div>
      <div className="text-sm text-[var(--text-secondary)]">{label}</div>
    </div>
  );
}
