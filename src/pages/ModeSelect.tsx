import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { modeById } from '../data/modeCatalog';
import type { Difficulty, QuizMode } from '../engine/types';
import { useGameSession } from '../store/useGameSession';
import { useProgression } from '../store/useProgression';
import { isDifficultyUnlocked } from '../scoring/XPSystem';

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

export function ModeSelect() {
  const { modeId } = useParams<{ modeId: string }>();
  const navigate = useNavigate();
  const start = useGameSession((s) => s.start);
  const totalXp = useProgression((s) => s.totalXp);

  const mode = modeById.get(modeId as QuizMode);
  if (!mode) {
    return <p>Unknown quiz mode.</p>;
  }

  // Popular Quotes has no difficulty picker — skip straight to play.
  if (mode.id === 'quotes') {
    return <Navigate to="/play/quotes" replace />;
  }

  function handleStart(difficulty: Difficulty) {
    start(mode!.id, difficulty);
    navigate(`/play/${mode!.id}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{mode.name}</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">{mode.description}</p>
      </div>

      <div>
        <h2 className="mb-2 font-medium text-slate-700 dark:text-slate-300">Choose a difficulty</h2>
        <div className="flex gap-3">
          {DIFFICULTIES.map((difficulty) => {
            const unlocked = isDifficultyUnlocked(totalXp, difficulty);
            return (
              <button
                key={difficulty}
                type="button"
                disabled={!unlocked}
                onClick={() => handleStart(difficulty)}
                className="rounded-lg border border-slate-300 px-4 py-2 capitalize disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600"
              >
                {difficulty}
                {!unlocked && ' 🔒'}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
