import { useEffect, useMemo, useState } from 'react';
import { AnswerFeedback } from '../../components/AnswerFeedback';
import { CharacterSearchSelect } from '../../components/CharacterSearchSelect';
import { SessionHeader } from '../../components/SessionHeader';
import { charactersById } from '../../data/characters';
import { quotes } from '../../data/quotes';
import type { Character } from '../../data/types';
import { QuestionEngine } from '../../engine/QuestionEngine';
import type { Attempt } from '../../engine/types';
import { buildCharacterClues } from '../guessCharacter/buildCharacterClues';
import { useGameSession } from '../../store/useGameSession';

const MAX_CLUES = 2;

interface Feedback {
  correct: boolean;
  correctCharacterName: string;
}

/** Popular Quotes has no difficulty picker — it draws from the full quote pool and offers up to 2 hints on a wrong guess. */
export function QuotesMode() {
  const engine = useMemo(() => new QuestionEngine(quotes), []);
  const [currentQuote, setCurrentQuote] = useState(() => engine.nextAny());
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const submitAnswer = useGameSession((s) => s.submitAnswer);
  const start = useGameSession((s) => s.start);

  useEffect(() => {
    start('quotes', 'easy');
  }, [start]);

  const correctCharacter = currentQuote ? charactersById.get(currentQuote.characterId) : undefined;
  const clues = useMemo(
    () => (correctCharacter ? buildCharacterClues(correctCharacter) : []),
    [correctCharacter],
  );
  const visibleClues = clues.slice(0, wrongAttempts);

  function finalize(correct: boolean) {
    if (!currentQuote) return;
    const attempt: Attempt = {
      mode: 'quotes',
      questionId: currentQuote.id,
      difficulty: currentQuote.difficulty,
      correct,
    };
    submitAnswer(attempt);
    setFeedback({
      correct,
      correctCharacterName: charactersById.get(currentQuote.characterId)?.name ?? 'Unknown',
    });
  }

  function handleSelect(character: Character) {
    if (!currentQuote || feedback) return;

    if (character.id === currentQuote.characterId) {
      finalize(true);
      return;
    }

    if (wrongAttempts < MAX_CLUES) {
      setWrongAttempts((n) => n + 1);
      return;
    }

    finalize(false);
  }

  function handleNext() {
    setFeedback(null);
    setWrongAttempts(0);
    setCurrentQuote(engine.nextAny());
  }

  if (!currentQuote) {
    return <p>No quotes available.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <SessionHeader />

      <blockquote className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-xl italic text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
        "{currentQuote.text}"
      </blockquote>

      {visibleClues.length > 0 && !feedback && (
        <ul className="flex flex-col gap-1 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-900 dark:bg-amber-950">
          {visibleClues.map((clue) => (
            <li key={clue.category} className="text-amber-900 dark:text-amber-200">
              <span className="font-medium">{clue.category}:</span> {clue.value}
            </li>
          ))}
        </ul>
      )}

      {!feedback && <CharacterSearchSelect onSelect={handleSelect} />}

      {feedback && (
        <AnswerFeedback correct={feedback.correct} onNext={handleNext} nextLabel="Next quote">
          <p>
            Said by <strong>{feedback.correctCharacterName}</strong> — {currentQuote.sourceTitle} (
            {currentQuote.source})
          </p>
          {currentQuote.funFact && <p className="mt-2 text-sm">{currentQuote.funFact}</p>}
        </AnswerFeedback>
      )}
    </div>
  );
}
