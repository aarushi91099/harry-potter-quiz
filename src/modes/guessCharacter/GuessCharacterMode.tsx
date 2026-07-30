import { useMemo, useState } from 'react';
import { AnswerFeedback } from '../../components/AnswerFeedback';
import { CharacterSearchSelect } from '../../components/CharacterSearchSelect';
import { SessionHeader } from '../../components/SessionHeader';
import { characters } from '../../data/characters';
import type { Character } from '../../data/types';
import { ClueEngine } from '../../engine/ClueEngine';
import { QuestionEngine } from '../../engine/QuestionEngine';
import type { Attempt, Difficulty } from '../../engine/types';
import { useGameSession } from '../../store/useGameSession';
import { buildCharacterClues } from './buildCharacterClues';

interface Feedback {
  correct: boolean;
  characterName: string;
}

export function GuessCharacterMode({ difficulty }: { difficulty: Difficulty }) {
  const engine = useMemo(() => new QuestionEngine(characters), []);
  const [currentCharacter, setCurrentCharacter] = useState(() => engine.next(difficulty));
  const clueEngine = useMemo(
    () => (currentCharacter ? new ClueEngine(buildCharacterClues(currentCharacter)) : null),
    [currentCharacter],
  );
  const [, forceRerender] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const submitAnswer = useGameSession((s) => s.submitAnswer);

  function handleRevealNext() {
    clueEngine?.revealNext();
    forceRerender((n) => n + 1);
  }

  function handleSelect(character: Character) {
    if (!currentCharacter || feedback || !clueEngine) return;
    const correct = character.id === currentCharacter.id;
    const attempt: Attempt = {
      mode: 'guessCharacter',
      questionId: currentCharacter.id,
      difficulty: currentCharacter.difficulty,
      correct,
      context: { cluesRevealed: clueEngine.cluesRevealed },
    };
    submitAnswer(attempt);
    setFeedback({ correct, characterName: currentCharacter.name });
  }

  function handleNext() {
    setFeedback(null);
    setCurrentCharacter(engine.next(difficulty));
  }

  if (!currentCharacter || !clueEngine) {
    return <p>No characters available at this difficulty yet.</p>;
  }

  const clues = feedback ? buildCharacterClues(currentCharacter) : clueEngine.visibleClues;

  return (
    <div className="flex flex-col gap-6">
      <SessionHeader />

      <ul
        data-character-id={currentCharacter.id}
        className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900"
      >
        {clues.map((clue) => (
          <li key={clue.category} className="text-slate-800 dark:text-slate-100">
            <span className="font-medium text-slate-500 dark:text-slate-400">{clue.category}:</span>{' '}
            {clue.value}
          </li>
        ))}
      </ul>

      {!feedback && (
        <div className="flex flex-col gap-4">
          {clueEngine.hasMoreClues && (
            <button
              type="button"
              onClick={handleRevealNext}
              className="w-fit rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-slate-600"
            >
              Reveal next clue
            </button>
          )}
          <CharacterSearchSelect onSelect={handleSelect} />
        </div>
      )}

      {feedback && (
        <AnswerFeedback correct={feedback.correct} onNext={handleNext} nextLabel="Next character">
          <p>
            Answer: <strong>{feedback.characterName}</strong>
          </p>
        </AnswerFeedback>
      )}
    </div>
  );
}
