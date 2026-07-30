import { useEffect, useMemo, useState } from 'react';
import { AnswerFeedback } from '../../components/AnswerFeedback';
import { CreatureSearchSelect } from '../../components/CreatureSearchSelect';
import { SessionHeader } from '../../components/SessionHeader';
import { creatures } from '../../data/creatures';
import type { Creature } from '../../data/types';
import { BlurEngine } from '../../engine/BlurEngine';
import { QuestionEngine } from '../../engine/QuestionEngine';
import type { Attempt } from '../../engine/types';
import { playCreatureTone } from '../../lib/creatureTone';
import { useGameSession } from '../../store/useGameSession';

const BLUR_DURATION_MS = 15_000;

type SubMode = 'silhouette' | 'blurry' | 'sound';

const SUB_MODES: { id: SubMode; label: string }[] = [
  { id: 'silhouette', label: 'Silhouette' },
  { id: 'blurry', label: 'Blurry' },
  { id: 'sound', label: 'Sound' },
];

interface Feedback {
  correct: boolean;
  creatureName: string;
  description: string;
}

export function GuessCreatureMode() {
  const engine = useMemo(() => new QuestionEngine(creatures), []);
  const [currentCreature, setCurrentCreature] = useState(() => engine.nextAny());
  const [subMode, setSubMode] = useState<SubMode>('silhouette');
  const blurEngine = useMemo(() => new BlurEngine({ durationMs: BLUR_DURATION_MS }), [currentCreature]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [, forceRerender] = useState(0);
  const submitAnswer = useGameSession((s) => s.submitAnswer);
  const start = useGameSession((s) => s.start);

  useEffect(() => {
    start('guessCreature');
  }, [start]);

  useEffect(() => {
    blurEngine.start();
    if (feedback) return;
    const interval = setInterval(() => forceRerender((n) => n + 1), 100);
    return () => clearInterval(interval);
  }, [blurEngine, feedback]);

  function handleSelect(creature: Creature) {
    if (!currentCreature || feedback) return;
    const earliness = blurEngine.earlinessAt();
    const correct = creature.id === currentCreature.id;
    const attempt: Attempt = {
      mode: 'guessCreature',
      questionId: currentCreature.id,
      difficulty: currentCreature.difficulty,
      correct,
      context: { earliness },
    };
    submitAnswer(attempt);
    setFeedback({ correct, creatureName: currentCreature.name, description: currentCreature.description });
  }

  function handleNext() {
    setFeedback(null);
    setCurrentCreature(engine.nextAny());
  }

  if (!currentCreature) {
    return <p>No creatures available.</p>;
  }

  const filter = feedback
    ? 'none'
    : subMode === 'silhouette'
      ? 'brightness(0)'
      : subMode === 'blurry'
        ? `blur(${blurEngine.blurPxAt()}px)`
        : 'none';

  return (
    <div className="flex flex-col gap-6">
      <SessionHeader />

      <div className="flex gap-2">
        {SUB_MODES.map((sm) => (
          <button
            key={sm.id}
            type="button"
            onClick={() => setSubMode(sm.id)}
            className={`hp-button rounded-lg border px-3 py-1.5 text-sm ${
              subMode === sm.id
                ? 'border-[var(--house-primary)] bg-[var(--house-primary)] text-[#05060d]'
                : 'border-[var(--border)] text-[var(--text-secondary)]'
            }`}
          >
            {sm.label}
          </button>
        ))}
      </div>

      <div
        key={currentCreature.id}
        data-creature-id={currentCreature.id}
        className="animate-pop-in flex flex-col items-center gap-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6"
      >
        {subMode === 'sound' && !feedback ? (
          <button
            type="button"
            onClick={() => playCreatureTone(currentCreature.id)}
            className="hp-button flex h-32 w-32 animate-pulse items-center justify-center rounded-full border-2 border-dashed border-[var(--house-primary)] text-4xl"
            aria-label="Play creature sound"
          >
            🔊
          </button>
        ) : (
          <img
            src={currentCreature.imageUrl}
            alt="Mystery creature"
            loading="lazy"
            className="h-32 w-32 rounded-full object-cover ring-2 ring-[var(--house-primary)]/40"
            style={{ filter, transition: 'filter 150ms linear', boxShadow: `0 0 32px -4px var(--house-glow)` }}
          />
        )}
      </div>

      {!feedback && <CreatureSearchSelect onSelect={handleSelect} />}

      {feedback && (
        <AnswerFeedback correct={feedback.correct} onNext={handleNext} nextLabel="Next creature">
          <p>
            Answer: <strong>{feedback.creatureName}</strong>
          </p>
          <p className="mt-2 text-sm">{feedback.description}</p>
        </AnswerFeedback>
      )}
    </div>
  );
}
