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

export function SpellVsVillainMode() {
  const engine = useMemo(() => new QuestionEngine(spellScenarios), []);
  const [currentScenario, setCurrentScenario] = useState(() => engine.nextAny());
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [remainingMs, setRemainingMs] = useState(TIME_LIMIT_MS_BY_DIFFICULTY.easy);
  const submitAnswer = useGameSession((s) => s.submitAnswer);
  const start = useGameSession((s) => s.start);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    start('spellVsVillain');
  }, [start]);

  const timeLimitMs = TIME_LIMIT_MS_BY_DIFFICULTY[currentScenario?.difficulty ?? 'easy'];

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
    setCurrentScenario(engine.nextAny());
  }

  if (!currentScenario) {
    return <p>No scenarios available.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <SessionHeader />

      <div
        key={currentScenario.id}
        className="animate-pop-in rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6"
      >
        <p className="text-lg text-[var(--text-primary)]">{currentScenario.prompt}</p>
        {!feedback && (
          <div className="mt-3">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[var(--house-primary)] transition-[width] duration-200 ease-linear"
                style={{ width: `${(remainingMs / timeLimitMs) * 100}%` }}
              />
            </div>
            <p className="mt-1.5 text-sm text-[var(--text-muted)]">
              Time remaining: {Math.ceil(remainingMs / 1000)}s
            </p>
          </div>
        )}
      </div>

      {!feedback && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {spells.map((spell) => (
            <button
              key={spell.id}
              type="button"
              onClick={() => handleSelect(spell)}
              className="hp-button rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)]"
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
