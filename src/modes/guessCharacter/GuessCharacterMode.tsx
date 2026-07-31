import { useEffect, useMemo, useState } from 'react';
import { AnswerFeedback } from '../../components/AnswerFeedback';
import { CharacterSearchSelect } from '../../components/CharacterSearchSelect';
import { SessionHeader } from '../../components/SessionHeader';
import { characters } from '../../data/characters';
import type { Character } from '../../data/types';
import { QuestionEngine } from '../../engine/QuestionEngine';
import type { Attempt } from '../../engine/types';
import { useGameSession } from '../../store/useGameSession';
import {
  ATTRIBUTE_COLUMNS,
  STATUS_LABEL,
  compareCharacterGuess,
  type AttributeStatus,
} from './characterAttributes';

const MIN_GUESSES_FOR_REVEAL = 5;

interface Feedback {
  correct: boolean;
  characterName: string;
  guessCount: number;
}

const STATUS_CLASSES: Record<AttributeStatus, string> = {
  correct: 'border-[var(--success-border)] bg-[var(--success-bg)] text-[var(--success)]',
  partial: 'border-[var(--partial-border)] bg-[var(--partial-bg)] text-[var(--partial)]',
  incorrect: 'border-[var(--danger-border)] bg-[var(--danger-bg)] text-[var(--danger)]',
  higher: 'border-[var(--danger-border)] bg-[var(--danger-bg)] text-[var(--danger)]',
  lower: 'border-[var(--danger-border)] bg-[var(--danger-bg)] text-[var(--danger)]',
  unknown: 'border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] text-[var(--text-muted)]',
};

const STATUS_ICON: Partial<Record<AttributeStatus, string>> = {
  higher: '▲',
  lower: '▼',
};

const GRID_COLUMNS = 'grid-cols-[128px_repeat(8,minmax(84px,1fr))]';
const LEGEND_STATUSES: AttributeStatus[] = ['correct', 'partial', 'incorrect', 'higher', 'lower'];

const LEGEND_SWATCH_CLASSES: Record<AttributeStatus, string> = {
  correct: 'bg-[var(--success)]',
  partial: 'bg-[var(--partial)]',
  incorrect: 'bg-[var(--danger)]',
  higher: 'bg-[var(--danger)]',
  lower: 'bg-[var(--danger)]',
  unknown: 'bg-[var(--text-muted)]',
};

export function GuessCharacterMode() {
  const engine = useMemo(() => new QuestionEngine(characters), []);
  const [currentCharacter, setCurrentCharacter] = useState(() => engine.nextAny());
  const [guesses, setGuesses] = useState<Character[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [showLegend, setShowLegend] = useState(false);
  const submitAnswer = useGameSession((s) => s.submitAnswer);
  const start = useGameSession((s) => s.start);

  useEffect(() => {
    start('guessCharacter');
  }, [start]);

  const guessedIds = useMemo(() => new Set(guesses.map((g) => g.id)), [guesses]);

  function handleSelect(character: Character) {
    if (!currentCharacter || feedback || guessedIds.has(character.id)) return;
    const nextGuesses = [...guesses, character];
    setGuesses(nextGuesses);

    if (character.id === currentCharacter.id) {
      const attempt: Attempt = {
        mode: 'guessCharacter',
        questionId: currentCharacter.id,
        difficulty: currentCharacter.difficulty,
        correct: true,
        context: { guessCount: nextGuesses.length },
      };
      submitAnswer(attempt);
      setFeedback({ correct: true, characterName: currentCharacter.name, guessCount: nextGuesses.length });
    }
  }

  function handleReveal() {
    if (!currentCharacter || feedback || guesses.length < MIN_GUESSES_FOR_REVEAL) return;
    const attempt: Attempt = {
      mode: 'guessCharacter',
      questionId: currentCharacter.id,
      difficulty: currentCharacter.difficulty,
      correct: false,
      context: { guessCount: guesses.length },
    };
    submitAnswer(attempt);
    setFeedback({ correct: false, characterName: currentCharacter.name, guessCount: guesses.length });
  }

  function handleNext() {
    setFeedback(null);
    setGuesses([]);
    setCurrentCharacter(engine.nextAny());
  }

  if (!currentCharacter) {
    return <p>No characters available.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <SessionHeader />

      <div
        data-character-id={currentCharacter.id}
        className="hp-card rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-6"
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <p className="text-sm text-[var(--text-secondary)]">
            Guess a character to see how their traits compare to the mystery witch or wizard. Keep guessing —
            there's no limit — until you find the match, or reveal the answer after {MIN_GUESSES_FOR_REVEAL}{' '}
            tries.
          </p>
          <button
            type="button"
            onClick={() => setShowLegend(true)}
            className="hp-button flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-sm font-semibold text-[var(--text-secondary)]"
            aria-label="Show color key"
          >
            ?
          </button>
        </div>

        <div className="overflow-x-auto">
          <div className={`grid ${GRID_COLUMNS} min-w-[820px] gap-x-2 gap-y-2`}>
            <div className="border-b border-[var(--border-subtle)] pb-1 text-xs font-semibold tracking-wide text-[var(--text-secondary)] uppercase">
              Character
            </div>
            {ATTRIBUTE_COLUMNS.map((col) => (
              <div
                key={col.key}
                className="border-b border-[var(--border-subtle)] pb-1 text-xs font-semibold tracking-wide text-[var(--text-secondary)] uppercase"
              >
                {col.label}
              </div>
            ))}

            {guesses.length === 0 && (
              <p className="col-span-full py-4 text-sm text-[var(--text-muted)]">
                Your guesses will unfold here, row by row.
              </p>
            )}

            {guesses.map((guess, rowIndex) => {
              const isTarget = guess.id === currentCharacter.id;
              const results = compareCharacterGuess(guess, currentCharacter);
              const isNewestRow = rowIndex === guesses.length - 1;
              return (
                <div key={`${guess.id}-${rowIndex}`} className="contents">
                  <div
                    className={`flex items-center gap-2 rounded-lg border p-2 ${
                      isTarget
                        ? 'border-[var(--success-border)] bg-[var(--success-bg)]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-surface-raised)]'
                    }`}
                  >
                    <img src={guess.imageUrl} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
                    <span className="truncate text-sm font-medium text-[var(--text-primary)]">{guess.name}</span>
                  </div>
                  {results.map((result, colIndex) => (
                    <div
                      key={result.key}
                      className={`animate-card-unfold flex flex-col items-center justify-center gap-0.5 rounded-lg border p-2 text-center text-xs font-medium ${STATUS_CLASSES[result.status]}`}
                      style={isNewestRow ? { animationDelay: `${colIndex * 80}ms` } : undefined}
                      title={STATUS_LABEL[result.status]}
                    >
                      {STATUS_ICON[result.status] && <span aria-hidden="true">{STATUS_ICON[result.status]}</span>}
                      <span>{result.display}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {!feedback && (
        <div className="flex flex-wrap items-center gap-3">
          <CharacterSearchSelect onSelect={handleSelect} excludeIds={guessedIds} />
          <button
            type="button"
            onClick={handleReveal}
            disabled={guesses.length < MIN_GUESSES_FOR_REVEAL}
            title={
              guesses.length < MIN_GUESSES_FOR_REVEAL
                ? `Available after ${MIN_GUESSES_FOR_REVEAL} guesses`
                : undefined
            }
            className="hp-button rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-secondary)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Reveal answer
          </button>
        </div>
      )}

      {feedback && (
        <AnswerFeedback correct={feedback.correct} onNext={handleNext} nextLabel="Next character">
          <p>
            It was <strong>{feedback.characterName}</strong>
            {feedback.correct
              ? ` — solved in ${feedback.guessCount} guess${feedback.guessCount === 1 ? '' : 'es'}.`
              : '.'}
          </p>
        </AnswerFeedback>
      )}

      {showLegend && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setShowLegend(false)}
        >
          <div
            className="animate-pop-in w-full max-w-sm rounded-xl border border-[var(--border)] bg-[var(--bg-surface-raised)] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-[var(--house-primary)]">Color key</h3>
              <button
                type="button"
                onClick={() => setShowLegend(false)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <ul className="mt-4 flex flex-col gap-2 text-sm">
              {LEGEND_STATUSES.map((status) => (
                <li key={status} className="flex items-center gap-3">
                  <span
                    className={`flex h-6 w-10 items-center justify-center rounded text-xs font-bold text-[#05060d] ${LEGEND_SWATCH_CLASSES[status]}`}
                  >
                    {STATUS_ICON[status] ?? ''}
                  </span>
                  <span className="text-[var(--text-primary)]">{STATUS_LABEL[status]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
