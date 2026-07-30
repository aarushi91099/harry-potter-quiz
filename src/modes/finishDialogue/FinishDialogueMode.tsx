import { useEffect, useMemo, useState } from 'react';
import { AnswerFeedback } from '../../components/AnswerFeedback';
import { SessionHeader } from '../../components/SessionHeader';
import { dialogues } from '../../data/dialogues';
import { QuestionEngine } from '../../engine/QuestionEngine';
import type { Attempt } from '../../engine/types';
import { answersMatch } from '../../lib/normalizeAnswer';
import { useGameSession } from '../../store/useGameSession';

interface Feedback {
  correct: boolean;
  fullDialogue: string;
}

export function FinishDialogueMode() {
  const engine = useMemo(() => new QuestionEngine(dialogues), []);
  const [currentDialogue, setCurrentDialogue] = useState(() => engine.nextAny());
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const submitAnswer = useGameSession((s) => s.submitAnswer);
  const start = useGameSession((s) => s.start);

  useEffect(() => {
    start('finishDialogue');
  }, [start]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentDialogue || feedback || !guess.trim()) return;
    const correct = answersMatch(guess, currentDialogue.answer);
    const attempt: Attempt = {
      mode: 'finishDialogue',
      questionId: currentDialogue.id,
      difficulty: currentDialogue.difficulty,
      correct,
    };
    submitAnswer(attempt);
    setFeedback({ correct, fullDialogue: currentDialogue.fullDialogue });
  }

  function handleNext() {
    setFeedback(null);
    setGuess('');
    setCurrentDialogue(engine.nextAny());
  }

  if (!currentDialogue) {
    return <p>No dialogue lines available.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <SessionHeader />

      <blockquote
        key={currentDialogue.id}
        className="animate-pop-in rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 font-display text-xl text-[var(--text-primary)] italic"
      >
        "{currentDialogue.partial}"
      </blockquote>

      {!feedback && (
        <form onSubmit={handleSubmit} className="flex gap-3">
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
        </form>
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
