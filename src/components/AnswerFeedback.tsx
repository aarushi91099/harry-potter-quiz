import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export interface AnswerFeedbackProps {
  correct: boolean;
  /** Explanation / fun fact / correct-answer content shown below the correct/incorrect banner. */
  children: ReactNode;
  onNext: () => void;
  nextLabel?: string;
}

/** Correct/incorrect banner with explanation + "next question" / "finish" actions, shared by every quiz mode. */
export function AnswerFeedback({ correct, children, onNext, nextLabel = 'Next question' }: AnswerFeedbackProps) {
  const navigate = useNavigate();

  return (
    <div
      className={`rounded-xl p-4 ${
        correct
          ? 'bg-green-100 text-green-900 dark:bg-green-950 dark:text-green-200'
          : 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200'
      }`}
    >
      <p className="font-semibold">{correct ? 'Correct!' : 'Not quite.'}</p>
      <div className="mt-1">{children}</div>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={onNext}
          className="rounded-lg bg-[var(--house-primary)] px-4 py-2 text-white"
        >
          {nextLabel}
        </button>
        <button
          type="button"
          onClick={() => navigate('/results')}
          className="rounded-lg border border-slate-300 px-4 py-2 dark:border-slate-600"
        >
          Finish & see results
        </button>
      </div>
    </div>
  );
}
