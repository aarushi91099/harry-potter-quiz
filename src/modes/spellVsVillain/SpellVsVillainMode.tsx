import { useEffect, useMemo, useRef, useState } from 'react';
import { AnswerFeedback } from '../../components/AnswerFeedback';
import { SessionHeader } from '../../components/SessionHeader';
import { spellScenarios } from '../../data/spellScenarios';
import { spells, spellsById } from '../../data/spells';
import type { Spell } from '../../data/types';
import { QuestionEngine } from '../../engine/QuestionEngine';
import type { Attempt, Difficulty } from '../../engine/types';
import { useGameSession } from '../../store/useGameSession';

const TIME_LIMIT_MS_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 20_000,
  medium: 15_000,
  hard: 10_000,
};

interface Feedback {
  correct: boolean;
  correctSpellName: string;
  explanation: string;
}

export function SpellVsVillainMode({ difficulty }: { difficulty: Difficulty }) {
  const engine = useMemo(() => new QuestionEngine(spellScenarios), []);
  const [currentScenario, setCurrentScenario] = useState(() => engine.next(difficulty));
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [remainingMs, setRemainingMs] = useState(TIME_LIMIT_MS_BY_DIFFICULTY[difficulty]);
  const submitAnswer = useGameSession((s) => s.submitAnswer);
  const startTimeRef = useRef(Date.now());

  const timeLimitMs = TIME_LIMIT_MS_BY_DIFFICULTY[currentScenario?.difficulty ?? difficulty];

  useEffect(() => {
    if (feedback) return;
    startTimeRef.current = Date.now();
    setRemainingMs(timeLimitMs);
    const interval = setInterval(() => {
      setRemainingMs(Math.max(0, timeLimitMs - (Date.now() - startTimeRef.current)));
    }, 200);
    return () => clearInterval(interval);
  }, [currentScenario?.id, feedback, timeLimitMs]);

  function handleSelect(spell: Spell) {
    if (!currentScenario || feedback) return;
    const elapsedMs = Date.now() - startTimeRef.current;
    const correct = spell.id === currentScenario.correctSpellId;
    const attempt: Attempt = {
      mode: 'spellVsVillain',
      questionId: currentScenario.id,
      difficulty: currentScenario.difficulty,
      correct,
      context: { elapsedMs, timeLimitMs },
    };
    submitAnswer(attempt);
    setFeedback({
      correct,
      correctSpellName: spellsById.get(currentScenario.correctSpellId)?.name ?? 'Unknown',
      explanation: currentScenario.explanation,
    });
  }

  function handleNext() {
    setFeedback(null);
    setCurrentScenario(engine.next(difficulty));
  }

  if (!currentScenario) {
    return <p>No scenarios available at this difficulty yet.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <SessionHeader />

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-lg text-slate-800 dark:text-slate-100">{currentScenario.prompt}</p>
        {!feedback && (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Time remaining: {Math.ceil(remainingMs / 1000)}s
          </p>
        )}
      </div>

      {!feedback && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {spells.map((spell) => (
            <button
              key={spell.id}
              type="button"
              onClick={() => handleSelect(spell)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
            >
              {spell.name}
            </button>
          ))}
        </div>
      )}

      {feedback && (
        <AnswerFeedback correct={feedback.correct} onNext={handleNext} nextLabel="Next scenario">
          <p>
            Best spell: <strong>{feedback.correctSpellName}</strong>
          </p>
          <p className="mt-2 text-sm">{feedback.explanation}</p>
        </AnswerFeedback>
      )}
    </div>
  );
}
