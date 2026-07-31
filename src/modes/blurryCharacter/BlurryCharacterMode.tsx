import { useEffect, useMemo, useState } from 'react';
import { AnswerFeedback } from '../../components/AnswerFeedback';
import { CharacterSearchSelect } from '../../components/CharacterSearchSelect';
import { SessionHeader } from '../../components/SessionHeader';
import { characters } from '../../data/characters';
import type { Character } from '../../data/types';
import { QuestionEngine } from '../../engine/QuestionEngine';
import type { Attempt } from '../../engine/types';
import { useGameSession } from '../../store/useGameSession';

const MAX_ATTEMPTS = 10;
const MAX_BLUR_PX = 24;
const HINT_ATTEMPTS = { knownFor: 3, firstAppearance: 7 } as const;

interface Feedback {
  correct: boolean;
  characterName: string;
  knownFor?: string;
}

interface Hint {
  label: string;
  value: string;
}

export function BlurryCharacterMode() {
  const engine = useMemo(() => new QuestionEngine(characters), []);
  const [currentCharacter, setCurrentCharacter] = useState(() => engine.nextAny());
  const [wrongGuesses, setWrongGuesses] = useState<Character[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const submitAnswer = useGameSession((s) => s.submitAnswer);
  const start = useGameSession((s) => s.start);

  useEffect(() => {
    start('blurryCharacter');
  }, [start]);

  function handleSelect(character: Character) {
    if (!currentCharacter || feedback) return;

    if (character.id === currentCharacter.id) {
      const earliness = 1 - wrongGuesses.length / MAX_ATTEMPTS;
      const attempt: Attempt = {
        mode: 'blurryCharacter',
        questionId: currentCharacter.id,
        difficulty: currentCharacter.difficulty,
        correct: true,
        context: { earliness },
      };
      submitAnswer(attempt);
      setFeedback({ correct: true, characterName: currentCharacter.name, knownFor: currentCharacter.knownFor });
      return;
    }

    const nextWrongGuesses = [...wrongGuesses, character];
    setWrongGuesses(nextWrongGuesses);

    if (nextWrongGuesses.length >= MAX_ATTEMPTS) {
      const attempt: Attempt = {
        mode: 'blurryCharacter',
        questionId: currentCharacter.id,
        difficulty: currentCharacter.difficulty,
        correct: false,
        context: { earliness: 0 },
      };
      submitAnswer(attempt);
      setFeedback({ correct: false, characterName: currentCharacter.name, knownFor: currentCharacter.knownFor });
    }
  }

  function handleNext() {
    setFeedback(null);
    setWrongGuesses([]);
    setCurrentCharacter(engine.nextAny());
  }

  if (!currentCharacter) {
    return <p>No characters available.</p>;
  }

  const attemptsUsed = wrongGuesses.length;
  const blurPercent = Math.max(0, 100 - attemptsUsed * 10);
  const blurPx = feedback ? 0 : (blurPercent / 100) * MAX_BLUR_PX;

  const hints: Hint[] = [
    attemptsUsed >= HINT_ATTEMPTS.knownFor && currentCharacter.knownFor
      ? { label: 'Known for', value: currentCharacter.knownFor }
      : null,
    attemptsUsed >= HINT_ATTEMPTS.firstAppearance && currentCharacter.firstAppearance
      ? { label: 'First appeared in', value: currentCharacter.firstAppearance }
      : null,
  ].filter((hint): hint is Hint => hint !== null);

  return (
    <div className="flex flex-col gap-6">
      <SessionHeader />

      <div
        key={currentCharacter.id}
        className="animate-pop-in flex flex-col items-center gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6"
      >
        <img
          src={currentCharacter.imageUrl}
          alt="Mystery character"
          loading="lazy"
          data-character-id={currentCharacter.id}
          className="h-48 w-48 rounded-full object-cover ring-2 ring-[var(--house-primary)]/40"
          style={{
            filter: `blur(${blurPx}px)`,
            transition: 'filter 150ms linear',
            boxShadow: `0 0 32px -4px var(--house-glow)`,
          }}
        />
        {!feedback && (
          <p className="text-sm text-[var(--text-secondary)]">
            Guess {attemptsUsed + 1} of {MAX_ATTEMPTS}
          </p>
        )}
      </div>

      {hints.length > 0 && !feedback && (
        <ul className="animate-pop-in flex flex-col gap-1 rounded-xl border border-[var(--gold)]/40 bg-[var(--gold)]/10 p-4 text-sm">
          {hints.map((hint) => (
            <li key={hint.label} className="text-[var(--gold-bright)]">
              <span className="font-medium">{hint.label}:</span>{' '}
              <span className="text-[var(--text-primary)]">{hint.value}</span>
            </li>
          ))}
        </ul>
      )}

      {wrongGuesses.length > 0 && !feedback && (
        <ul className="flex flex-col gap-2">
          {wrongGuesses.map((guess, index) => (
            <li
              key={`${guess.id}-${index}`}
              className="animate-pop-in flex items-center gap-2 rounded-lg border border-[var(--danger-border)] bg-[var(--danger-bg)] p-2 text-sm text-[var(--danger)]"
            >
              <img src={guess.imageUrl} alt="" className="h-7 w-7 shrink-0 rounded-full object-cover" />
              <span className="font-medium">{guess.name}</span>
            </li>
          ))}
        </ul>
      )}

      {!feedback && <CharacterSearchSelect onSelect={handleSelect} />}

      {feedback && (
        <AnswerFeedback correct={feedback.correct} onNext={handleNext} nextLabel="Next character">
          <p>
            Answer: <strong>{feedback.characterName}</strong>
          </p>
          {feedback.knownFor && <p className="mt-2 text-sm">{feedback.knownFor}</p>}
        </AnswerFeedback>
      )}
    </div>
  );
}
