import { useEffect, useMemo, useState } from 'react';
import { AnswerFeedback } from '../../components/AnswerFeedback';
import { SessionHeader } from '../../components/SessionHeader';
import { houseScenarios } from '../../data/houseScenarios';
import { QuestionEngine } from '../../engine/QuestionEngine';
import type { Attempt, HouseName } from '../../engine/types';
import { useGameSession } from '../../store/useGameSession';

const HOUSES: HouseName[] = ['Gryffindor', 'Ravenclaw', 'Hufflepuff', 'Slytherin'];

const HOUSE_COLOR: Record<HouseName, string> = {
  Gryffindor: '#e0263f',
  Ravenclaw: '#3b5bdb',
  Hufflepuff: '#ecc94b',
  Slytherin: '#2f9e56',
};

interface Feedback {
  correct: boolean;
  correctHouse: HouseName;
  reasoning: string;
}

export function GuessHouseMode() {
  const engine = useMemo(() => new QuestionEngine(houseScenarios), []);
  const [currentScenario, setCurrentScenario] = useState(() => engine.nextAny());
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const submitAnswer = useGameSession((s) => s.submitAnswer);
  const start = useGameSession((s) => s.start);

  useEffect(() => {
    start('guessHouse');
  }, [start]);

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
    setCurrentScenario(engine.nextAny());
  }

  if (!currentScenario) {
    return <p>No house scenarios available.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <SessionHeader />

      <div
        key={currentScenario.id}
        className="animate-pop-in rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 text-lg text-[var(--text-primary)]"
      >
        {currentScenario.prompt}
      </div>

      {!feedback && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {HOUSES.map((house) => (
            <button
              key={house}
              type="button"
              onClick={() => handleSelect(house)}
              style={{ borderColor: `${HOUSE_COLOR[house]}55` }}
              className="hp-button rounded-lg border bg-[var(--bg-surface)] px-3 py-3 font-medium text-[var(--text-primary)] hover:bg-white/5"
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
