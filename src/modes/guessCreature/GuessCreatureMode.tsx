import { useEffect, useMemo, useState } from 'react';
import { AnswerFeedback } from '../../components/AnswerFeedback';
import { CreatureSearchSelect } from '../../components/CreatureSearchSelect';
import { SessionHeader } from '../../components/SessionHeader';
import { creatures } from '../../data/creatures';
import type { Creature } from '../../data/types';
import { QuestionEngine } from '../../engine/QuestionEngine';
import type { Attempt } from '../../engine/types';
import { useGameSession } from '../../store/useGameSession';

const MAX_ATTEMPTS = 2;

interface Feedback {
  correct: boolean;
  creatureName: string;
  description: string;
}

function creatureImagePath(variant: 'black_silhouette' | 'silhouette' | 'creatures', id: string) {
  return `/creature-images/${variant}/${id}.png`;
}

export function GuessCreatureMode() {
  const engine = useMemo(() => new QuestionEngine(creatures), []);
  const [currentCreature, setCurrentCreature] = useState(() => engine.nextAny());
  const [wrongGuesses, setWrongGuesses] = useState<Creature[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const submitAnswer = useGameSession((s) => s.submitAnswer);
  const start = useGameSession((s) => s.start);

  useEffect(() => {
    start('guessCreature');
  }, [start]);

  function handleSelect(creature: Creature) {
    if (!currentCreature || feedback) return;

    if (creature.id === currentCreature.id) {
      const earliness = 1 - wrongGuesses.length / MAX_ATTEMPTS;
      const attempt: Attempt = {
        mode: 'guessCreature',
        questionId: currentCreature.id,
        difficulty: currentCreature.difficulty,
        correct: true,
        context: { earliness },
      };
      submitAnswer(attempt);
      setFeedback({ correct: true, creatureName: currentCreature.name, description: currentCreature.description });
      return;
    }

    const nextWrongGuesses = [...wrongGuesses, creature];
    setWrongGuesses(nextWrongGuesses);

    if (nextWrongGuesses.length >= MAX_ATTEMPTS) {
      const attempt: Attempt = {
        mode: 'guessCreature',
        questionId: currentCreature.id,
        difficulty: currentCreature.difficulty,
        correct: false,
        context: { earliness: 0 },
      };
      submitAnswer(attempt);
      setFeedback({ correct: false, creatureName: currentCreature.name, description: currentCreature.description });
    }
  }

  function handleNext() {
    setFeedback(null);
    setWrongGuesses([]);
    setCurrentCreature(engine.nextAny());
  }

  if (!currentCreature) {
    return <p>No creatures available.</p>;
  }

  const attemptsUsed = wrongGuesses.length;
  const imageVariant = feedback ? 'creatures' : attemptsUsed === 0 ? 'black_silhouette' : 'silhouette';
  const imageSrc = creatureImagePath(imageVariant, currentCreature.id);

  return (
    <div className="flex flex-col gap-6">
      <SessionHeader />

      <div
        key={currentCreature.id}
        data-creature-id={currentCreature.id}
        className="animate-pop-in flex flex-col items-center gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6"
      >
        <img
          src={imageSrc}
          alt="Mystery creature"
          loading="lazy"
          className="h-32 w-32 rounded-full object-cover ring-2 ring-[var(--house-primary)]/40"
          style={{ boxShadow: `0 0 32px -4px var(--house-glow)` }}
        />
        {!feedback && (
          <p className="text-sm text-[var(--text-secondary)]">
            Guess {attemptsUsed + 1} of {MAX_ATTEMPTS}
          </p>
        )}
      </div>

      {wrongGuesses.length > 0 && !feedback && (
        <ul className="flex flex-col gap-2">
          {wrongGuesses.map((guess, index) => (
            <li
              key={`${guess.id}-${index}`}
              className="animate-pop-in flex items-center gap-2 rounded-lg border border-[var(--danger-border)] bg-[var(--danger-bg)] p-2 text-sm text-[var(--danger)]"
            >
              <span className="font-medium">{guess.name}</span>
            </li>
          ))}
        </ul>
      )}

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
