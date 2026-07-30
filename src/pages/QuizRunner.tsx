import { useParams } from 'react-router-dom';
import { modeById } from '../data/modeCatalog';
import { QuotesMode } from '../modes/quotes/QuotesMode';
import { SpellVsVillainMode } from '../modes/spellVsVillain/SpellVsVillainMode';
import { GuessHouseMode } from '../modes/guessHouse/GuessHouseMode';
import { FinishDialogueMode } from '../modes/finishDialogue/FinishDialogueMode';
import { GuessCharacterMode } from '../modes/guessCharacter/GuessCharacterMode';
import { BlurryCharacterMode } from '../modes/blurryCharacter/BlurryCharacterMode';
import { GuessCreatureMode } from '../modes/guessCreature/GuessCreatureMode';
import { useGameSession } from '../store/useGameSession';
import type { QuizMode } from '../engine/types';

export function QuizRunner() {
  const { modeId } = useParams<{ modeId: string }>();
  const difficulty = useGameSession((s) => s.difficulty);
  const mode = modeById.get(modeId as QuizMode);

  if (!mode) {
    return <p>Unknown quiz mode.</p>;
  }

  switch (mode.id) {
    case 'quotes':
      return <QuotesMode difficulty={difficulty} />;
    case 'spellVsVillain':
      return <SpellVsVillainMode difficulty={difficulty} />;
    case 'guessHouse':
      return <GuessHouseMode difficulty={difficulty} />;
    case 'finishDialogue':
      return <FinishDialogueMode difficulty={difficulty} />;
    case 'guessCharacter':
      return <GuessCharacterMode difficulty={difficulty} />;
    case 'blurryCharacter':
      return <BlurryCharacterMode difficulty={difficulty} />;
    case 'guessCreature':
      return <GuessCreatureMode difficulty={difficulty} />;
  }
}
