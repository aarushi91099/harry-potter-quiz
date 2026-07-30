import { useMemo, useState } from 'react';
import { AnswerFeedback } from '../../components/AnswerFeedback';
import { CharacterSearchSelect } from '../../components/CharacterSearchSelect';
import { SessionHeader } from '../../components/SessionHeader';
import { charactersById } from '../../data/characters';
import { quotes } from '../../data/quotes';
import type { Character } from '../../data/types';
import { QuestionEngine } from '../../engine/QuestionEngine';
import type { Attempt, Difficulty } from '../../engine/types';
import { useGameSession } from '../../store/useGameSession';

interface Feedback {
  correct: boolean;
  correctCharacterName: string;
}

export function QuotesMode({ difficulty }: { difficulty: Difficulty }) {
  const engine = useMemo(() => new QuestionEngine(quotes), []);
  const [currentQuote, setCurrentQuote] = useState(() => engine.next(difficulty));
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const submitAnswer = useGameSession((s) => s.submitAnswer);

  function handleSelect(character: Character) {
    if (!currentQuote || feedback) return;
    const correct = character.id === currentQuote.characterId;
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

  function handleNext() {
    setFeedback(null);
    setCurrentQuote(engine.next(difficulty));
  }

  if (!currentQuote) {
    return <p>No quotes available at this difficulty yet.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <SessionHeader />

      <blockquote className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-xl italic text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
        "{currentQuote.text}"
      </blockquote>

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
