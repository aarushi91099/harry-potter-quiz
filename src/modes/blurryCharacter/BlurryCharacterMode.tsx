import { useEffect, useMemo, useState } from 'react';
import { AnswerFeedback } from '../../components/AnswerFeedback';
import { CharacterSearchSelect } from '../../components/CharacterSearchSelect';
import { SessionHeader } from '../../components/SessionHeader';
import { characters } from '../../data/characters';
import type { Character } from '../../data/types';
import { BlurEngine } from '../../engine/BlurEngine';
import { QuestionEngine } from '../../engine/QuestionEngine';
import type { Attempt, Difficulty } from '../../engine/types';
import { useGameSession } from '../../store/useGameSession';

const BLUR_DURATION_MS = 15_000;

interface Feedback {
  correct: boolean;
  characterName: string;
  knownFor?: string;
}

export function BlurryCharacterMode({ difficulty }: { difficulty: Difficulty }) {
  const engine = useMemo(() => new QuestionEngine(characters), []);
  const [currentCharacter, setCurrentCharacter] = useState(() => engine.next(difficulty));
  const blurEngine = useMemo(() => new BlurEngine({ durationMs: BLUR_DURATION_MS }), [currentCharacter]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [, forceRerender] = useState(0);
  const submitAnswer = useGameSession((s) => s.submitAnswer);

  useEffect(() => {
    blurEngine.start();
    if (feedback) return;
    const interval = setInterval(() => forceRerender((n) => n + 1), 100);
    return () => clearInterval(interval);
  }, [blurEngine, feedback]);

  function handleSelect(character: Character) {
    if (!currentCharacter || feedback) return;
    const earliness = blurEngine.earlinessAt();
    const correct = character.id === currentCharacter.id;
    const attempt: Attempt = {
      mode: 'blurryCharacter',
      questionId: currentCharacter.id,
      difficulty: currentCharacter.difficulty,
      correct,
      context: { earliness },
    };
    submitAnswer(attempt);
    setFeedback({ correct, characterName: currentCharacter.name, knownFor: currentCharacter.knownFor });
  }

  function handleNext() {
    setFeedback(null);
    setCurrentCharacter(engine.next(difficulty));
  }

  if (!currentCharacter) {
    return <p>No characters available at this difficulty yet.</p>;
  }

  const blurPx = feedback ? 0 : blurEngine.blurPxAt();

  return (
    <div className="flex flex-col gap-6">
      <SessionHeader />

      <div className="flex justify-center rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900">
        <img
          src={currentCharacter.imageUrl}
          alt="Mystery character"
          loading="lazy"
          data-character-id={currentCharacter.id}
          className="h-48 w-48 rounded-full object-cover"
          style={{ filter: `blur(${blurPx}px)`, transition: 'filter 150ms linear' }}
        />
      </div>

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
