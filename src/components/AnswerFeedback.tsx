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
      className={`animate-pop-in rounded-xl border p-4 ${
        correct
          ? 'border-[var(--success-border)] bg-[var(--success-bg)] text-[var(--success)]'
          : 'border-[var(--danger-border)] bg-[var(--danger-bg)] text-[var(--danger)]'
      }`}
    >
      <p className="font-display flex items-center gap-2 text-lg font-semibold">
        <span aria-hidden="true">{correct ? '✨' : '🪄'}</span>
        {correct ? 'Correct!' : 'Not quite.'}
      </p>
      <div className="mt-1 text-[var(--text-primary)]">{children}</div>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={onNext}
          className="hp-button rounded-lg bg-[var(--house-primary)] px-4 py-2 font-medium text-[#05060d]"
        >
          {nextLabel}
        </button>
        <button
          type="button"
          onClick={() => navigate('/results')}
          className="hp-button rounded-lg border border-[var(--border)] px-4 py-2 text-[var(--text-secondary)]"
        >
          Finish & see results
        </button>
      </div>
    </div>
  );
}
