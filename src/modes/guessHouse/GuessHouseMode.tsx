import { useMemo, useState } from 'react';
import { AnswerFeedback } from '../../components/AnswerFeedback';
import { SessionHeader } from '../../components/SessionHeader';
import { houseScenarios } from '../../data/houseScenarios';
import { QuestionEngine } from '../../engine/QuestionEngine';
import type { Attempt, Difficulty, HouseName } from '../../engine/types';
import { useGameSession } from '../../store/useGameSession';

const HOUSES: HouseName[] = ['Gryffindor', 'Ravenclaw', 'Hufflepuff', 'Slytherin'];

interface Feedback {
  correct: boolean;
  correctHouse: HouseName;
  reasoning: string;
}

export function GuessHouseMode({ difficulty }: { difficulty: Difficulty }) {
  const engine = useMemo(() => new QuestionEngine(houseScenarios), []);
  const [currentScenario, setCurrentScenario] = useState(() => engine.next(difficulty));
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const submitAnswer = useGameSession((s) => s.submitAnswer);

  function handleSelect(house: HouseName) {
    if (!currentScenario || feedback) return;
    const correct = house === currentScenario.correctHouse;
    const attempt: Attempt = {
      mode: 'guessHouse',
      questionId: currentScenario.id,
      difficulty: currentScenario.difficulty,
      correct,
    };
    submitAnswer(attempt);
    setFeedback({
      correct,
      correctHouse: currentScenario.correctHouse,
      reasoning: currentScenario.reasoning,
    });
  }

  function handleNext() {
    setFeedback(null);
    setCurrentScenario(engine.next(difficulty));
  }

  if (!currentScenario) {
    return <p>No house scenarios available at this difficulty yet.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <SessionHeader />

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-lg text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
        {currentScenario.prompt}
      </div>

      {!feedback && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {HOUSES.map((house) => (
            <button
              key={house}
              type="button"
              onClick={() => handleSelect(house)}
              className="rounded-lg border border-slate-300 px-3 py-3 font-medium hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
            >
              {house}
            </button>
          ))}
        </div>
      )}

      {feedback && (
        <AnswerFeedback correct={feedback.correct} onNext={handleNext} nextLabel="Next scenario">
          <p>
            Correct house: <strong>{feedback.correctHouse}</strong>
          </p>
          <p className="mt-2 text-sm">{feedback.reasoning}</p>
        </AnswerFeedback>
      )}
    </div>
  );
}
