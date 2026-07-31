import { useEffect, useMemo, useState } from 'react';
import { AnswerFeedback } from '../../components/AnswerFeedback';
import { SessionHeader } from '../../components/SessionHeader';
import { dialogues } from '../../data/dialogues';
import { QuestionEngine } from '../../engine/QuestionEngine';
import type { Attempt } from '../../engine/types';
import { answersMatch } from '../../lib/normalizeAnswer';
import { useGameSession } from '../../store/useGameSession';

const MAX_ATTEMPTS = 3;

interface Feedback {
  correct: boolean;
  fullDialogue: string;
}

export function FinishDialogueMode() {
  const engine = useMemo(() => new QuestionEngine(dialogues), []);
  const [currentDialogue, setCurrentDialogue] = useState(() => engine.nextAny());
  const [guess, setGuess] = useState('');
  const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const submitAnswer = useGameSession((s) => s.submitAnswer);
  const start = useGameSession((s) => s.start);

  useEffect(() => {
    start('finishDialogue');
  }, [start]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentDialogue || feedback || !guess.trim()) return;

    if (answersMatch(guess, currentDialogue.answer)) {
      const attempt: Attempt = {
        mode: 'finishDialogue',
        questionId: currentDialogue.id,
        difficulty: currentDialogue.difficulty,
        correct: true,
      };
      submitAnswer(attempt);
      setFeedback({ correct: true, fullDialogue: currentDialogue.fullDialogue });
      return;
    }

    const nextWrongGuesses = [...wrongGuesses, guess.trim()];
    setWrongGuesses(nextWrongGuesses);
    setGuess('');

    if (nextWrongGuesses.length >= MAX_ATTEMPTS) {
      const attempt: Attempt = {
        mode: 'finishDialogue',
        questionId: currentDialogue.id,
        difficulty: currentDialogue.difficulty,
        correct: false,
      };
      submitAnswer(attempt);
      setFeedback({ correct: false, fullDialogue: currentDialogue.fullDialogue });
    }
  }

  function handleNext() {
    setFeedback(null);
    setGuess('');
    setWrongGuesses([]);
    setCurrentDialogue(engine.nextAny());
  }

  if (!currentDialogue) {
    return <p>No dialogue lines available.</p>;
  }

  const attemptsUsed = wrongGuesses.length;
  const revealedCount = Math.min(attemptsUsed, currentDialogue.answer.length);
  const maskedAnswer = currentDialogue.answer
    .split('')
    .map((ch, i) => (ch === ' ' ? ' ' : i < revealedCount ? ch : '_'))
    .join(' ');

  return (
    <div className="flex flex-col gap-6">
      <SessionHeader />

      <blockquote
        key={currentDialogue.id}
        className="animate-pop-in rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 font-display text-xl text-[var(--text-primary)] italic"
      >
        "{currentDialogue.partial}"
      </blockquote>

      {attemptsUsed > 0 && !feedback && (
        <div className="animate-pop-in rounded-xl border border-[var(--gold)]/40 bg-[var(--gold)]/10 p-4 text-sm">
          <span className="font-medium text-[var(--gold-bright)]">Hint:</span>{' '}
          <span className="font-mono text-lg tracking-widest text-[var(--text-primary)]">{maskedAnswer}</span>
        </div>
      )}

      {!feedback && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex gap-3">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Fill in the missing word(s)…"
              aria-label="Your answer"
              className="w-full max-w-md rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--house-primary)] focus:ring-2 focus:ring-[var(--house-primary)]"
            />
            <button
              type="submit"
              disabled={!guess.trim()}
              className="hp-button rounded-lg bg-[var(--house-primary)] px-4 py-2 font-medium text-[#05060d] disabled:opacity-50"
            >
              Submit
            </button>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            Guess {attemptsUsed + 1} of {MAX_ATTEMPTS}
          </p>
        </form>
      )}

      {wrongGuesses.length > 0 && !feedback && (
        <ul className="flex flex-col gap-2">
          {wrongGuesses.map((wrongGuess, index) => (
            <li
              key={`${wrongGuess}-${index}`}
              className="animate-pop-in flex items-center gap-2 rounded-lg border border-[var(--danger-border)] bg-[var(--danger-bg)] p-2 text-sm text-[var(--danger)]"
            >
              <span className="font-medium">{wrongGuess}</span>
            </li>
          ))}
        </ul>
      )}

      {feedback && (
        <AnswerFeedback correct={feedback.correct} onNext={handleNext} nextLabel="Next line">
          <p>
            Full line: <strong>"{feedback.fullDialogue}"</strong>
          </p>
        </AnswerFeedback>
      )}
    </div>
  );
}
