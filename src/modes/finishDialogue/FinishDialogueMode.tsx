import { useMemo, useState } from 'react';
import { AnswerFeedback } from '../../components/AnswerFeedback';
import { SessionHeader } from '../../components/SessionHeader';
import { dialogues } from '../../data/dialogues';
import { QuestionEngine } from '../../engine/QuestionEngine';
import type { Attempt, Difficulty } from '../../engine/types';
import { answersMatch } from '../../lib/normalizeAnswer';
import { useGameSession } from '../../store/useGameSession';

interface Feedback {
  correct: boolean;
  fullDialogue: string;
}

export function FinishDialogueMode({ difficulty }: { difficulty: Difficulty }) {
  const engine = useMemo(() => new QuestionEngine(dialogues), []);
  const [currentDialogue, setCurrentDialogue] = useState(() => engine.next(difficulty));
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const submitAnswer = useGameSession((s) => s.submitAnswer);

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
    setCurrentDialogue(engine.next(difficulty));
  }

  if (!currentDialogue) {
    return <p>No dialogue lines available at this difficulty yet.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <SessionHeader />

      <blockquote className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-xl italic text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
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
            className="w-full max-w-md rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-[var(--house-primary)] focus:ring-2 focus:ring-[var(--house-primary)] dark:border-slate-700 dark:bg-slate-900"
          />
          <button
            type="submit"
            disabled={!guess.trim()}
            className="rounded-lg bg-[var(--house-primary)] px-4 py-2 text-white disabled:opacity-50"
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
