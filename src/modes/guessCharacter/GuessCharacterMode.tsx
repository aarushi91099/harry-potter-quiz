import { useEffect, useMemo, useState } from 'react';
import { AnswerFeedback } from '../../components/AnswerFeedback';
import { CharacterSearchSelect } from '../../components/CharacterSearchSelect';
import { SessionHeader } from '../../components/SessionHeader';
import { characters } from '../../data/characters';
import type { Character } from '../../data/types';
import { ClueEngine } from '../../engine/ClueEngine';
import { QuestionEngine } from '../../engine/QuestionEngine';
import type { Attempt } from '../../engine/types';
import { useGameSession } from '../../store/useGameSession';
import { buildCharacterClues } from './buildCharacterClues';

interface Feedback {
  correct: boolean;
  characterName: string;
}

export function GuessCharacterMode() {
  const engine = useMemo(() => new QuestionEngine(characters), []);
  const [currentCharacter, setCurrentCharacter] = useState(() => engine.nextAny());
  const clueEngine = useMemo(
    () => (currentCharacter ? new ClueEngine(buildCharacterClues(currentCharacter)) : null),
    [currentCharacter],
  );
  const [, forceRerender] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const submitAnswer = useGameSession((s) => s.submitAnswer);
  const start = useGameSession((s) => s.start);

  useEffect(() => {
    start('guessCharacter');
  }, [start]);

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
    setCurrentCharacter(engine.nextAny());
  }

  if (!currentCharacter || !clueEngine) {
    return <p>No characters available.</p>;
  }

  const clues = feedback ? buildCharacterClues(currentCharacter) : clueEngine.visibleClues;

  return (
    <div className="flex flex-col gap-6">
      <SessionHeader />

      <ul
        data-character-id={currentCharacter.id}
        className="flex flex-col gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6"
      >
        {clues.map((clue, i) => (
          <li key={clue.category} className="animate-fade-in-up text-[var(--text-primary)]" style={{ animationDelay: `${i * 80}ms` }}>
            <span className="font-medium text-[var(--gold-bright)]">{clue.category}:</span> {clue.value}
          </li>
        ))}
      </ul>

      {!feedback && (
        <div className="flex flex-col gap-4">
          {clueEngine.hasMoreClues && (
            <button
              type="button"
              onClick={handleRevealNext}
              className="hp-button w-fit rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-secondary)]"
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
